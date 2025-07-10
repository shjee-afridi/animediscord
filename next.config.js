const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'animediscord.com',
          },
        ],
        destination: 'https://www.animediscord.com/:path*',
        permanent: true,
      },
    ];
  },
  experimental: {
    // legacyBrowsers: false,
    esmExternals: 'loose',
  },
  swcMinify: true, // Ensure JS is minified
  images: {
    domains: [
      'cdn.discordapp.com',
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
