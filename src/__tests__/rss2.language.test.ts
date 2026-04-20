import { Feed } from "../feed";

describe("rss2 language support", () => {
  it("should generate a feed with language element when specified", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      language: "de-DE",
      copyright: "Test Copyright",
    });

    const actual = feed.rss2();
    expect(actual).toContain("<language>de-DE</language>");
  });

  it("should generate a feed without language element when not specified", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      copyright: "Test Copyright",
    });

    const actual = feed.rss2();
    expect(actual).not.toContain("<language>");
  });

  it("should handle different language codes correctly", () => {
    const testCases = ["en", "fr", "es-ES", "zh-CN", "ja-JP", "pt-BR"];

    testCases.forEach((language) => {
      const feed = new Feed({
        title: "Test Feed",
        description: "Test Description",
        link: "http://example.com",
        id: "http://example.com",
        language,
        copyright: "Test Copyright",
      });

      const actual = feed.rss2();
      expect(actual).toContain(`<language>${language}</language>`);
    });
  });

  it("should verify RSS2 does not support per-item language (channel-level only)", () => {
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
      language: "fr-FR", // This should be ignored for RSS2
    });

    const actual = feed.rss2();

    // Feed should have channel-level language
    expect(actual).toContain("<language>en</language>");

    // RSS2 does not support per-item language, so items should not have language elements
    expect(actual).not.toContain("<language>fr-FR</language>");

    // Verify items are present but without language
    expect(actual).toContain("<![CDATA[Article in English]]>");
    expect(actual).toContain("<![CDATA[Article en Français]]>");
  });
});
