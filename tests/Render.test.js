const { StartServer } = require('../dist/server/server');

var server = null;

describe('Server with react', () => {
	beforeAll(async () => {
		({server} = await StartServer());

		await page.goto('http://localhost:4000');
	});

	afterAll(async () => {
		await server.close();
	}, 3000);

	it('should display "Index.js" text on page', async () => {
		await expect(page).toMatch('Index.js');
	});
});
