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
  // Không cần output: 'standalone' khi dùng Netlify plugin
  // Plugin sẽ tự động xử lý
}

export default nextConfig
