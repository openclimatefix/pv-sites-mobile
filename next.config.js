/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
};

const withPWA = require('next-pwa')({
  dest: 'public/sw',
  sw: '/sw/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
