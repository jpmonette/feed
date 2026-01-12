import * as convert from "xml-js";
import { generator } from "./config";
import type { Feed } from "./feed";
import type { Author, Category, Enclosure, Item } from "./typings";
import { sanitize } from "./utils";

/**
 * Returns an Atom feed
 * @param ins
 */
export default (ins: Feed) => {
  const { options } = ins;

  const base: any = {
    _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
    _instruction: {},
    feed: {
      _attributes: { xmlns: "http://www.w3.org/2005/Atom" },
      id: options.id,
      title: options.title,
      updated: options.updated ? options.updated.toISOString() : new Date().toISOString(),
      generator: sanitize(options.generator ?? generator),
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

  // link (rel="alternate")
  if (options.link) {
    base.feed.link.push({ _attributes: { rel: "alternate", href: sanitize(options.link) } });
  }

  // link (rel="self")
  const atomLink = options.feed ?? (options.feedLinks && options.feedLinks.atom);

  if (atomLink) {
    base.feed.link.push({ _attributes: { rel: "self", href: sanitize(atomLink) } });
  }

  // link (rel="hub")
  if (options.hub) {
    base.feed.link.push({ _attributes: { rel: "hub", href: sanitize(options.hub) } });
  }

  /**************************************************************************
   * "feed" node: optional elements
   *************************************************************************/

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
    base.feed.category.push({ _attributes: { term: category } });
  });

  base.feed.contributor = [];

  ins.contributors.forEach((contributor: Author) => {
    base.feed.contributor.push(formatAuthor(contributor));
  });

  // icon

  base.feed.entry = [];

  /**************************************************************************
   * "entry" nodes
   *************************************************************************/
  ins.items.forEach((item: Item) => {
    //
    // entry: required elements
    //

    const entry: convert.ElementCompact = {
      title: { _attributes: { type: "html" }, _cdata: item.title },
      id: sanitize(item.id ?? item.link),
      link: [{ _attributes: { href: sanitize(item.link) } }],
      updated: item.date.toISOString(),
    };

    //
    // entry: recommended elements
    //
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

    // entry author(s)
    if (Array.isArray(item.author)) {
      entry.author = [];

      item.author.forEach((author: Author) => {
        entry.author.push(formatAuthor(author));
      });
    }

    // content

    // link - relative link to article

    //
    // entry: optional elements
    //

    // category
    if (Array.isArray(item.category)) {
      entry.category = [];

      item.category.forEach((category: Category) => {
        entry.category.push(formatCategory(category));
      });
    }

    /**
     * Item Enclosure
     * https://validator.w3.org/feed/docs/atom.html#link
     */
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

    // contributor
    if (item.contributor && Array.isArray(item.contributor)) {
      entry.contributor = [];

      item.contributor.forEach((contributor: Author) => {
        entry.contributor.push(formatAuthor(contributor));
      });
    }

    // published
    if (item.published) {
      entry.published = item.published.toISOString();
    }

    // source

    // rights
    if (item.copyright) {
      entry.rights = item.copyright;
    }

    base.feed.entry.push(entry);
  });

  return convert.js2xml(base, { compact: true, ignoreComment: true, spaces: 4 });
};

/**
 * Returns a formatted author
 * @param author
 */
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

/**
 * Returns a formated enclosure
 * @param enclosure
 * @param mimeCategory
 */
const formatEnclosure = (enclosure: string | Enclosure, mimeCategory = "image") => {
  if (typeof enclosure === "string") {
    const detectedType = new URL(enclosure).pathname.split(".").slice(-1)[0];
    return { _attributes: { rel: "enclosure", href: enclosure, type: `${mimeCategory}/${detectedType}` } };
  }
  // For object enclosures, respect the explicit type if provided.
  // Otherwise fall back to MIME category plus detected extension.
  let type: string | undefined = enclosure.type;
  if (!type || type.trim() === "") {
    const detectedType = new URL(enclosure.url).pathname.split(".").slice(-1)[0];
    type = `${mimeCategory}/${detectedType}`;
  }
  return {
    _attributes: {
      rel: "enclosure",
      href: enclosure.url,
      title: enclosure.title,
      type,
      length: enclosure.length,
    },
  };
};

/**
 * Returns a formatted category
 * @param category
 */
const formatCategory = (category: Category) => {
  const { name, scheme, term } = category;

  return {
    _attributes: {
      label: name,
      scheme,
      term,
    },
  };
};
