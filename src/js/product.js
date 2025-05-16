import { setLocalStorage, getLocalStorage, getParam, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData('tents');
const productId = getParam('product');
let product = null; // Initialize product variable in the outer scope

// Update cart count on page load
updateCartCount();

dataSource.findProductById(productId)
  .then(productData => {
    product = productData; // Store the product data in our outer variable
    if (!product) {
      throw new Error('Product not found');
    }
    // Once we have the product data, update the HTML
    document.querySelector('#productName').innerText = product.Brand.Name;
    document.querySelector('#productNameWithoutBrand').innerText = product.NameWithoutBrand;
    document.querySelector('#productImage').src = product.Image;
    document.querySelector('#productImage').alt = product.Name;
    document.querySelector('#productFinalPrice').innerText = product.FinalPrice;
    document.querySelector('#productColorName').innerText = product.Colors[0].ColorName;
    document.querySelector('#productDescriptionHtmlSimple').innerHTML = product.DescriptionHtmlSimple;
    document.querySelector('#addToCart').setAttribute('data-id', product.Id);
  })
  .catch(error => {
    console.error('Error loading product:', error);
    // Handle the error appropriately
    document.querySelector('.product-detail').innerHTML = '<h2>Product not found</h2>';
  });

// Add to cart functionality
document.querySelector('#addToCart').addEventListener('click', () => {
  if (!product) return; // Guard clause to prevent adding undefined product
  let cart = getLocalStorage('so-cart') || [];
  cart.push(product);
  setLocalStorage('so-cart', cart);
  updateCartCount(); // Update the cart count after adding an item
});