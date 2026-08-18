import { Feed } from "../feed";
import { published } from "./setup";

describe("rss 2.0 enclosure attributes", () => {
  it("should not emit title/duration attributes on an RSS2 enclosure", () => {
    const feed = new Feed({
      title: "Feed Title",
      id: "https://example.com/",
      link: "https://example.com/",
    });

    feed.addItem({
      title: "Hello World",
      link: "https://example.com/hello-world",
      enclosure: {
        url: "https://example.com/hello-world.png",
        type: "image/png",
        length: 12665,
        title: "Caption",
        duration: 3000,
      },
      date: published,
    });

    const actual = feed.rss2();

    // title is only valid on the Atom <link> path; duration is not a valid RSS2 enclosure
    // attribute either. Both must be stripped so the feed passes the W3C validator.
    expect(actual).not.toContain('title="Caption"');
    expect(actual).not.toContain("duration=");

    // url/length/type must still be present and unchanged.
    expect(actual).toContain('url="https://example.com/hello-world.png"');
    expect(actual).toContain('type="image/png"');
    expect(actual).toContain('length="12665"');
  });
});
