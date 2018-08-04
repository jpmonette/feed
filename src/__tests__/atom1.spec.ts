import { sampleFeed } from "./setup";

describe("atom 1.0", () => {
  it("should generate a valid feed", () => {
    let actual = sampleFeed.atom1();
    expect(actual).toMatchSnapshot();
  });

  it("should generate a valid feed - legacy", () => {
    let actual = sampleFeed.render("atom-1.0");
    expect(actual).toMatchSnapshot();
  });
});
