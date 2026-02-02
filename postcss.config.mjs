/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
//  redirects: async () => {
//   return []
//   },
}

export default nextConfig
