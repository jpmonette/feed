import Feed from './feed'

test('adds 1 + 2 to equal 3', () => {
	var feed = new Feed({
		title: 'Feed Title',
		description: 'This is my personnal feed!',
		id: 'fake',
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

	feed.addItem({
		title: 'Title #1',
		id: 'https://id',
		link: 'https://url',
		description: '#1 description',
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
		date: new Date(),
		image: 'test.png'
	});

	feed.rss2()
	feed.atom1()
});
