import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que Turbopack tome como raíz un package-lock.json de un directorio superior.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
