/** @type {import('next').NextConfig} */
const nextConfig = {
  // Leaflet MapContainer ломается при двойном mount в Strict Mode
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig
