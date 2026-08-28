import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  },
  transpilePackages: ["@mui/material", "@mui/icons-material"],
  async redirects() {
    return [
      // 1. Redirect legacy blog-fashion-gate-mall-damascus root-level URL
      {
        source: "/blog-fashion-gate-mall-damascus",
        destination: "/blogs/blog-fashion-gate-mall-syria/ar",
        permanent: true
      },
      // 2. Redirect legacy blogs/blog-fashion-gate-mall-damascus sub-page URL
      {
        source: "/blogs/blog-fashion-gate-mall-damascus",
        destination: "/blogs/blog-fashion-gate-mall-syria/ar",
        permanent: true
      },
      // 3. Redirect lang-specific variants of legacy URL
      {
        source: "/blogs/blog-fashion-gate-mall-damascus/:lang(en|ar)",
        destination: "/blogs/blog-fashion-gate-mall-syria/:lang",
        permanent: true
      },
      // 4. Redirect singular /blog to plural /blogs
      {
        source: "/blog",
        destination: "/blogs/ar",
        permanent: true
      },
      {
        source: "/blog/:path*",
        destination: "/blogs/:path*",
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
