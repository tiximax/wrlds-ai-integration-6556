import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  let pwaPlugin: any = null;
  if (mode === 'production' || process.env.ENABLE_PWA) {
    try {
      const { VitePWA } = await import('vite-plugin-pwa');
      pwaPlugin = VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,webp,avif}'],
          runtimeCaching: [
            {
              urlPattern: ({ request }: any) => ['style', 'script', 'image', 'font'].includes(request.destination),
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'wrlds-runtime' },
            },
          ],
        },
        includeAssets: ['/favicon.ico'],
        manifest: {
          name: 'WRLDS International Shopping',
          short_name: 'WRLDS',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#0ea5e9',
          icons: [],
        },
      });
    } catch {}
  }

  // Enable bundle analyzer when building with --mode analyze or when ANALYZE env is set
  let visualizerPlugin: any = null;
  if (mode === 'analyze' || process.env.ANALYZE) {
    try {
      const { visualizer } = await import('rollup-plugin-visualizer');
      visualizerPlugin = visualizer({
        filename: 'dist/stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: false,
      });
    } catch {}
  }

  // Inline critical CSS during production/analyze builds using Critters via a small custom plugin
  let crittersPlugin: any = null;
  if (mode === 'production' || mode === 'analyze') {
    try {
      const { default: Critters } = await import('critters');
      crittersPlugin = {
        name: 'critters-inline',
        apply: 'build',
        enforce: 'post',
        async closeBundle() {
          try {
            const distHtml = path.resolve(process.cwd(), 'dist', 'index.html');
            if (fs.existsSync(distHtml)) {
              const html = fs.readFileSync(distHtml, 'utf8');
              const critters = new (Critters as any)({
                path: path.resolve(process.cwd(), 'dist'),
                preload: 'swap',
                compress: true,
              });
              const inlined = await critters.process(html);
              fs.writeFileSync(distHtml, inlined, 'utf8');
            }
          } catch {}
        },
      };
    } catch {}
  }

  // (Optional) Image optimization plugin can be added here when available in environment
  const imageminPlugin: any = null

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      // Avoid running lovable-tagger inside Netlify Dev as it can interfere with HTML transform
      mode === 'development' && !process.env.NETLIFY && !process.env.NETLIFY_DEV && componentTagger(),
      pwaPlugin,
      crittersPlugin,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        plugins: [visualizerPlugin].filter(Boolean),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('framer-motion')) return 'vendor-motion';
              if (id.includes('@radix-ui')) return 'vendor-radix';
              if (id.includes('lucide-react')) return 'vendor-icons';
              // Split recharts into its own vendor chunk (must come before generic 'react' match)
              if (id.includes('node_modules/recharts')) return 'vendor-recharts';
              if (id.includes('react')) return 'vendor-react';
            }
          },
        },
      },
    },
  };
});
