import dotenv from 'dotenv/config';

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN || 'localhost:' + PORT;
const SECURE = process.env.SECURE;
const URL = `${SECURE}://${DOMAIN}/`;

export { PORT, DOMAIN, SECURE, URL };
