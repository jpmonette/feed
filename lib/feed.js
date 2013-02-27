var xml 	= require('xml');

var generatorName = 'Feed for Node.js';

// ============================================================================
// Feed Main Module
// ============================================================================
function Feed(options) {
	this.title			= options.title;
	this.description	= options.description;
	this.link			= options.link;
	this.image			= options.image;
	this.copyright		= options.copyright;

	this.author			= options.author;

	this.items			= [];
	this.categories		= [];

	this.item = function (options) {
		options = options || {};
		var item = {
			title:			options.title,
			link:			options.link,
			description:	options.description,
			date:			options.date
		};

		this.items.push(item);
		return this;
	}

	this.category = function (category) {
		this.categories.push(category);
		return this;
	}

	this.render = function (format) {
		switch(format) {
			case 'rss-2.0':
				return rss_2_0(this);
			break;

			case 'atom-1.0':
				return atom_1_0(this);
			break;

			default:
				return rss_2_0(this);
		}
	};
};

// ============================================================================
// Atom 1.0 [application/atom+xml]
// ============================================================================

function atom_1_0(options) {
	var items 		= [],
		container 	= [];

	var entries = options.items;
	var categories = options.categories;
	var author = options.author;
	var doctype = '<?xml version="1.0" encoding="utf-8"?>\n';
	var d = new Date();

	container.push({ feed: [] });
	container[0].feed.push({ _attr: { xmlns: 'http://www.w3.org/2005/Atom' }});

	container[0].feed.push({ title: 	options.title });
	container[0].feed.push({ subtitle:	options.description });
	container[0].feed.push({ id: 		options.link });
	container[0].feed.push({ updated: 	RFC3339(d) });

	container[0].feed.push({ author: [
		{ name: 	author.name },
		{ email: 	author.email },
		{ uri: 		author.link }
	]});

	if(options.image)
		container[0].feed.push({ logo: 	options.image });

	if(options.copyright)
		container[0].feed.push({ rights: 	options.copyright });

	container[0].feed.push({ generator:	generatorName });

	// Categories
	for(var key in categories) {
		container[0].feed.push({ category: [{ _attr: { term: categories[key]}}] });
	}

	for(key in entries) {
		container[0].feed.push({ entry: [ 
			{ title:		{ _cdata: entries[key].title }},
			{ id:			entries[key].link },
			{ updated:		RFC3339(entries[key].date) },
			{ summary:		{ _cdata: entries[key].description }}
		]});
	}

	return doctype + xml(container, true);
}

// ============================================================================
// Real Simple Syndication 2.0 (RSS 2.0)
// ============================================================================
function rss_2_0(options) {
	var items 		= [],
		channel 	= [],
		container 	= [];
	
	var items = options.items;
	var categories = options.categories;
	var author = options.author;

	var doctype = '<?xml version="1.0" encoding="utf-8"?>\n';

	container.push({ rss: [] });
	container[0].rss.push({ _attr: { version: '2.0' } });
	container[0].rss.push({ channel: channel });

	// Required RSS 2.0 channel elements
	channel.push({ title: 		options.title });
	channel.push({ description: options.description });
	channel.push({ link: 		options.link });
	channel.push({ author: 		author.email + ' (' + author.name + ')' });

	if(options.image)
		channel.push({ image: 	options.image });

	if(options.copyright)
		channel.push({ copyright: 	options.copyright });
	
	channel.push({ generator:	generatorName });

	// Categories
	for(var key in categories) {
		channel.push({ category: categories[key] });
	}

	// Items
	for(var key in items) {
		channel.push({ item: [ 
			{ title:		{ _cdata: items[key].title }},
			{ link:			items[key].link },
			{ pubDate:		items[key].date.toUTCString() },
			{ description:	{ _cdata: items[key].description }}
		]});
	}

	return doctype + xml(container, true);
}

function RFC3339(d) {
	function pad(n) { return n < 10 ? '0' + n : n }
	
	return d.getUTCFullYear()+'-'
		+ pad(d.getUTCMonth()+1)+'-'
		+ pad(d.getUTCDate())+'T'
		+ pad(d.getUTCHours())+':'
		+ pad(d.getUTCMinutes())+':'
		+ pad(d.getUTCSeconds())+'Z'
}

module.exports = Feed;