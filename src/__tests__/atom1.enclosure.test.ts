import { Feed } from "../feed";

test("Atom uses explicit enclosure.type when provided", () => {
  const feed = new Feed({
    title: "t",
    id: "https://example.com",
    link: "https://example.com",
    copyright: "c",
  });

  // Proxy URL with no file extension -> auto-detection would fail
  const proxied = "https://wsrv.nl/?url=https%3A%2F%2Fexample.com%2Fimg.jpg&w=1000";

  feed.addItem({
    title: "post",
    id: "https://example.com/p",
    link: "https://example.com/p",
    date: new Date("2025-01-01"),
    image: { url: proxied, type: "image/jpeg" }, // <— explicit type
  });

  const xml = feed.atom1();
  expect(xml).toContain(`rel="enclosure"`);
  expect(xml).toContain(`href="${proxied}"`);
  expect(xml).toContain(`type="image/jpeg"`);
});

test("Atom falls back to auto-detection when no type provided", () => {
  const feed = new Feed({
    title: "t",
    id: "https://example.com",
    link: "https://example.com",
    copyright: "c",
  });

  feed.addItem({
    title: "post",
    id: "https://example.com/p",
    link: "https://example.com/p",
    date: new Date("2025-01-01"),
    image: { url: "https://example.com/image.png", length: 12345 }, // no explicit type
  });

  const xml = feed.atom1();
  expect(xml).toContain(`rel="enclosure"`);
  expect(xml).toContain(`href="https://example.com/image.png"`);
  expect(xml).toContain(`type="image/png"`); // auto-detected from URL
});

test("Atom handles empty string type by falling back to auto-detection", () => {
  const feed = new Feed({
    title: "t",
    id: "https://example.com",
    link: "https://example.com",
    copyright: "c",
  });

  feed.addItem({
    title: "post",
    id: "https://example.com/p",
    link: "https://example.com/p",
    date: new Date("2025-01-01"),
    image: { url: "https://example.com/image.webp", type: "" }, // empty type
  });

  const xml = feed.atom1();
  expect(xml).toContain(`rel="enclosure"`);
  expect(xml).toContain(`href="https://example.com/image.webp"`);
  expect(xml).toContain(`type="image/webp"`); // auto-detected from URL
});

test("Atom handles video enclosures with explicit type", () => {
  const feed = new Feed({
    title: "t",
    id: "https://example.com",
    link: "https://example.com",
    copyright: "c",
  });

  feed.addItem({
    title: "post",
    id: "https://example.com/p",
    link: "https://example.com/p",
    date: new Date("2025-01-01"),
    video: { url: "https://example.com/video.mov", type: "video/quicktime" },
  });

  const xml = feed.atom1();
  expect(xml).toContain(`rel="enclosure"`);
  expect(xml).toContain(`href="https://example.com/video.mov"`);
  expect(xml).toContain(`type="video/quicktime"`);
});

test("Atom handles audio enclosures with explicit type", () => {
  const feed = new Feed({
    title: "t",
    id: "https://example.com",
    link: "https://example.com",
    copyright: "c",
  });

  feed.addItem({
    title: "post",
    id: "https://example.com/p",
    link: "https://example.com/p",
    date: new Date("2025-01-01"),
    audio: { url: "https://example.com/audio.ogg", type: "audio/ogg" },
  });

  const xml = feed.atom1();
  expect(xml).toContain(`rel="enclosure"`);
  expect(xml).toContain(`href="https://example.com/audio.ogg"`);
  expect(xml).toContain(`type="audio/ogg"`);
});
