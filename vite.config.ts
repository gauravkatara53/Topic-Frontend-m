import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const API_URL = process.env.VITE_API_URL;

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: API_URL, // ✅ now works
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});
