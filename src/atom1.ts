import * as convert from "xml-js";
import { generator } from "./config";
import type { Feed } from "./feed";
import type { Author, Category, Enclosure, Item } from "./typings";
import { sanitize } from "./utils";

export default (ins: Feed) => {
  const { options } = ins;

  const base: convert.ElementCompact = {
    _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
    _instruction: {},
    feed: {
      _attributes: { xmlns: "http://www.w3.org/2005/Atom" },
      id: options.id,
      title: options.title,
      updated: options.updated?.toISOString() ?? new Date().toISOString(),
      ...(options.generator === false ? {} : { generator: sanitize(options.generator ?? generator) }),
    },
  };

  if (options.stylesheet) {
    base._instruction = {
      "xml-stylesheet": {
        _attributes: {
          href: options.stylesheet,
          type: "text/xsl",
        },
      },
    };
  } else {
    delete base._instruction;
  }

  if (options.author) {
    base.feed.author = formatAuthor(options.author);
  }

  base.feed.link = [];

  if (options.link) {
    base.feed.link.push({ _attributes: { rel: "alternate", href: sanitize(options.link) } });
  }

  const atomLink = options.feed ?? options.feedLinks?.atom;

  if (atomLink) {
    base.feed.link.push({ _attributes: { rel: "self", href: sanitize(atomLink) } });
  }

  if (options.hub) {
    base.feed.link.push({ _attributes: { rel: "hub", href: sanitize(options.hub) } });
  }

  if (options.description) {
    base.feed.subtitle = options.description;
  }

  if (options.image) {
    base.feed.logo = options.image;
  }

  if (options.favicon) {
    base.feed.icon = options.favicon;
  }

  if (options.copyright) {
    base.feed.rights = options.copyright;
  }

  base.feed.category = [];

  ins.categories.forEach((category: string) => {
    base.feed.category.push({ _attributes: { term: sanitize(category) } });
  });

  base.feed.contributor = [];

  ins.contributors.forEach((contributor: Author) => {
    base.feed.contributor.push(formatAuthor(contributor));
  });

  base.feed.entry = [];

  ins.items.forEach((item: Item) => {
    const entry: convert.ElementCompact = {
      title: { _attributes: { type: "html" }, _cdata: item.title },
      id: sanitize(item.id ?? item.link),
      link: [{ _attributes: { href: sanitize(item.link) } }],
      updated: item.date.toISOString(),
    };

    if (item.description) {
      entry.summary = {
        _attributes: { type: "html" },
        _cdata: item.description,
      };
    }

    if (item.content) {
      entry.content = {
        _attributes: { type: "html" },
        _cdata: item.content,
      };
    }

    if (Array.isArray(item.author)) {
      entry.author = [];

      item.author.forEach((author: Author) => {
        entry.author.push(formatAuthor(author));
      });
    }

    if (Array.isArray(item.category)) {
      entry.category = [];

      item.category.forEach((category: Category) => {
        entry.category.push(formatCategory(category));
      });
    }

    if (item.enclosure) {
      entry.link.push(formatEnclosure(item.enclosure));
    }

    if (item.image) {
      entry.link.push(formatEnclosure(item.image, "image"));
    }

    if (item.audio) {
      entry.link.push(formatEnclosure(item.audio, "audio"));
    }

    if (item.video) {
      entry.link.push(formatEnclosure(item.video, "video"));
    }

    if (item.contributor && Array.isArray(item.contributor)) {
      entry.contributor = [];

      item.contributor.forEach((contributor: Author) => {
        entry.contributor.push(formatAuthor(contributor));
      });
    }

    if (item.published) {
      entry.published = item.published.toISOString();
    }

    if (item.copyright) {
      entry.rights = item.copyright;
    }

    base.feed.entry.push(entry);
  });

  return convert.js2xml(base, { compact: true, ignoreComment: true, spaces: 4 });
};

const formatAuthor = (author: Author) => {
  const { name, email, link } = author;

  const out: { name?: string; email?: string; uri?: string } = { name };
  if (email) {
    out.email = email;
  }

  if (link) {
    out.uri = sanitize(link);
  }

  return out;
};

const formatEnclosure = (enclosure: string | Enclosure, mimeCategory = "image") => {
  if (typeof enclosure === "string") {
    const sanitizedUrl = sanitize(enclosure);
    const type = new URL(sanitizedUrl!).pathname.split(".").slice(-1)[0];
    return { _attributes: { rel: "enclosure", href: sanitizedUrl, type: `${mimeCategory}/${type}` } };
  }

  const sanitizedUrl = sanitize(enclosure.url);
  const type = new URL(sanitizedUrl!).pathname.split(".").slice(-1)[0];
  return {
    _attributes: {
      rel: "enclosure",
      href: sanitizedUrl,
      title: enclosure.title,
      type: `${mimeCategory}/${type}`,
      length: enclosure.length,
    },
  };
};

const formatCategory = (category: Category) => {
  const { name, scheme, term } = category;

  return {
    _attributes: {
      label: sanitize(name),
      scheme: sanitize(scheme),
      term: sanitize(term),
    },
  };
};
