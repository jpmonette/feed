import type { Feed } from "./feed";
import type { Category, Extension, Item } from "./typings";
import { sanitize, sanitizeUrl } from "./utils";

interface JsonFeedAuthor {
  name?: string;
  url?: string;
  avatar?: string;
}

interface JsonFeedItem {
  id: string;
  content_html?: string;
  url?: string;
  title?: string;
  summary?: string;
  image?: string;
  date_modified?: string;
  date_published?: string;
  author?: JsonFeedAuthor;
  tags?: string[];
  [key: string]: unknown;
}

interface JsonFeed {
  version: string;
  title: string;
  home_page_url?: string;
  feed_url?: string;
  description?: string;
  icon?: string;
  author?: JsonFeedAuthor;
  items: JsonFeedItem[];
  [key: string]: unknown;
}

export default (ins: Feed) => {
  const { options, items, extensions } = ins;

  const feed: JsonFeed = {
    version: "https://jsonfeed.org/version/1",
    title: options.title,
    items: []
  };

  if (options.link) {
    feed.home_page_url = sanitizeUrl(options.link);
  }

  if (options.feedLinks?.json) {
    feed.feed_url = sanitizeUrl(options.feedLinks.json);
  }

  if (options.description) {
    feed.description = options.description;
  }

  if (options.image) {
    feed.icon = sanitizeUrl(options.image);
  }

  if (options.author) {
    feed.author = {};
    if (options.author.name) {
      feed.author.name = options.author.name;
    }
    if (options.author.link) {
      feed.author.url = sanitizeUrl(options.author.link);
    }
    if (options.author.avatar) {
      feed.author.avatar = options.author.avatar;
    }
  }

  extensions.forEach((e: Extension) => {
    feed[e.name] = e.objects;
  });

  feed.items = items.map((item: Item) => {
    const feedItem: JsonFeedItem = {
      id: sanitize(item.id) ?? sanitizeUrl(item.link),
      content_html: item.content ?? item.description,
    };
    if (item.link) {
      feedItem.url = sanitizeUrl(item.link);
    }
    if (item.title) {
      feedItem.title = item.title;
    }
    if (item.description && item.content) {
      feedItem.summary = item.description;
    }

    if (item.image) {
      feedItem.image = typeof item.image === "string" ? item.image : sanitizeUrl(item.image.url);
    }

    if (item.date) {
      feedItem.date_modified = item.date.toISOString();
    }
    if (item.published) {
      feedItem.date_published = item.published.toISOString();
    }

    if (Array.isArray(item.author)) {
      const author = item.author[0];
      feedItem.author = {};
      if (author?.name) {
        feedItem.author.name = author.name;
      }
      if (author?.link) {
        feedItem.author.url = sanitizeUrl(author.link);
      }
      if (author?.avatar) {
        feedItem.author.avatar = author.avatar;
      }
    }

    if (Array.isArray(item.category)) {
      item.category.forEach((category: Category) => {
        if (category.name) {
          if (!feedItem.tags) feedItem.tags = [];
          feedItem.tags.push(category.name);
        }
      });
    }

    if (item.extensions) {
      item.extensions.forEach((e: Extension) => {
        feedItem[e.name] = e.objects;
      });
    }

    return feedItem;
  });

  return JSON.stringify(feed, null, 4);
};
