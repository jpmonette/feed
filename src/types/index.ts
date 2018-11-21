interface Item {
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
  elements?: any[];
}

interface Author {
  name?: string;
  email?: string;
  link?: string;
}

interface FeedOptions {
  id: string;
  title: string;
  updated?: Date;
  generator?: string;

  feed: string;
  feedLinks: any;
  hub?: string;

  author?: Author;
  link?: string;
  description?: string;
  image?: string;
  favicon?: string;
  copyright: string;
}

interface Feed {
  options: FeedOptions;
  items: Item[];
  categories: string[];
  contributors: Author[];
  extensions: Extension[];
  namespaces: any;
  elements?: any[];
}

interface Extension {
  name: string;
  objects: any;
}
