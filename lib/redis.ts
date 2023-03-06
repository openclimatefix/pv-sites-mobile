// THIS FILE WILL BE DELETED, we will not use Redis when finally deploying the app
// since pv-site-api will control the Enode access tokens and store them in the sites DB.
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
});
