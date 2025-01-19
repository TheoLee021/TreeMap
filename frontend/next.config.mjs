/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  experimental: {
    outputFileTracingRoot: process.env.NODE_ENV === 'production' ? '/app' : undefined,
  },
}

export default nextConfig 