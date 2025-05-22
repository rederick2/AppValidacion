/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/foto.jpg',
      },
      {
        protocol: 'http',
        hostname: '1233.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
