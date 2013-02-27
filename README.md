# Feed for Node.js

**Feed for Node.js** is the simplest content syndication wrapper, letting you generate Atom 1.0 and RSS 2.0 feeds in no time!

## Installation

    $ npm install feed

## Features

* Pure JavaScript
* Support for Atom 1.0 and RSS 2.0

## Quick Start

First, add the module:

```js
var Feed = require('feed');
```

Insert feed-specific information:

```js
var feed = new Feed({
    title:          'Feed Title',
    description:    'This is my personnal feed!',
    link:           'http://example.com/',
    image:          'http://example.com/image.png',
    copyright:      'All rights reserved 2013, John Doe',
    
    author: {
        name:       'John Doe',
        email:      'johndoe@example.com',
        link:       'https://example.com/johndoe'
    }
});
```

Insert items using the item function:

```js
for(var key in posts) {
    feed.item({
        title:          posts[key].title,
        link:           posts[key].url,
        description:    posts[key].description,
        date:           posts[key].date
    });
}
```

Output a RSS 2.0 feed:

```js
feed.render('rss-2.0');
```

Output an Atom 1.0 feed:

```js
feed.render('atom-1.0');
```

Yes, it's that simple :)!

## Additional information

This module is still a work in progress. If you have any suggestion, feel free to send me a message or a pull request :)!