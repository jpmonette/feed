import { sampleFeed } from "./setup";

describe("rss 2.0", () => {
  it("should generate a valid feed", () => {
    let actual = sampleFeed.rss2();
    expect(actual).toMatchSnapshot();
  });
});
