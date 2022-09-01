/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: [
      'components',
      'hooks',
      'models',
      'pages',
      'policies',
      'repos',
      'services',
      'typings',
      'utils',
    ],
  },
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    swcPlugins: [
      ['next-superjson-plugin', {}],
    ],
  },
}

module.exports = nextConfig
