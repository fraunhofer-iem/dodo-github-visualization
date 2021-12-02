/** @type {import('next').NextConfig} */
const path = require("path")
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
  swcMinify: true,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
}
