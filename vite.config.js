import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
          main: path.resolve(__dirname, 'index.html'),
          product_listing: path.resolve(__dirname, 'product_listing/index.html'),
          product_pages: path.resolve(__dirname, 'product_pages/index.html'),
          cart: path.resolve(__dirname, 'cart/index.html'),
          checkout: path.resolve(__dirname, 'checkout/index.html'),
          wishlist: path.resolve(__dirname, 'wishlist/index.html'),
          success: path.resolve(__dirname, 'success.html'),
      },
    },
  },
});
