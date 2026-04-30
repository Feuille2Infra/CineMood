/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: isGithubPages ? "export" : "standalone",
  basePath: isGithubPages ? "/CineMood" : "",
  assetPrefix: isGithubPages ? "/CineMood/" : "",
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org"
      }
    ]
  }
};

export default nextConfig;
