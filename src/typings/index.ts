export interface Item {
  title: string;
  id?: string;
  link: string;
  date: Date;

  description?: string;
  content?: string;

  guid?: string;

  image?: string;

  author?: Author[];
  contributor?: Author[];

  published?: Date;
  copyright?: string;

  extensions?: Extension[];
}

export interface Author {
  name?: string;
  email?: string;
  link?: string;
}

export interface FeedOptions {
  id: string;
  title: string;
  updated?: Date;
  generator?: string;
  language?: string;

  feed?: string;
  feedLinks?: any;
  hub?: string;

  author?: Author;
  link?: string;
  description?: string;
  image?: string;
  favicon?: string;
  copyright: string;
}

export interface Extension {
  name: string;
  objects: any;
}
