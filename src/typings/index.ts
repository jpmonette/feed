export interface Item {
  /**
   * Item title
   */
  title: string;
  /**
   * Unique identifier (Atom/JSON). Fallbacks to the `link` if not provided.
   */
  id?: string;
  /**
   * URL to the item
   */
  link: string | URL;
  /**
   * Last modified/updated date
   */
  date: Date;

  /**
   * Brief summary or excerpt
   * @default undefined
   */
  description?: string;
  /**
   * Full content (HTML allowed)
   */
  content?: string;
  /**
   * Item categories
   * @default undefined
   */
  category?: Category[];

  /**
   * RSS-specific GUID. Fallbacks to the `id` or the `link` if not provided.
   * @default undefined
   */
  guid?: string;

  /**
   * Image attachment
   * @default undefined
   */
  image?: string | Enclosure;
  /**
   * Audio attachment
   * @default undefined
   */
  audio?: string | Enclosure;
  /**
   * Video attachment
   * @default undefined
   */
  video?: string | Enclosure;
  /**
   * Generic media enclosure
   * @default undefined
   */
  enclosure?: Enclosure;

  /**
   * Item authors
   * @default undefined
   */
  author?: Author[];
  /**
   * Item contributors
   * @default undefined
   */
  contributor?: Author[];

  /**
   * Original publication date
   * @default undefined
   */
  published?: Date;
  /**
   * Item copyright notice
   * @default undefined
   */
  copyright?: string;

  /**
   * Custom extensions
   * @default undefined
   */
  extensions?: Extension[];
}

export interface Enclosure {
  /**
   * Enclosure URL
   */
  url: string | URL;
  /**
   * MIME type
   * @example "audio/mpeg"
   * @default undefined
   */
  type?: string;
  /**
   * File size in bytes
   * @default undefined
   */
  length?: number;
  /**
   * Enclosure title
   * @default undefined
   */
  title?: string;
  /**
   * Duration in seconds (for podcasts)
   * @default undefined
   */
  duration?: number;
}

export interface Author {
  /**
   * Author name
   * @default undefined
   */
  name?: string;
  /**
   * Author email
   * @default undefined
   */
  email?: string;
  /**
   * Author link
   * @default undefined
   */
  link?: string | URL;
  /**
   * Author avator (only used in JSON feed)
   * @default undefined
   */
  avatar?: string;
}

export interface Category {
  /**
   * Category name
   * @default undefined
   */
  name?: string;
  /**
   * Category domain (RSS-only)
   * @default undefined
   */
  domain?: string;
  /**
   * Category scheme (Atom-only)
   * @default undefined
   */
  scheme?: string;
  /**
   * Category term (Atom-only)
   * @default undefined
   */
  term?: string;
}

export interface FeedOptions {
  /**
   * Feed identifier (required for Atom)
   * @default undefined
   */
  id?: string;
  /**
   * Feed title
   */
  title: string;
  /**
   * Last update date
   * @default new Date()
   */
  updated?: Date;
  /**
   * Feed generator. Defaults to the library's URL.
   * Pass `false` to omit the `<generator>` element entirely.
   * @default "https://github.com/jpmonette/feed"
   */
  generator?: string | false;
  /**
   * Language code
   * @example "en"
   * @example "fr-CA"
   * @default undefined
   */
  language?: string;
  /**
   * Time to live in minutes
   * @default undefined
   */
  ttl?: number;
  /**
   * URL to an XSL stylesheet
   * @default undefined
   */
  stylesheet?: string | URL;

  /**
   * Self-referencing feed URL
   * @default undefined
   */
  feed?: string | URL;
  /**
   * Links to other feed formats
   * @default undefined
   */
  feedLinks?: {
    /**
     * RSS feed alternate URL. Prioritizes `feed` string value.
     * @default undefined
     */
    rss?: string | URL;
    /**
     * Atom feed alternate URL. Prioritizes `feed` string value.
     * @default undefined
     */
    atom?: string | URL;
    /**
     * JSON feed alternate URL
     * @default undefined
     */
    json?: string | URL;
    [key: string]: string | URL | undefined;
  };
  /**
   * WebSub/PubSubHubbub hub URL
   * @default undefined
   */
  hub?: string | URL;
  /**
   * RSS specification docs URL, only used for RSS outputs
   * @default "https://validator.w3.org/feed/docs/rss2.html"
   */
  docs?: string | URL;

  /**
   * Enable iTunes/Google podcast extensions
   * @default undefined
   */
  podcast?: boolean;
  /**
   * Podcast category name
   * @default undefined
   */
  category?: string;

  /**
   * Feed author
   * @default undefined
   */
  author?: Author;
  /**
   * URL to the feed's website
   * @default undefined
   */
  link?: string | URL;
  /**
   * Feed description/subtitle
   * @default undefined
   */
  description?: string;
  /**
   * URL to feed image/logo
   * @default undefined
   */
  image?: string | URL;
  /**
   * URL to feed favicon
   * @default undefined
   */
  favicon?: string | URL;
  /**
   * Copyright notice
   * @default undefined
   */
  copyright?: string;
}

export interface Extension {
  /**
   * Extension name
   */
  name: string;
  /**
   * Extension objects
   */
  objects: Record<string, unknown>;
}
