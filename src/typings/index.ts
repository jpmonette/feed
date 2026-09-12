export interface Item {
  title: string;
  id?: string;
  link: string;
  date: Date;

  description?: string;
  content?: string;
  category?: Category[];

  guid?: string;
  /**
   * Explicitly control the `isPermaLink` attribute on the RSS 2.0 `<guid>` element.
   *
   * If omitted, the existing inference is used: `false` when `guid` or `id`
   * is set, `true` when only `link` is set. Pass `true` or `false` here to
   * override that inference, e.g. when `id`/`guid` happens to be a real,
   * permanent URL (`true`) or when `link` is a permanent URL but `id`/`guid`
   * is an opaque, non-URL identifier that should stay `false`.
   */
  isPermaLink?: boolean;

  image?: string | Enclosure;
  audio?: string | Enclosure;
  video?: string | Enclosure;
  enclosure?: Enclosure;

  author?: Author[];
  contributor?: Author[];

  published?: Date;
  copyright?: string;

  extensions?: Extension[];
}

export interface Enclosure {
  url: string;
  type?: string;
  length?: number;
  title?: string;
  duration?: number;
}

export interface Author {
  name?: string;
  email?: string;
  link?: string;
  avatar?: string;
}

export interface Category {
  name?: string;
  domain?: string;
  scheme?: string;
  term?: string;
}

export interface FeedOptions {
  id?: string;
  title: string;
  updated?: Date;
  /**
   * Feed generator. Defaults to the library's URL.
   * Pass `false` to omit the `<generator>` element entirely.
   */
  generator?: string | false;
  language?: string;
  ttl?: number;
  stylesheet?: string;

  feed?: string;
  feedLinks?: {
    rss?: string;
    atom?: string;
    json?: string;
    [key: string]: string | undefined;
  };
  hub?: string;
  docs?: string;

  podcast?: boolean;
  category?: string;

  author?: Author;
  link?: string;
  description?: string;
  image?: string;
  favicon?: string;
  copyright?: string;
}

export interface Extension {
  name: string;
  objects: Record<string, unknown>;
}
