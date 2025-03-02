import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "public",
      filename: "service-worker.js",
      manifest: {
        name: "MicroBlog - Réseau Social",
        short_name: "MicroBlog",
        theme_color: "#1da1f2",
        icons: [
          {
            src: "/microblog-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/microblog-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
})
