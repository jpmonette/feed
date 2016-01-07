var xml = require('xml');
var url = require('url');
var generatorName = 'Feed for Node.js';

// ============================================================================
// Feed Main Module
// ============================================================================
function Feed(options) {
    this.id          = options.id;
    this.title       = options.title;
    this.description = options.description;
    this.link        = options.link;
    this.image       = options.image;
    this.copyright   = options.copyright;
    this.feed        = options.feed;
    this.hub         = options.hub;
    this.updated     = options.updated;

    this.author      = options.author;          // Atom only (at channel level)

    this.items       = [];
    this.categories  = [];
    this.contributors = [];     				// Atom only

    this.addItem = function (options) {
        options = options || {};
        var item = {
            title:          options.title,
            link:           options.link,
            description:    options.description,
            date:           options.date,
            published:      options.published,
            image:          options.image,
            author:         options.author,
            contributor:    options.contributor,	// Atom only
            guid:           options.guid,
            id:             options.id,
            content:        options.content,
            copyright:		options.copyright	// Atom only
        };

        this.items.push(item);
        return this;
    }

    this.addCategory = function (category) {
        this.categories.push(category);
        return this;
    }
    
    this.addContributor = function (contributor) {
        this.contributors.push(contributor);
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

    /**
     * DEPRECATED METHODS
     */
    this.item = function (options)  { 
        console.warn('DEPRECATED: use addItem() instead of item()');
        return this.addItem(options);
    }

    this.category = function (category) {
        console.warn('DEPRECATED: use addCategory() instead of category()');
        return this.addCategory(category);
    }
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
        contributors = options.contributors,
        d           = new Date();

    var doctype = '<?xml version="1.0" encoding="utf-8"?>\n';

    container.push({ feed: feed });
    feed.push({ _attr: { xmlns: 'http://www.w3.org/2005/Atom' }});
    
    /**************************************************************************
     * "feed" node: REQUIRED elements
     *************************************************************************/
    if(options.id == undefined)
        throw new Error('feed id is mandatory');
    else
        feed.push({ id: options.id });

    if(options.title == undefined)
        throw new Error('feed title is mandatory');
    else
        feed.push({ title: options.title });

    if(options.link == undefined)
        throw new Error('feed link is mandatory');
    else
        if(!validateURL(options.link))
            throw new Error('invalid feed link');

    if(Object.prototype.toString.call(options.updated) === '[object Date]')
        feed.push({ updated: RFC3339(options.updated) });
    else
       feed.push({ updated: RFC3339(d) });

    /**************************************************************************
     * "feed" node: recommended elements
     *************************************************************************/

    if(author) {
        var authorDetails = [];

        if(author.name)
            authorDetails.push({ name:     author.name });

        if(author.email)
            authorDetails.push({ email:     author.email });

        if(author.link)
            authorDetails.push({ uri:     author.link });

        feed.push({ author: authorDetails });
    }

    // link (rel="alternate")
    if(options.link)
        feed.push({ link: { _attr: { rel: 'alternate', href: options.link }}});

    // link (rel="self")
    if(options.feed)
        feed.push({ link: { _attr: { rel: 'self', href: options.feed }}});

    // link (rel="hub")
    if(options.hub)
        feed.push({ link: { _attr: { rel:'hub', href: options.hub }}});

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
    for(var i=0; i<categories.length; i++)
        feed.push({ category: [{ _attr: { term: categories[i] } }] });

    if(contributors) {
    	for(var y = 0; y < contributors.length; y++) {
	        var contributorDetails = [];
	
	        if(contributors[y].name)
	        	contributorDetails.push({ name:     contributors[y].name });
	
	        if(contributors[y].email)
	        	contributorDetails.push({ email:     contributors[y].email });
	
	        if(contributors[y].link)
	            authorDetails.push({ uri:     contributors[y].link });
	
	        feed.push({ contributor: contributorDetails });
    	}
    }
    
    // icon

    /**************************************************************************
     * "entry" nodes
     *************************************************************************/
    for(var i = 0; i < entries.length; i++) {
        // 
        // entry: required elements
        // 
        if(entries[i].title == undefined)
            throw new Error('entry need a title');

        if(entries[i].link == undefined)
            throw new Error('entry need a link');
        else
            if(!validateURL(entries[i].link))
                throw new Error('invalid entry link');

        if(entries[i].date == undefined || !(entries[i].date instanceof Date))
            throw new Error('entry need a date');

        var entry = [
            { title:        { _attr: { type: 'html' }, _cdata: entries[i].title }},
            { id:           entries[i].id || entries[i].link },
            { link:         [{ _attr: { href: entries[i].link } }]},
            { updated:      RFC3339(entries[i].date) }
        ];

        // 
        // entry: recommended elements
        // 
        if(entries[i].description)
            entry.push({ summary: { _attr: { type: 'html' }, _cdata: entries[i].description }});

        if(entries[i].content)
            entry.push({ content: { _attr: { type: 'html' }, _cdata: entries[i].content }});

        // entry author(s)
        if(entries[i].author) {
            for(var y = 0; y < entries[i].author.length; y++) {
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
        if(entries[i].contributor) {
            for(var y = 0; y < entries[i].contributor.length; y++) {
                var entryContributor = [];

                if(entries[i].contributor[y].name)
                    entryContributor.push({ name: entries[i].contributor[y].name });

                if(entries[i].contributor[y].email)
                    entryContributor.push({ email: entries[i].contributor[y].email });

                if(entries[i].contributor[y].link)
                    entryContributor.push({ uri: entries[i].contributor[y].link });

                entry.push({ contributor: entryContributor });
            }
        }

        // published
        if(entries[i].published)
            entry.push({ published: RFC3339(entries[i].published) });

        // source

        // rights
        if(entries[i].copyright)
        	entry.push({ rights: entries[i].copyright });

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
    var d = new Date();
    var bContent = false;
    var bAtom = false;

    var doctype = '<?xml version="1.0" encoding="utf-8"?>\n';

    container.push({ rss: [] });
    container[0].rss.push({ _attr: { version: '2.0' } });
    container[0].rss.push({ channel: channel });

    /**
     * Required Channel Elements
     * http://cyber.law.harvard.edu/rss/rss.html#requiredChannelElements
     */
    if(options.title == undefined)
        throw new Error('channel title is mandatory');
    else
        channel.push({ title: options.title });

    if(options.description == undefined)
        throw new Error('channel description is mandatory');
    else
        channel.push({ description: options.description });

    if(options.link == undefined)
        throw new Error('channel link is mandatory');
    else
        if(!validateURL(options.link))
            throw new Error('invalid channel link');
        else
            channel.push({ link: options.link });

    if(Object.prototype.toString.call(options.updated) === '[object Date]')
        channel.push({ lastBuildDate: options.updated.toUTCString() });
    else
       channel.push({ lastBuildDate: d.toUTCString() });

    channel.push({ docs: 'http://blogs.law.harvard.edu/tech/rss'});

    /**
     * Channel Image
     * http://cyber.law.harvard.edu/rss/rss.html#ltimagegtSubelementOfLtchannelgt
     */
    if(options.image)
        channel.push({
            image: [
                { title: options.title },
                { url: options.image },
                { link: options.link }
            ]
        });

    /**
     * Channel Copyright
     * http://cyber.law.harvard.edu/rss/rss.html#optionalChannelElements
     */
    if(options.copyright)
        channel.push({ copyright: options.copyright });
    
    channel.push({ generator: generatorName });

    /**
     * Channel Categories
     * http://cyber.law.harvard.edu/rss/rss.html#comments
     */
    for(var i = 0; i < categories.length; i++)
        channel.push({ category: categories[i] });

    /**
     * Feed URL
     * http://validator.w3.org/feed/docs/warning/MissingAtomSelfLink.html
     */
    if(options.feed) {
        bAtom = true;
        channel.push({ "atom:link": { _attr: { href: options.feed, rel: 'self', type: 'application/rss+xml' }}});
    }
    
    /**
     * Hub for PubSubHubbub
     * https://code.google.com/p/pubsubhubbub/
     */
    if(options.hub) {
        bAtom = true;
        channel.push({ "atom:link": { _attr: { href: options.hub, rel: 'hub' }}});
    }

    /**
     * Channel Categories
     * http://cyber.law.harvard.edu/rss/rss.html#hrelementsOfLtitemgt
     */
    for(var i = 0; i < items.length; i++) {

        // You need to have at least a title OR a description
        if(!items[i].title && !items[i].description)
            throw new Error('item must have at least a title or a description');

        var item = [];

        if(items[i].title)
            item.push({ title: { _cdata: items[i].title }});

        if(items[i].link)
            item.push({ link: items[i].link });

        if(items[i].guid)
            item.push({ guid: items[i].guid });
        else if (items[i].link)
            item.push({ guid: items[i].link });

        if(items[i].date)
            item.push({ pubDate: items[i].date.toUTCString() });

        if(items[i].description)
            item.push({ description: { _cdata: items[i].description }});

        if(items[i].content) {
            bContent = true;
            item.push({ 'content:encoded': { _cdata: items[i].content }});
        }
        /**
         * Item Author
         * http://cyber.law.harvard.edu/rss/rss.html#ltauthorgtSubelementOfLtitemgt
         */
        if(items[i].author) {
            for(var y = 0; y < items[i].author.length; y++) {
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

    if(bContent)
        container[0].rss[0]._attr['xmlns:content'] = 'http://purl.org/rss/1.0/modules/content/';

    if(bAtom)
        container[0].rss[0]._attr['xmlns:atom'] = 'http://www.w3.org/2005/Atom';

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

function validateURL(str) {
    var parsed = url.parse(str);
    return parsed.protocol && parsed.host;
}

module.exports = Feed;
