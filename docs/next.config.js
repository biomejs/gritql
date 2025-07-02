const withMarkdoc = require("@markdoc/next.js");

const plugins = [
  withMarkdoc({
    mode: "static",
    schemaPath: "./src/markdoc",
    tokenizerOptions: { allowComments: true },
  }),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, {}) => {
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.fallback) config.resolve.fallback = {};
    config.resolve.fallback.fs = false;

    return config;
  },
  experimental: {
    optimizeCss: true,
  },
  reactStrictMode: true,
  pageExtensions: ["md", "mdx", "js", "ts", "jsx", "tsx", "mdoc"]
};

module.exports = () => plugins.reduce((acc, next) => next(acc), nextConfig);
