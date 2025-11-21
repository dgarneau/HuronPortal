/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark bcryptjs as external to prevent bundling issues
      config.externals = config.externals || [];
      config.externals.push('bcryptjs');
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
