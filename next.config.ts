import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/stands/caarendy", destination: "/stands/kaarendy", permanent: true },
    ];
  },
  // Evita que Turbopack tome como raíz un package-lock.json de un directorio superior.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
