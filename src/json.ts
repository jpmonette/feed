import type { Feed } from "./feed";
import type { Category, Extension, Item } from "./typings";
import { toArray } from "./utils";

/**
 * Returns a JSON feed
 * @param ins
 */
export default (ins: Feed) => {
  const { options, items, extensions } = ins;

  const feed: any = {
    version: "https://jsonfeed.org/version/1.1",
    title: options.title,
  };

  if (options.link) {
    feed.home_page_url = options.link;
  }

  if (options.feedLinks && options.feedLinks.json) {
    feed.feed_url = options.feedLinks.json;
  }

  if (options.description) {
    feed.description = options.description;
  }

  if (options.image) {
    feed.icon = options.image;
  }

  if (options.author) {
    feed.authors = toArray(options.author).map((author) => ({
      name: author.name,
      url: author.link,
      avatar: author.avatar,
    }));
  }

  extensions.forEach((e: Extension) => {
    feed[e.name] = e.objects;
  });

  feed.items = items.map((item: Item) => {
    const feedItem: any = {
      id: item.id,
      // json_feed distinguishes between html and text content
      // but since we only take a single type, we'll assume HTML
      content_html: item.content ?? item.description,
    };
    if (item.link) {
      feedItem.url = item.link;
    }
    if (item.title) {
      feedItem.title = item.title;
    }
    if (item.description && item.content) {
      feedItem.summary = item.description;
    }

    if (item.image) {
      feedItem.image = item.image;
    }

    if (item.date) {
      feedItem.date_modified = item.date.toISOString();
    }
    if (item.published) {
      feedItem.date_published = item.published.toISOString();
    }

    if (item.author) {
      feedItem.authors = item.author.map((author) => ({
        name: author.name,
        url: author.link,
        avatar: author.avatar,
      }));
    }

    if (Array.isArray(item.category)) {
      feedItem.tags = [];
      item.category.forEach((category: Category) => {
        if (category.name) {
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
