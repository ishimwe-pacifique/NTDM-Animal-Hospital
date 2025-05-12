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
    // Add experimental flag to help with client component resolution
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Ensure correct file generation for client components
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Correctly handle client references
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        dns: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

export default nextConfig
