import { sampleFeed } from "./setup";

describe("rss 2.0", () => {
  it("should generate a valid feed", () => {
    let actual = sampleFeed.rss2();
    expect(actual).toMatchSnapshot();
  });

  it("should generate a valid feed - legacy", () => {
    let actual = sampleFeed.render("rss-2.0");
    expect(actual).toMatchSnapshot();
  });
});
