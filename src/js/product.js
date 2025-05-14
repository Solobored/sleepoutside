import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData('tents');
const productId = getParam('product');

dataSource.findProductById(productId)
  .then(product => {
    // Once we have the product data, update the HTML
    document.querySelector('#productName').innerText = product.Brand.Name;
    document.querySelector('#productNameWithoutBrand').innerText = product.NameWithoutBrand;
    document.querySelector('#productImage').src = product.Image;
    document.querySelector('#productImage').alt = product.Name;
    document.querySelector('#productFinalPrice').innerText = product.FinalPrice;
    document.querySelector('#productColorName').innerText = product.Colors[0].ColorName;
    document.querySelector('#productDescriptionHtmlSimple').innerHTML = product.DescriptionHtmlSimple;
    document.querySelector('#addToCart').setAttribute('data-id', product.Id);
  });

// Add to cart functionality
document.querySelector('#addToCart').addEventListener('click', () => {
  let cart = getLocalStorage('so-cart') || [];
  cart.push(product);
  setLocalStorage('so-cart', cart);
});