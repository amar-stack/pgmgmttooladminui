/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
  basePath: "/adminDashboard",
  async redirects() {
    return [
      {
          source: '/',
          destination: '/adminDashboard',
          basePath: false,
          permanent: false
      }
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.justboil.me',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

export default nextConfig