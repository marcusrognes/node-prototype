const { StartServer } = require('../dist/server/server');

var server = null;
const PORT = process.env.PORT || 4000;
const ROOT_URL = `http://localhost:${PORT}`;

describe('Server with react', () => {
	beforeAll(async () => {
		({ server } = await StartServer());

		await page.goto(`${ROOT_URL}`);
	});

	afterAll(async () => {
		await server.close();
	}, 3000);

	it('should display "Login" text on page', async () => {
		await expect(page).toMatch('Login');
	});
});
