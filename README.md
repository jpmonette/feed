<p align="center">
  <img src="https://user-images.githubusercontent.com/1114325/60746552-2c059a00-9f77-11e9-9632-e21dea9dd06b.png" alt="Feed for Node.js" width="326">
  <br>
  <a href="https://badge.fury.io/js/feed"><img src="https://badge.fury.io/js/feed.svg" alt="npm version" height="18"></a> <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a> <a href="https://github.com/jpmonette/feed/actions/workflows/test.yml"><img src="https://github.com/jpmonette/feed/actions/workflows/test.yml/badge.svg"/></a>
</p>
<p align="center"><code>jpmonette/feed</code> - <strong>RSS 2.0, JSON Feed 1.0, and Atom 1.0</strong> generator for <strong>Node.js</strong><br>
Making content syndication simple and intuitive!</p>

---

**👩🏻‍💻 Developer Ready**: Quickly generate syndication feeds for your Website.

**💪🏼 Strongly Typed**: Developed using TypeScript / type-safe.

**🔒 Tested**: Tests & snapshot for each syndication format to avoid regressions.

# Getting Started

## Installation

```bash
$ yarn add feed
```

## Example

```js
import { Feed } from "feed";

const feed = new Feed({
  title: "Feed Title",
  description: "This is my personal feed!",
  id: "http://example.com/",
  link: "http://example.com/",
  language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
  image: "http://example.com/image.png",
  favicon: "http://example.com/favicon.ico",
  copyright: "All rights reserved 2013, John Doe",
  updated: new Date(2013, 6, 14), // optional, default = today
  generator: "awesome", // optional, default = 'https://github.com/jpmonette/feed'
  feedLinks: {
    json: "https://example.com/json",
    atom: "https://example.com/atom",
  },
  author: {
    name: "John Doe",
    email: "johndoe@example.com",
    link: "https://example.com/johndoe",
  },
});

posts.forEach((post) => {
  feed.addItem({
    title: post.title,
    id: post.url,
    link: post.url,
    description: post.description,
    content: post.content,
    author: [
      {
        name: "Jane Doe",
        email: "janedoe@example.com",
        link: "https://example.com/janedoe",
      },
      {
        name: "Joe Smith",
        email: "joesmith@example.com",
        link: "https://example.com/joesmith",
      },
    ],
    contributor: [
      {
        name: "Shawn Kemp",
        email: "shawnkemp@example.com",
        link: "https://example.com/shawnkemp",
      },
      {
        name: "Reggie Miller",
        email: "reggiemiller@example.com",
        link: "https://example.com/reggiemiller",
      },
    ],
    date: post.date,
    image: post.image,
  });
});

feed.addCategory("Technologie");

feed.addContributor({
  name: "Johan Cruyff",
  email: "johancruyff@example.com",
  link: "https://example.com/johancruyff",
});

console.log(feed.rss2());
// Output: RSS 2.0

console.log(feed.atom1());
// Output: Atom 1.0

console.log(feed.json1());
// Output: JSON Feed 1.0
```

## Options

### Feed Options

| Property      | Type      | Description                                                     |
| ------------- | --------- | --------------------------------------------------------------- |
| `title`       | `string`  | **Required.** Feed title                                        |
| `id`          | `string`  | Feed identifier (required for Atom)                             |
| `link`        | `string`  | URL to the feed's website                                       |
| `description` | `string`  | Feed description/subtitle                                       |
| `copyright`   | `string`  | Copyright notice                                                |
| `language`    | `string`  | Language code (e.g., `"en"`, `"fr-CA"`)                         |
| `updated`     | `Date`    | Last update date (default: `now`)                               |
| `generator`   | `string`  | Generator name (default: `"https://github.com/jpmonette/feed"`) |
| `image`       | `string`  | URL to feed image/logo                                          |
| `favicon`     | `string`  | URL to feed favicon                                             |
| `author`      | `Author`  | Feed author                                                     |
| `feedLinks`   | `object`  | Links to feed formats (`{ rss, atom, json }`)                   |
| `feed`        | `string`  | Self-referencing feed URL                                       |
| `hub`         | `string`  | WebSub/PubSubHubbub hub URL                                     |
| `ttl`         | `number`  | Time to live in minutes (RSS)                                   |
| `docs`        | `string`  | RSS specification docs URL                                      |
| `stylesheet`  | `string`  | URL to XSL stylesheet                                           |
| `podcast`     | `boolean` | Enable iTunes/Google podcast extensions                         |
| `category`    | `string`  | Podcast category name                                           |

### Item Options

| Property      | Type                  | Description                              |
| ------------- | --------------------- | ---------------------------------------- |
| `title`       | `string`              | **Required.** Item title                 |
| `link`        | `string`              | **Required.** URL to the item            |
| `date`        | `Date`                | **Required.** Last modified/updated date |
| `id`          | `string`              | Unique identifier (Atom/JSON)            |
| `guid`        | `string`              | RSS-specific GUID                        |
| `description` | `string`              | Brief summary or excerpt                 |
| `content`     | `string`              | Full content (HTML allowed)              |
| `author`      | `Author[]`            | Item authors                             |
| `contributor` | `Author[]`            | Item contributors                        |
| `category`    | `Category[]`          | Item categories                          |
| `published`   | `Date`                | Original publication date                |
| `copyright`   | `string`              | Item copyright notice                    |
| `image`       | `string \| Enclosure` | Image attachment                         |
| `audio`       | `string \| Enclosure` | Audio attachment                         |
| `video`       | `string \| Enclosure` | Video attachment                         |
| `enclosure`   | `Enclosure`           | Generic media enclosure                  |
| `extensions`  | `Extension[]`         | Custom extensions                        |

### Types

```typescript
interface Author {
  name?: string;
  email?: string;
  link?: string;
  avatar?: string; // JSON Feed only
}

interface Enclosure {
  url: string;
  type?: string; // MIME type (e.g., "audio/mpeg")
  length?: number; // File size in bytes
  title?: string;
  duration?: number; // Duration in seconds (for podcasts)
}

interface Category {
  name?: string;
  domain?: string; // RSS
  scheme?: string; // Atom
  term?: string; // Atom
}

interface Extension {
  name: string;
  objects: Record<string, unknown>;
}
```

## Migrating from `< 3.0.0`

If you are migrating from a version older than `3.0.0`, be sure to update your import as we migrated to ES6 named imports.

If your environment supports the ES6 module syntax, you can `import` as described above:

```ts
import { Feed } from "feed";
```

Otherwise, you can stick with `require()`:

```diff
- const Feed = require('feed');
+ const Feed = require('feed').Feed;
```

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jpmonette/feed&type=Date)](https://www.star-history.com/#jpmonette/feed&Date)

## More Information

- Follow [@jpmonette](https://twitter.com/jpmonette) on Twitter for updates
- Read my personal blog [Blogue de Jean-Philippe Monette](http://blogue.jpmonette.net/) to learn more about what I do!

## License

Copyright (C) 2013, Jean-Philippe Monette <contact@jpmonette.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
