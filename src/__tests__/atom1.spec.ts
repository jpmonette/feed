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
});
