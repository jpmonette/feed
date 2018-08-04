import Feed from "../feed";

let updated = new Date("Sat, 13 Jul 2013 23:00:00 GMT");
let published = new Date("Sat, 10 Jul 2013 23:00:00 GMT");

let feed = new Feed({
  title: "Feed Title",
  description: "This is my personnal feed!",
  link: "http://example.com/",
  id: "http://example.com/",
  feed: "http://example.com/feed.rss",
  image: "http://example.com/image.png",
  copyright: "All rights reserved 2013, John Doe",
  updated, // optional, default = today

  author: {
    name: "John Doe",
    email: "johndoe@example.com",
    link: "https://example.com/johndoe"
  }
});

feed.addCategory("Technology");

feed.addContributor({
  name: "Johan Cruyff",
  email: "johancruyff@example.com",
  link: "https://example.com/johancruyff"
});

feed.addItem({
  title: "Hello World",
  id: "https://example.com/hello-world",
  link: "https://example.com/hello-world",
  description: "This is an article about Hello World.",
  content: "Content of my item",
  author: [
    {
      name: "Jane Doe",
      email: "janedoe@example.com",
      link: "https://example.com/janedoe"
    },
    {
      name: "Joe Smith",
      email: "joesmith@example.com",
      link: "https://example.com/joesmith"
    }
  ],
  contributor: [
    {
      name: "Shawn Kemp",
      email: "shawnkemp@example.com",
      link: "https://example.com/shawnkemp"
    },
    {
      name: "Reggie Miller",
      email: "reggiemiller@example.com",
      link: "https://example.com/reggiemiller"
    }
  ],
  extensions: [
    {
      name: "_item_extension_1",
      objects: {
        about: "just an item extension example",
        dummy1: "example"
      }
    },
    {
      name: "_item_extension_2",
      objects: {
        about: "just a second item extension example",
        dummy1: "example"
      }
    }
  ],
  date: updated,
  image: "https://example.com/hello-world.jpg",
  published
});

feed.addExtension({
  name: "_example_extension",
  objects: {
    about: "just an extension example",
    dummy: "example"
  }
});

describe("rss 2.0", () => {
  it("should generate a valid feed", () => {
    let actual = feed.rss2();
    expect(actual).toMatchSnapshot();
  });

  it("should generate a valid feed - legacy", () => {
    let actual = feed.render("rss-2.0");
    expect(actual).toMatchSnapshot();
  });
});

describe("atom 1.0", () => {
  it("should generate a valid feed", () => {
    let actual = feed.atom1();
    expect(actual).toMatchSnapshot();
  });

  it("should generate a valid feed - legacy", () => {
    let actual = feed.render("atom-1.0");
    expect(actual).toMatchSnapshot();
  });
});

describe("json 1", () => {
  it("should generate a valid feed", () => {
    let actual = JSON.parse(feed.json1());
    expect(actual).toMatchSnapshot();
  });
});
