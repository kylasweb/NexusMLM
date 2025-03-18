import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/" : "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@/components/ui",
            "lucide-react",
            "@radix-ui/react-dialog",
            "@radix-ui/react-tabs"
          ]
        }
      }
    }
  },
  plugins: [
    react({
      plugins: process.env.TEMPO === "true" ? [["tempo-devtools/swc", {}]] : [],
    }),
    tempo(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 3000
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  }
});
