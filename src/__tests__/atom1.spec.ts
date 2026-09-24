import { Feed } from "../feed";
import { sampleFeed, updated } from "./setup";

describe("atom 1.0", () => {
  it("should generate a valid feed", () => {
    const actual = sampleFeed.atom1();
    expect(actual).toMatchSnapshot();
  });

  it("should generate a valid feed with stylesheet", () => {
    const sampleFeed = new Feed({
      title: "Feed Title",
      description: "This is my personnal feed!",
      link: "http://example.com/",
      stylesheet: "https://exmaple.com/rss.xsl",
      id: "http://example.com/",
      language: "en",
      ttl: 60,
      image: "http://example.com/image.png",
      copyright: "All rights reserved 2013, John Doe",
      hub: "wss://example.com/",
      updated, // optional, default = today

      author: {
        name: "John Doe",
        email: "johndoe@example.com",
        link: "https://example.com/johndoe",
      },
    });
    const actual = sampleFeed.atom1();
    expect(actual).toMatchSnapshot();
  });
  it("should sanitize enclosure url", () => {
    sampleFeed.addItem({
      title: "Hello World",
      link: "http://example.org/sanitize",
      enclosure: { url: "https://example.com/hello&world.png" },
      date: updated,
    });
    const actual = sampleFeed.atom1();
    expect(actual).toMatchSnapshot();
    expect(actual).toContain('<link rel="enclosure" href="https://example.com/hello&amp;world.png"');
  });

  it("should add Media RSS elements for item images", () => {
    const feed = new Feed({
      title: "Feed Title",
      id: "http://example.com/",
      link: "http://example.com/",
      copyright: "All rights reserved 2013, John Doe",
      updated,
    });

    feed.addItem({
      title: "Hello World",
      link: "https://example.com/hello-world",
      image: "https://example.com/hello&world.jpg",
      date: updated,
    });

    const actual = feed.atom1();
    expect(actual).toMatchSnapshot();
    expect(actual).toContain('xmlns:media="http://search.yahoo.com/mrss/"');
    expect(actual).toContain("media:thumbnail");
    expect(actual).toContain("media:content");
  });

  it("should not declare the media namespace when no item has an image", () => {
    const feed = new Feed({
      title: "Feed Title",
      id: "http://example.com/",
      link: "http://example.com/",
      copyright: "All rights reserved 2013, John Doe",
      updated,
    });

    feed.addItem({
      title: "Hello World",
      link: "https://example.com/hello-world",
      date: updated,
    });

    expect(feed.atom1()).not.toContain("xmlns:media");
  });

  it("should escape & in category attributes", () => {
    const feed = new Feed({
      title: "Feed Title",
      id: "http://example.com/",
      link: "http://example.com/",
      updated,
    });
    feed.addCategory("Arts & Crafts");
    feed.addItem({
      title: "Hello World",
      link: "http://example.org/2013/12/14",
      date: updated,
      category: [{ name: "R&D", scheme: "https://example.com/s?a=1&b=2" }],
    });
    const actual = feed.atom1();
    // unlike a text node, xml-js does not escape `&` inside an attribute value,
    // so it must be escaped before being handed to the serializer
    expect(actual).toContain('<category term="Arts &amp; Crafts"/>');
    expect(actual).toContain('<category label="R&amp;D" scheme="https://example.com/s?a=1&amp;b=2"/>');
    expect(actual).not.toContain("Arts & Crafts");
  });

  it("should emit the default generator when none is provided", () => {
    const feed = new Feed({ title: "Feed Title", id: "https://example.com/", link: "https://example.com/" });
    expect(feed.atom1()).toContain("<generator>https://github.com/jpmonette/feed</generator>");
  });

  it("should emit a custom generator when provided", () => {
    const feed = new Feed({
      title: "Feed Title",
      id: "https://example.com/",
      link: "https://example.com/",
      generator: "my-site",
    });
    expect(feed.atom1()).toContain("<generator>my-site</generator>");
  });

  it("should omit the generator element when generator is false", () => {
    const feed = new Feed({
      title: "Feed Title",
      id: "https://example.com/",
      link: "https://example.com/",
      generator: false,
    });
    expect(feed.atom1()).not.toContain("<generator>");
  });

  it("should keep a non-URL atom entry id", () => {
    const feed = new Feed({
      title: "Feed Title",
      id: "http://example.com/",
      link: "http://example.com/",
    });
    feed.addItem({
      title: "Post",
      id: "post-slug",
      link: "https://example.com/post-slug",
      date: updated,
    });
    const actual = feed.atom1();
    expect(actual).toContain("<id>post-slug</id>");
  });
});
