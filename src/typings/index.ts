export interface Item {
  /**
   * Title of this item.
   */
  title: string;

  // TODO: is the following correct ? 
  /**
   * URL to this item.
   */
  id?: string;

  /**
   * URL to the post corresponding to this item.
   */
  link: string;

  /**
   * Last time the content of this item changed.
   */
  date: Date;

  /**
   * A short description of this item.
   */
  description?: string;

  /**
   * Content of this item.
   */
  content?: string;

  category?: Category[];

  guid?: string;

  image?: string | Enclosure;
  audio?: string | Enclosure;
  video?: string | Enclosure;
  enclosure?: Enclosure;

  author?: Author[];
  contributor?: Author[];

  /**
   * Publication date of this item.
   */
  published?: Date;
  /**
   * Copyright information for this item.
   */
  copyright?: string;

  extensions?: Extension[];
}

export interface Enclosure {
  /**
   * URL of the media object.
   * 
   * - JSON: 
   * - Atom:
   * - RSS: `url` (required, string)
   */
  url: string;

  /**
   * MIME type of the media object.
   * 
   * - JSON:
   * - Atom:
   * - RSS: `type` (required, string)
   */
  type?: string;

  /**
   * Size of the media object.
   * 
   * - JSON:
   * - Atom:
   * - RSS: `length` (required, number) (use 0 when the size cannot be determined)
   */
  length?: number;

  /**
   * Title of the media object.
   * 
   * - JSON:
   * - Atom:
   * - RSS: **unused**
   */
  title?: string;

  /**
   * Duration of the media object.
   * 
   * - JSON:
   * - Atom:
   * - RSS: **unused**
   */
  duration?: number;
}

// Missing fields:
//
// - JSON:
//   - avatar (optional, string)
export interface Author {
  /**
   * Name of the author.
   * 
   * - JSON: `name` (optional, string)
   * - Atom:
   * - RSS:
   */
  name?: string;

  /**
   * Email of the author.
   * 
   * - JSON: **unused**
   * - Atom:
   * - RSS:
   */
  email?: string;

  /**
   * URL to the author.
   * 
   * - JSON: `url` (optional, string)
   * - Atom:
   * - RSS:
   */
  link?: string;
}

export interface Category {
  name?: string;
  domain?: string;
  scheme?: string;
  term?: string;
}

// Missing fields:
//
// - JSON:
//   - user_comment (optional, string)
//   - next_url (optional, string)
//   - expired (optional, boolean)
export interface FeedOptions {
  // TODO: is the following correct ? 
  /**
   * URL to this feed.
   * 
   * - JSON: **unused**
   * - Atom:
   * - RSS: **unused**
   */
  id: string;

  /**
   * Name of the feed or your website.
   * 
   * - JSON: `title` (required, string)
   * - Atom:
   * - RSS: `title` (required, string)
   */
  title: string;

  /**
   * Last time the content of this feed changed.
   * 
   * - JSON: **unused**
   * - Atom:
   * - RSS: `lastBuildDate` (optional, Date)
   */
  updated?: Date;

  /**
   * Name of the program used to generate this feed.
   * 
   * - JSON: **unused**
   * - Atom:
   * - RSS: `generator` (optional, string)
   */
  generator?: string;

  /**
   * Language of the content of this feed.
   * 
   * - JSON: `language` (optional, string)
   * - Atom:
   * - RSS: `language` (optional, string)
   */
  language?: string;

  /**
   * Number of minutes this feed can be cached before refreshing from source.
   * 
   * - JSON: **unused**
   * - Atom:
   * - RSS: `ttl` (optional, number)
   */
  ttl?: number;

  /**
   * URL to this feed.
   * > URLs of the feed, and serves as the unique identifier for the feed. ?
   * 
   * - JSON: **unused**
   * - Atom:
   * - RSS: `atom:link` (not specified but recommanded by w3c, string) (Atom namespace)
   */
  feed?: string;

  /**
   * URLs of the feed, and serves as the unique identifier for the feed.
   * 
   * - JSON: `feed_url` (optional but strongly recommended, string)
   * - Atom:
   * - RSS: `atom:link` (not specified but recommanded by w3c, string) (Atom namespace)
   */
  feedLinks?: {
    atom?: string;
    json?: string;
    rss?: string;
  };

  /**
   * URL to a hub for this feed.
   * 
   * - JSON: hubs (very optional, array of objects)
   * - Atom:
   * - RSS: **unused**
   */
  hub?: string;

  /**
   * URL to the documentation of the software that created the feed.
   * 
   * - JSON: **unused**
   * - Atom:
   * - RSS: `docs` (optional, string)
   */
  docs?: string;

  /**
   * Author details of this feed.
   * 
   * - JSON v1: `author` (optional, object)
   * - JSON v1.1: `authors` (optional, array of objects)
   * - Atom:
   * - RSS: `author` (optional, string)
   */
  author?: Author;

  /**
   * URL to the website described by the feed.
   * 
   * - JSON: `home_page_url` (optional but strongly recommended, string)
   * - Atom:
   * - RSS: `link` (required, string)
   */
  link?: string;

  /**
   * A short description of this feed.
   * 
   * - JSON: `description` (optional, string)
   * - Atom:
   * - RSS: `description` (required, string)
   */
  description?: string;

  /**
   * The URL to an image for feed readers to display.
   * 
   * - JSON: `icon` (optional, string)
   * - Atom:
   * - RSS: `image` (optional, object)
   */
  image?: string;

  /**
   * URL to a favicon for feed readers to use.
   * 
   * - JSON: `favicon` (optional, string)
   * - Atom:
   * - RSS: **unused**
   */
  favicon?: string;

  /**
   * Copyright information for this feed.
   * 
   * - JSON: **unused**
   * - Atom:
   * - RSS: `copyright` (optional, string)
   */
  copyright: string;
}

export interface Extension {
  name: string;
  objects: any;
}
