import { Feed } from "../feed";

describe("json feed language support", () => {
  it("should generate a feed with language when specified", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      language: "fr-FR",
      copyright: "Test Copyright",
    });

    const actual = JSON.parse(feed.json1());
    expect(actual.language).toBe("fr-FR");
    expect(actual.version).toBe("https://jsonfeed.org/version/1.1");
  });

  it("should generate a feed without language when not specified", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      copyright: "Test Copyright",
    });

    const actual = JSON.parse(feed.json1());
    expect(actual.language).toBeUndefined();
    expect(actual.version).toBe("https://jsonfeed.org/version/1.1");
  });

  it("should handle different language codes correctly", () => {
    const testCases = ["en", "de", "ja-JP", "zh-CN", "pt-BR", "es-ES"];

    testCases.forEach((language) => {
      const feed = new Feed({
        title: "Test Feed",
        description: "Test Description",
        link: "http://example.com",
        id: "http://example.com",
        language,
        copyright: "Test Copyright",
      });

      const actual = JSON.parse(feed.json1());
      expect(actual.language).toBe(language);
    });
  });

  it("should support per-item language", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      language: "en",
      copyright: "Test Copyright",
    });

    feed.addItem({
      title: "Article in English",
      link: "http://example.com/english",
      date: new Date("2023-01-01"),
    });

    feed.addItem({
      title: "Article en Français",
      link: "http://example.com/french",
      date: new Date("2023-01-02"),
      language: "fr-FR",
    });

    feed.addItem({
      title: "Artículo en Español",
      link: "http://example.com/spanish",
      date: new Date("2023-01-03"),
      language: "es-ES",
    });

    const actual = JSON.parse(feed.json1());

    // Feed should have default language
    expect(actual.language).toBe("en");

    // Check items
    expect(actual.items).toHaveLength(3);

    // First item should not have language (inherits from feed)
    expect(actual.items[0].language).toBeUndefined();
    expect(actual.items[0].title).toBe("Article in English");

    // Second item should have French language
    expect(actual.items[1].language).toBe("fr-FR");
    expect(actual.items[1].title).toBe("Article en Français");

    // Third item should have Spanish language
    expect(actual.items[2].language).toBe("es-ES");
    expect(actual.items[2].title).toBe("Artículo en Español");
  });

  it("should handle special characters in language codes", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      language: "zh-Hans-CN", // Traditional Chinese (Simplified) in China
      copyright: "Test Copyright",
    });

    const actual = JSON.parse(feed.json1());
    expect(actual.language).toBe("zh-Hans-CN");
  });
});
