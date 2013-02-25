# Feed for Node.js

**Feed for Node.js** is a simple content syndication wrapper, letting you generate painlessly some Atom 1.0 and RSS 2.0 feeds!

## Install

	$ npm install feed

## Examples

First, you have to add the module:

	var Feed = require('feed');

To insert the data you want to syndicate:

	var feed = new Feed({
		title:			'My Blog Name',
		link:			'http://example.com/',
		description:	'This is my blog description'
	});

To insert every posts you want to (as many as you want), use the function `item` as followed:

	for(post in posts) {
		feed.item({
			title:			post.title,
			link:			post.url,
			description:	post.description,
			date:			posts.date
		});
	}

To output a RSS 2.0 feed:

	feed.render('rss-2.0');