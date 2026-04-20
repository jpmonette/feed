import { Feed } from "../feed";

describe("atom 1.0 language support", () => {
  it("should generate a feed with xml:lang attribute when language is specified", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      language: "de-DE",
      copyright: "Test Copyright",
    });

    const actual = feed.atom1();
    expect(actual).toContain('xml:lang="de-DE"');
    expect(actual).toContain('<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="de-DE">');
  });

  it("should generate a feed without xml:lang attribute when language is not specified", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      copyright: "Test Copyright",
    });

    const actual = feed.atom1();
    expect(actual).not.toContain("xml:lang");
    expect(actual).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
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

      const actual = feed.atom1();
      expect(actual).toContain(`xml:lang="${language}"`);
    });
  });

  it("should sanitize language attribute like other attributes", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      language: "en&test=malicious",
      copyright: "Test Copyright",
    });

    const actual = feed.atom1();
    // The language should be sanitized to prevent XML injection
    expect(actual).toContain('xml:lang="en&amp;test=malicious"');
    // Verify the XML is still valid by checking the structure
    expect(actual).toContain('<feed xmlns="http://www.w3.org/2005/Atom"');
  });

  it("should support per-item language attributes", () => {
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

    const actual = feed.atom1();

    // Feed should have default language
    expect(actual).toContain('<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">');

    // First entry should not have xml:lang (inherits from feed)
    const firstEntryMatch = actual.match(/<entry>\s*<title[^>]*><!\[CDATA\[Article in English\]\]><\/title>/);
    expect(firstEntryMatch).toBeTruthy();

    // Second entry should have French language
    expect(actual).toContain('<entry xml:lang="fr-FR">');
    expect(actual).toContain("<![CDATA[Article en Français]]>");

    // Third entry should have Spanish language
    expect(actual).toContain('<entry xml:lang="es-ES">');
    expect(actual).toContain("<![CDATA[Artículo en Español]]>");
  });

  it("should sanitize per-item language attributes", () => {
    const feed = new Feed({
      title: "Test Feed",
      description: "Test Description",
      link: "http://example.com",
      id: "http://example.com",
      copyright: "Test Copyright",
    });

    feed.addItem({
      title: "Test Article",
      link: "http://example.com/test",
      date: new Date("2023-01-01"),
      language: "fr&malicious=code",
    });

    const actual = feed.atom1();
    expect(actual).toContain('<entry xml:lang="fr&amp;malicious=code">');
  });
});
