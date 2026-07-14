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

  it("should include xml:lang attribute for items with a language defined", () => {
    const feed = new Feed({
      language: "de",
      title: "Feed Title",
      id: "https://example.com/",
      link: "https://example.com/",
      updated,
    });

    feed.addItem({
      title: "Hallo Welt",
      content: "Ich übernehme die Sprache meines übergeordneten Tags.",
      link: "http://example.org/2013/12/14",
      date: updated,
    });
    feed.addItem({
      title: "Hello World",
      content: "My language is set to English",
      link: "http://example.org/2013/12/15",
      date: updated,
      language: "en",
    });
    feed.addItem({
      title: "Bonjour, monde",
      content: "Ma langue est réglée sur le français.",
      link: "http://example.org/2013/12/15",
      date: updated,
      language: "fr",
    });

    expect(feed.atom1()).toMatchSnapshot();
  });

  describe("should ignore invalid language", () => {
    it("on items when feed has a language set", () => {
      const feed = new Feed({
        language: "en",
        title: "Feed Title",
        id: "https://example.com/",
        link: "https://example.com/",
        updated,
      });

      feed.addItem({
        title: "Hello World",
        content: "Lorem Foobar",
        link: "http://example.org/2013/12/14",
        language: "foo",
        date: updated,
      });
      feed.addItem({
        title: "Hello World",
        content: "Lorem Foobar",
        link: "http://example.org/2013/12/14",
        language: "",
        date: updated,
      });
      feed.addItem({
        title: "Hello World",
        content: "Lorem Foobar",
        link: "http://example.org/2013/12/14",
        language: "  ",
        date: updated,
      });

      expect(feed.atom1()).toMatchSnapshot();
    });

    it("on items when feed has no language set", () => {
      const feed = new Feed({
        title: "Feed Title",
        id: "https://example.com/",
        link: "https://example.com/",
        updated,
      });

      feed.addItem({
        title: "Hello World",
        content: "Lorem Foobar",
        link: "http://example.org/2013/12/14",
        language: "foo",
        date: updated,
      });
      feed.addItem({
        title: "Hello World",
        content: "Lorem Foobar",
        link: "http://example.org/2013/12/14",
        language: "",
        date: updated,
      });
      feed.addItem({
        title: "Hello World",
        content: "Lorem Foobar",
        link: "http://example.org/2013/12/14",
        language: "  ",
        date: updated,
      });

      expect(feed.atom1()).toMatchSnapshot();
    });

    it("on feed", () => {
      const feed = new Feed({
        language: "nope",
        title: "Feed Title",
        id: "https://example.com/",
        link: "https://example.com/",
        updated,
      });

      feed.addItem({
        title: "Hello World",
        content: "Lorem Foobar",
        link: "http://example.org/2013/12/14",
        language: "en",
        date: updated,
      });
      feed.addItem({
        title: "Hello World",
        content: "Lorem Foobar",
        link: "http://example.org/2013/12/14",
        date: updated,
      });

      expect(feed.atom1()).toMatchSnapshot();
    });
  });

  it("should handle multiple feed authors", () => {
    const feed = new Feed({
      authors: [{ name: "John Doe", email: "john@doe.com" }, { name: "Alice Doe" }, { link: "http://bob.example.com" }],
      title: "Feed Title",
      id: "https://example.com/",
      link: "https://example.com/",
      updated,
    });

    expect(feed.atom1()).toMatchSnapshot();
  });
});
