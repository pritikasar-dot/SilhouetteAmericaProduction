import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  baseUrl: process.env.BASE_URL!,
  username: process.env.AUTH_USER!,
  password: process.env.AUTH_PASS!,
  headless: process.env.HEADLESS === 'true'
};