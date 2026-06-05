import { createSampleFeed, sampleFeed } from "./setup";

describe("json 1", () => {
  it("should generate a valid feed", () => {
    const actual = sampleFeed.json1();
    expect(() => JSON.parse(actual)).not.toThrow();
    expect(actual).toMatchSnapshot();
  });

  it("should handle multiple authors", () => {
    const multipleAuthorFeed = createSampleFeed({
      authors: [{ name: "John" }, { link: "https://example.org/clair" }, { avatar: "https://example.org/eva.jpeg" }],
    });
    const actual = multipleAuthorFeed.json1();
    const feed = JSON.parse(actual);

    expect(feed).toHaveProperty("authors");
    expect(feed.authors).toBeInstanceOf(Array);
    expect(feed.authors.length).toBe(3);
    expect(feed.authors).toMatchSnapshot();
  });

  it('should handle single author via "authors" field', () => {
    const actual = sampleFeed.json1();
    const feed = JSON.parse(actual);

    expect(feed).toHaveProperty("authors");
    expect(feed.authors).toBeInstanceOf(Array);
    expect(feed.authors.length).toBe(1);
    expect(feed.authors).toMatchSnapshot();
  });

  it("should handle multiple authors for items", () => {
    const actual = sampleFeed.json1();
    const feed = JSON.parse(actual);
    const item = feed.items[0];

    expect(item).toHaveProperty("authors");
    expect(item.authors).toBeInstanceOf(Array);
    expect(item.authors.length).toBe(3);
    expect(item.authors).toMatchSnapshot();
  });

  it('should handle single author of item via "authors" field', () => {
    const singleAuthorItemFeed = createSampleFeed({
      itemAuthors: [
        {
          name: "John Doe",
        },
      ],
    });
    const actual = singleAuthorItemFeed.json1();
    const feed = JSON.parse(actual);
    const item = feed.items[0];

    expect(item).toHaveProperty("authors");
    expect(item.authors).toBeInstanceOf(Array);
    expect(item.authors.length).toBe(1);
    expect(item.authors).toMatchSnapshot();
  });

  it("should handle no authors for item", () => {
    const noAuthorItemFeed = createSampleFeed({
      itemAuthors: [],
    });
    const actual = noAuthorItemFeed.json1();
    const feed = JSON.parse(actual);
    const item = feed.items[0];

    expect(item).toHaveProperty("authors");
    expect(item.authors).toBeInstanceOf(Array);
    expect(item.authors.length).toBe(0);
  });

  it('should use "language" field', () => {
    const actual = sampleFeed.json1();
    const feed = JSON.parse(actual);

    expect(feed).toHaveProperty("language");
    expect(feed.language).toBe("en");
  });
});
