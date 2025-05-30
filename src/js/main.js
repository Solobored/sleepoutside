import { loadHeaderFooter, updateCartCount, updateWishlistCount } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
  updateWishlistCount();
});