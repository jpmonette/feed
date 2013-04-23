var xml     = require('xml');
var generatorName = 'Feed for Node.js';

// ============================================================================
// Feed Main Module
// ============================================================================
function Feed(options) {
    this.title          = options.title;
    this.description    = options.description;
    this.link           = options.link;
    this.image          = options.image;
    this.copyright      = options.copyright;

    this.author         = options.author;

    this.items          = [];
    this.categories     = [];

    this.item = function (options) {
        options = options || {};
        var item = {
            title:          options.title,
            link:           options.link,
            description:    options.description,
            date:           options.date,
            image:          options.image,
            author:         options.author
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
//      
// - Reference: http://www.atomenabled.org/developers/syndication/
// ============================================================================

function atom_1_0(options) {
    var items       = [],
        container   = [],
        feed        = [],

        entries     = options.items,
        categories  = options.categories,
        author      = options.author,
        d           = new Date();

    var doctype = '<?xml version="1.0" encoding="utf-8"?>\n';

    container.push({ feed: feed });
    feed.push({ _attr: { xmlns: 'http://www.w3.org/2005/Atom' }});
    
    /**************************************************************************
     * "feed" node: REQUIRED elements
     *************************************************************************/
    feed.push({ title:      options.title });
    feed.push({ id:         options.link });
    feed.push({ updated:    RFC3339(d) });      // Auto-magic :)

    /**************************************************************************
     * "feed" node: recommended elements
     *************************************************************************/
    if(author)
        feed.push({ author: [
            { name:     author.name },
            { email:    author.email },
            { uri:      author.link }
        ]});

    // link (relative link to feed) - will be added in a future version

    /**************************************************************************
     * "feed" node: optional elements
     *************************************************************************/
    if(options.description)
        feed.push({ subtitle:   options.description });

    if(options.image)
        feed.push({ logo:       options.image });

    if(options.copyright)
        feed.push({ rights:     options.copyright });

    feed.push({ generator:      generatorName });

    // Looping through categories (if any set!)
    for(var i in categories)
        feed.push({ category: [{ _attr: { term: categories[i] } }] });

    // contributor
    
    // icon

    /**************************************************************************
     * "entry" nodes
     *************************************************************************/
    for(var i in entries) {
        // 
        // entry: required elements
        // 
        var entry = [
            { title:        { _attr: { type: 'html' }, _cdata: entries[i].title }},
            { id:           entries[i].link },
            { link:         [{ _attr: { href: entries[i].link } }]},
            { updated:      RFC3339(entries[i].date) }
        ];

        // 
        // entry: recommended elements
        // 
        if(entries[i].description)
            entry.push({ summary: { _attr: { type: 'html' }, _cdata: entries[i].description }});

        // entry author(s)
        if(entries[i].author) {
            for(var y in entries[i].author) {
                var entryAuthor = [];

                if(entries[i].author[y].name)
                    entryAuthor.push({ name: entries[i].author[y].name });

                if(entries[i].author[y].email)
                    entryAuthor.push({ email: entries[i].author[y].email });

                if(entries[i].author[y].link)
                    entryAuthor.push({ uri: entries[i].author[y].link });

                entry.push({ author: entryAuthor });
            }
        }

        // content

        // link - relative link to article

        //
        // entry: optional elements
        // 

        // category

        // contributor

        // published

        // source

        // rights

        feed.push({ entry: entry });
    }

    return doctype + xml(container, true);
}

// ============================================================================
// Real Simple Syndication 2.0 (RSS 2.0)
// 
// - Reference: http://feed2.w3.org/docs/rss2.html
// ============================================================================
function rss_2_0(options) {
    var items       = [],
        channel     = [],
        container   = [];
    
    var items = options.items;
    var categories = options.categories;
    var author = options.author;
    var d = new Date();

    var doctype = '<?xml version="1.0" encoding="utf-8"?>\n';

    container.push({ rss: [] });
    container[0].rss.push({ _attr: { version: '2.0' } });
    container[0].rss.push({ channel: channel });

    // Required RSS 2.0 channel elements
    channel.push({ title:           options.title });
    channel.push({ description:     options.description });
    channel.push({ link:            options.link });
    channel.push({ author:          author.email + ' (' + author.name + ')' });
    channel.push({ lastBuildDate:   d.toUTCString() })

    if(options.image)
        channel.push({ image:   options.image });

    if(options.copyright)
        channel.push({ copyright:   options.copyright });
    
    channel.push({ generator:   generatorName });

    // Categories
    for(var i in categories)
        channel.push({ category: categories[i] });

    // Items
    for(var i in items) {
        var item = [ 
            { title:        { _cdata: items[i].title }},
            { link:         items[i].link },
            { pubDate:      items[i].date.toUTCString() },
            { description:  { _cdata: items[i].description }}
        ];

        if(items[i].author) {
            for(var y in items[i].author) {
                var itemAuthor = [];

                if(items[i].author[y].name)
                    itemAuthor.push({ name: items[i].author[y].name });

                if(items[i].author[y].email)
                    itemAuthor.push({ email: items[i].author[y].email });

                if(items[i].author[y].link)
                    itemAuthor.push({ link: items[i].author[y].link });

                item.push({ author: itemAuthor });
            }
        }

        if(items[i].image)
            item.push({ enclosure: [{ _attr: { url: items[i].image } }] });

        channel.push({ item: item });
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