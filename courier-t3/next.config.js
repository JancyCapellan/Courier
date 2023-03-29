// import withPWA from 'next-pwa'

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config
}

const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = withPWA(
  defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    // fixed prblem for docker files not running from errors, --legacy-peers was also needed beacuse storybook had use it with npm install so npm ci also needs it
    eslint: {
      ignoreDuringBuilds: true,
    },
    productionBrowserSourceMaps: true,
    output: 'standalone',
  })
)

module.exports = nextConfig