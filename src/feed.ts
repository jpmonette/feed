import renderAtom from "./atom1";
import renderJSON from "./json";
import renderRSS from "./rss2";
import type { Author, Category, Enclosure, Extension, FeedOptions, Item } from "./typings";

export type { Author, Category, Enclosure, Extension, FeedOptions, Item };

export class Feed {
  options: FeedOptions;
  items: Item[] = [];
  categories: string[] = [];
  contributors: Author[] = [];
  extensions: Extension[] = [];

  constructor(options: FeedOptions) {
    this.options = options;
  }

  public addItem(item: Item): void {
    this.items.push(item);
  }

  public addCategory(category: string): void {
    this.categories.push(category);
  }

  public addContributor(contributor: Author): void {
    this.contributors.push(contributor);
  }

  public addExtension(extension: Extension): void {
    this.extensions.push(extension);
  }

  public atom1(): string {
    return renderAtom(this);
  }

  public rss2(): string {
    return renderRSS(this);
  }

  public json1(): string {
    return renderJSON(this);
  }
}
