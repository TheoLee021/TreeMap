/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    return config;
  }
}

module.exports = nextConfig 