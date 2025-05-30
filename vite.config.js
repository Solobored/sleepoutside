import { resolve } from "path"
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(fileURLToPath(new URL("./src/index.html", import.meta.url))),
        cart: resolve(fileURLToPath(new URL("./src/cart/index.html", import.meta.url))),
        checkout: resolve(fileURLToPath(new URL("./src/checkout/index.html", import.meta.url))),
        checkouttwo: resolve(fileURLToPath(new URL("./src/checkout/success.html", import.meta.url))),
        product: resolve(fileURLToPath(new URL("./src/product_pages/index.html", import.meta.url))),
        productlisting: resolve(fileURLToPath(new URL("./src/product_listing/index.html", import.meta.url))),
      },
    },
  },
})
