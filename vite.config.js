import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        cart: resolve(__dirname, 'src/cart/index.html'),
        'product-detail': resolve(__dirname, 'src/product_pages/index.html'),
        'cedar-ridge-rimrock-2': resolve(__dirname, 'src/product_pages/cedar-ridge-rimrock-2.html'),
        'marmot-ajax-3': resolve(__dirname, 'src/product_pages/marmot-ajax-3.html'),
        'northface-alpine-3': resolve(__dirname, 'src/product_pages/northface-alpine-3.html'),
        'northface-talus-4': resolve(__dirname, 'src/product_pages/northface-talus-4.html'),
        checkout: resolve(__dirname, 'src/checkout/index.html'),
      },
    },
  },
  publicDir: 'public',
});