import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The Basic Reading workbooks are read off disk by
   * /api/reading/materials, not imported, so nothing in the build graph
   * points at them and tracing would leave them behind. Naming them here
   * ships them with that route's bundle.
   *
   * They live outside public/ on purpose: served statically they would be
   * readable without an account, which is the whole thing the route exists
   * to prevent.
   */
  outputFileTracingIncludes: {
    "/api/reading/materials/[...path]": ["./content-reading-materials/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
