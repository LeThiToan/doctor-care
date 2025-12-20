/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove 'standalone' output for Netlify compatibility
  // Netlify will handle Next.js build automatically
  // output: 'standalone',
}

export default nextConfig
