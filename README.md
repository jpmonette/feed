# Feed for Node.js

**Feed for Node.js** is a simple content syndication wrapper, letting you generate painlessly some Atom 1.0 and RSS 2.0 feeds!

## Install

    $ npm install feed

## Examples

First, you have to add the module:

```js
var Feed = require('feed');
```

To insert the data you want to syndicate:

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

To insert every posts you want to (as many as you want), use the function `item` as followed:

```js
for(post in posts) {
    feed.item({
        title:          post.title,
        link:           post.url,
        description:    post.description,
        date:           posts.date
    });
}
```

To output a RSS 2.0 feed:

```js
feed.render('rss-2.0');
```

To output an Atom 1.0 feed:

```js
feed.render('atom-2.0');
```

Yes, it's that simple :)!

## Additional information

This module is still a work in progress. If you have any suggestion, feel free to send me a message or a pull request :)!