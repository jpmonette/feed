var Feed = require('../lib/feed');
var approvals = require('approvals');

var feed = new Feed({
    title: 'Feed Title',
    description: 'This is my personnal feed!',
    link: 'http://example.com/',
    feed: 'http://example.com/atom.xml',
    image: 'http://example.com/image.png',
    copyright: 'All rights reserved 2013, John Doe',
    updated: new Date(2013, 06, 14),                // optional, default = today

    author: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        link: 'https://example.com/johndoe'
    }
});


var posts = [
    {
        title: "Title A",
        url: "http://example.com/title-a",
        description: "Title A description",
        date: new Date(2001, 1, 1),
        image: "/images/titelA.png",
    },
]


for (var key in posts) {
    feed.addItem({
        title: posts[key].title,
        link: posts[key].url,
        description: posts[key].description,
        author: [
            {
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                link: 'https://example.com/janedoe'
            },
            {
                name: 'Joe Smith',
                email: 'joesmith@example.com',
                link: 'https://example.com/joesmith'
            }
        ],
        contributor: [
            {
                name: 'Shawn Kemp',
                email: 'shawnkemp@example.com',
                link: 'https://example.com/shawnkemp'
            },
            {
                name: 'Reggie Miller',
                email: 'reggiemiller@example.com',
                link: 'https://example.com/reggiemiller'
            }
        ],
        date: posts[key].date,
        image: posts[key].image
    });
}

feed.addCategory('Technology');

feed.addContributor({
    name: 'Johan Cruyff',
    email: 'johancruyff@example.com',
    link: 'https://example.com/johancruyff'
});


var rss = feed.render('rss-2.0');
var atom = feed.render('atom-1.0');

approvals.verify("./tests", "sampleAtomFeed", atom);
approvals.verify("./tests", "sampleRSSFeed", rss);
