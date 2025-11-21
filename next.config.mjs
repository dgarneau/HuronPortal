/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
  serverExternalPackages: [],
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/bcryptjs/**/*'],
    },
  },
};

export default nextConfig;
