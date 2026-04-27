/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.adidas.com",
        port: "",
        pathname: "/**",
      },
      // Penambahan hostname Google sesuai gambar
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      // Keep domain lainnya agar gambar produk tetap muncul
      {
        protocol: "https",
        hostname: "*.gstatic.com", 
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "down-id.img.susercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

module.exports = nextConfig