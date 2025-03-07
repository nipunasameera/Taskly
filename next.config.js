/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Don't resolve 'fs' module on the client to prevent this error
        config.resolve.fallback = {
          fs: false,
          net: false,
          tls: false,
          "node-fetch": false
        }
      }
      return config
    },
    experimental: {
      serverActions: true,
    }
  }
  
  module.exports = nextConfig 