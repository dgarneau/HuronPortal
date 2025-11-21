/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
  // Don't externalize bcryptjs - bundle it
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure bcryptjs is not treated as external
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(
          external => typeof external !== 'string' || !external.includes('bcryptjs')
        );
      }

      // Alias bcrypt to bcryptjs to resolve any "Cannot find module 'bcrypt'" errors
      // This handles cases where a dependency or leftover code might try to require 'bcrypt'
      config.resolve.alias = {
        ...config.resolve.alias,
        bcrypt: 'bcryptjs',
      };
    }
    return config;
  },
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': [
        './node_modules/bcryptjs/**/*'
      ],
    },
  },
};

export default nextConfig;
