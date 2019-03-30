require('dotenv').config();

const { StartServer } = require('../dist/server/server');

let server = null;
const PORT = process.env.PORT || 4000;
const ROOT_URL = `http://localhost:${PORT}`;

describe('Server with react', () => {
	beforeAll(async () => {
		({ server } = await StartServer());
	});

	afterAll(async () => {
		server.close();
	}, 3000);

	it('should display "Login" text on page', async () => {
		await page.goto(`${ROOT_URL}`);

		await expect(page).toMatch('Login');
	});
});
