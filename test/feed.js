var assert = require("assert"),
  Feed = require('../lib/feed.js'),
  fs = require('fs')

describe('RSS 2.0', function () {

  it('should return a standard feed', function () {

    var feed = new Feed({
      title: 'Feed Title',
      description: 'This is my personnal feed!',
      link: 'http://example.com/',
      image: 'http://example.com/image.png',
      copyright: 'All rights reserved 2013, John Doe',
      updated: new Date('Sat, 13 Jul 2013 23:00:00 GMT'), // optional, default = today

      author: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        link: 'https://example.com/johndoe'
      }
    });

    var output = '';

    output += '<?xml version="1.0" encoding="utf-8"?>\n';
    output += '<rss version="2.0">\n';
    output += '    <channel>\n';
    output += '        <title>Feed Title</title>\n';
    output += '        <description>This is my personnal feed!</description>\n';
    output += '        <link>http://example.com/</link>\n';
    output += '        <lastBuildDate>Sat, 13 Jul 2013 23:00:00 GMT</lastBuildDate>\n';
    output += '        <docs>http://blogs.law.harvard.edu/tech/rss</docs>\n';
    output += '        <image>\n';
    output += '            <title>Feed Title</title>\n';
    output += '            <url>http://example.com/image.png</url>\n';
    output += '            <link>http://example.com/</link>\n';
    output += '        </image>\n';
    output += '        <copyright>All rights reserved 2013, John Doe</copyright>\n';
    output += '        <generator>Feed for Node.js</generator>\n';
    output += '    </channel>\n';
    output += '</rss>';

    var data = feed.render('rss-2.0');

    assert.equal(data, output);
  });

});


describe('atom_1_0', function () {

  it('checking insertion of custom namespaces', function () {
    var newfeed = new Feed({
        title: 'Feed Title',
        id: 'feedid',
        link: 'http://example.com/',
        feed: 'http://example.com/1087',
        description: 'This feed is an example feed',
        pubDate: new Date('Sat, 13 Jul 2013 23:00:00 GMT')
    });
    newfeed.addNS('xml:lang', 'en-US');
    newfeed.addNS('xmlns:max', 'http://www.memezone.com/memiki/atom/extension');
    newfeed.addNS('xml:base', 'http://www.uniprot.org/');

    var output = '<?xml version="1.0" encoding="utf-8"?>\n';
    output += '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US" xmlns:max="http://www.memezone.com/memiki/atom/extension" xml:base="http://www.uniprot.org/">\n';

    assert(newfeed.render('atom-1.0').startsWith(output));
  });
});
