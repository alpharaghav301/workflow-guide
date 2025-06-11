/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Base path for GitHub Pages (uncomment and change 'your-repo-name' to your actual repo name)
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name',
};

module.exports = nextConfig;
