/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-quill"],
  images: {
    domains: ["images.unsplash.com", "randomuser.me"],
  },
};

export default nextConfig;
