var assert = require("assert"),
  Feed = require('../lib/feed.js')

describe('RSS 2.0', function () {

  it('should return a standard feed', function () {

    var date = new Date();

    var feed = new Feed({
      title: 'Feed Title',
      description: 'This is my personnal feed!',
      link: 'http://example.com/',
      image: 'http://example.com/image.png',
      copyright: 'All rights reserved 2013, John Doe',
      updated: date, // optional, default = today

      author: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        link: 'https://example.com/johndoe'
      }
    });

    feed.addItem({
      title: 'Item Title',
      description: 'This is a test item',
      content: 'This is a test item',
      image: 'http://example.com/test.png',
      link: 'http://example.com/test/1',
      guid: 1,
      author: [{
        name: 'Author Name'
      }],
      source: {
        name: 'example.com',
        url: 'http://example.com/'
      },
      category: {
        name: 'test',
        domain: 'http://example.com/test'
      },
      date: date
    });

    var output = '';

    output += '<?xml version="1.0" encoding="utf-8"?>\n';
    output += '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n';
    output += '    <channel>\n';
    output += '        <title>Feed Title</title>\n';
    output += '        <description>This is my personnal feed!</description>\n';
    output += '        <link>http://example.com/</link>\n';
    output += '        <lastBuildDate>' + (date).toUTCString() + '</lastBuildDate>\n';
    output += '        <docs>http://blogs.law.harvard.edu/tech/rss</docs>\n';
    output += '        <image>\n';
    output += '            <title>Feed Title</title>\n';
    output += '            <url>http://example.com/image.png</url>\n';
    output += '            <link>http://example.com/</link>\n';
    output += '        </image>\n';
    output += '        <copyright>All rights reserved 2013, John Doe</copyright>\n';
    output += '        <generator>Feed for Node.js</generator>\n';
    output += '        <item>\n';
    output += '            <title><![CDATA[Item Title]]></title>\n';
    output += '            <link>http://example.com/test/1</link>\n';
    output += '            <guid>1</guid>\n';
    output += '            <pubDate>' + (date).toUTCString() + '</pubDate>\n';
    output += '            <description><![CDATA[This is a test item]]></description>\n';
    output += '            <content:encoded><![CDATA[This is a test item]]></content:encoded>\n';
    output += '            <author>\n';
    output += '                <name>Author Name</name>\n';
    output += '            </author>\n';
    output += '            <enclosure url="http://example.com/test.png">\n';
    output += '            </enclosure>\n';
    output += '            <source url="http://example.com/">example.com</source>\n';
    output += '            <category domain="http://example.com/test">test</category>\n';
    output += '        </item>\n';
    output += '    </channel>\n';
    output += '</rss>';

    var data = feed.render('rss-2.0');

    assert.equal(data, output);
  });

});
