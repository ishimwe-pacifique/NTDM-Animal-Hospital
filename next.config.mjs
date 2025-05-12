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
  experimental: {
    serverComponentsExternalPackages: ["mongodb"],
  },
  // Ensure correct file generation for client components
  webpack: (config, { isServer }) => {
    return config;
  },
}

export default nextConfig
