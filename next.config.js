/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use standalone output for better compatibility
  output: 'standalone',
  // Disable static page generation for pages that use client-side APIs
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig


