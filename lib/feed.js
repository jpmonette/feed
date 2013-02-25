var xml = require('xml');

function Feed(options, items) {
	this.title			= options.title;
	this.description	= options.description;
	this.link			= options.link;
	this.author			= options.author;
	this.copyright		= options.copyright;
	this.language		= options.language;			// fr-CA, en-US...
	this.items			= items || [];

	this.item = function (options) {
		options = options || {};
		var item = {
			title:			options.title,
			link:			options.link,
			description:	options.description,
			author:			options.author
		};

		this.items.push(item);
		return this;
	}

	this.render = function (format) {
		switch(format) {
			case 'rss-2.0':
				return rss20(this);
			break;

			default:
				return rss20(this);
		}
	};
};

function rss20(options) {
	var items = [];
	var channel = [];
	var rss = [{ 
		rss: [
			{ _attr: { version: '2.0' }}, 
			{ channel: channel }
		]
	}];

	// Required RSS 2.0 channel ellements
	channel.push({ title: 		options.title });
	channel.push({ description: options.description });
	channel.push({ link: 		options.link });

	for(item in options.items) {
		channel.push({ item: [ 
			{ title:		options.items[item].title },
			{ link:			options.items[item].link },
			{ description:	{ _cdata: options.items[item].description }}
		]});
	}

	return xml(rss, true);
}

module.exports = Feed;