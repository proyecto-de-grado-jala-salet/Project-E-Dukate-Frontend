/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
};

module.exports = nextConfig;
