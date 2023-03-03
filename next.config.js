/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
});

const nextConfig = withPWA({
  reactStrictMode: true,
});
module.exports = nextConfig;
