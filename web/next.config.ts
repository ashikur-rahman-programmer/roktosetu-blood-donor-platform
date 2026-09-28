import type { NextConfig } from "next";

// Backend URL. In production it defaults to the deployed API; override with
// the BACKEND_URL env var if the backend URL ever changes.
const BACKEND_URL =
  process.env.BACKEND_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://roktosetu-server.vercel.app"
    : "http://localhost:4000");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
