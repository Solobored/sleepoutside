import { loadHeaderFooter, updateCartCount, updateWishlistCount } from "./utils.mjs"

loadHeaderFooter().then(() => {
  // Update cart and wishlist counts after header is loaded
  updateCartCount()
  updateWishlistCount()
})
