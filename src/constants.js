import 'dotenv/config';

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN || 'localhost:' + PORT;
const SECURE = process.env.SECURE;
const URL = `${SECURE}://${DOMAIN}/`;

const DIR = process.env.DIR;

export { PORT, DOMAIN, SECURE, URL, DIR };
