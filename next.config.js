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
      'store',
      'typings',
      'utils',
    ],
  },
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
