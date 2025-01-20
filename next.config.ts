import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "v5.airtableusercontent.com", // Airtable
      "res.cloudinary.com", // Cloudinary
    ],
  },
};

export default nextConfig;
