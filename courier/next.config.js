const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})
module.exports = {
  reactStrictMode: true,
  // output: 'standalone',
}
