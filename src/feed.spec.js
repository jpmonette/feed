import Feed from './feed'

let sampleDate = new Date('Sat, 13 Jul 2013 23:00:00 GMT');

let feed = new Feed({
  title: 'Feed Title',
  description: 'This is my personnal feed!',
  link: 'http://example.com/',
  id: 'http://example.com/',
  feed: 'http://example.com/feed.rss',
  image: 'http://example.com/image.png',
  copyright: 'All rights reserved 2013, John Doe',
  updated: sampleDate, // optional, default = today

  author: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    link: 'https://example.com/johndoe'
  }
})

feed.addCategory('Technology')

feed.addContributor({
  name: 'Johan Cruyff',
  email: 'johancruyff@example.com',
  link: 'https://example.com/johancruyff'
})

feed.addItem({
  title: 'Hello World',
  id: 'https://example.com/hello-world',
  link: 'https://example.com/hello-world',
  description: 'This is an article about Hello World.',
  author: [{
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    link: 'https://example.com/janedoe'
  }, {
    name: 'Joe Smith',
    email: 'joesmith@example.com',
    link: 'https://example.com/joesmith'
  }],
  contributor: [{
    name: 'Shawn Kemp',
    email: 'shawnkemp@example.com',
    link: 'https://example.com/shawnkemp'
  }, {
    name: 'Reggie Miller',
    email: 'reggiemiller@example.com',
    link: 'https://example.com/reggiemiller'
  }],
  date: sampleDate,
  image: 'https://example.com/hello-world.jpg'
})

test('it should generate an RSS 2.0 feed', () => {
  let expected = `<?xml version=\"1.0\" encoding=\"utf-8\"?>
<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">
    <channel>
        <title>Feed Title</title>
        <link>http://example.com/</link>
        <description>This is my personnal feed!</description>
        <lastBuildDate>Sat, 13 Jul 2013 23:00:00 GMT</lastBuildDate>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <generator>Feed for Node.js</generator>
        <image>
            <title>Feed Title</title>
            <url>http://example.com/image.png</url>
            <link>http://example.com/</link>
        </image>
        <copyright>All rights reserved 2013, John Doe</copyright>
        <category>Technology</category>
        <atom:link href=\"http://example.com/feed.rss\" rel=\"self\" type=\"application/rss+xml\"/>
        <item>
            <title><![CDATA[Hello World]]></title>
            <link>https://example.com/hello-world</link>
            <guid>https://example.com/hello-world</guid>
            <pubDate>Sat, 13 Jul 2013 23:00:00 GMT</pubDate>
            <description><![CDATA[This is an article about Hello World.]]></description>
            <author>janedoe@example.com (Jane Doe)</author>
            <enclosure url=\"https://example.com/hello-world.jpg\" type=\"image/jpeg\">
            </enclosure>
        </item>
    </channel>
</rss>`;

  let actual = feed.rss2()

  expect(actual).toBe(expected)
});

test('it should generate an Atom 1.0 feed', () => {
  let expected = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <id>http://example.com/</id>
    <title>Feed Title</title>
    <updated>2013-07-13T23:00:00Z</updated>
    <generator>Feed for Node.js</generator>
    <author>
        <name>John Doe</name>
        <email>johndoe@example.com</email>
        <uri>https://example.com/johndoe</uri>
    </author>
    <link rel="alternate" href="http://example.com/"/>
    <link rel="self" href="http://example.com/feed.rss"/>
    <subtitle>This is my personnal feed!</subtitle>
    <logo>http://example.com/image.png</logo>
    <rights>All rights reserved 2013, John Doe</rights>
    <category term="Technology">
    </category>
    <contributor>
        <name>Johan Cruyff</name>
        <email>johancruyff@example.com</email>
        <uri>https://example.com/johancruyff</uri>
    </contributor>
    <entry>
        <title type="html"><![CDATA[Hello World]]></title>
        <id>https://example.com/hello-world</id>
        <link href="https://example.com/hello-world">
        </link>
        <updated>2013-07-13T23:00:00Z</updated>
        <summary type="html"><![CDATA[This is an article about Hello World.]]></summary>
        <author>
            <name>Jane Doe</name>
            <email>janedoe@example.com</email>
            <uri>https://example.com/janedoe</uri>
        </author>
        <author>
            <name>Joe Smith</name>
            <email>joesmith@example.com</email>
            <uri>https://example.com/joesmith</uri>
        </author>
        <contributor>
            <name>Shawn Kemp</name>
            <email>shawnkemp@example.com</email>
            <uri>https://example.com/shawnkemp</uri>
        </contributor>
        <contributor>
            <name>Reggie Miller</name>
            <email>reggiemiller@example.com</email>
            <uri>https://example.com/reggiemiller</uri>
        </contributor>
    </entry>
</feed>`;

  let actual = feed.atom1()

  expect(actual).toBe(expected)
});