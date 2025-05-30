import { setLocalStorage, getLocalStorage, alertMessage, addToWishlist, addToRecentlyViewed, updateCartCount, getRecentlyViewed } from "./utils.mjs";

function productDetailsTemplate(product) {
  return `<section class="product-detail"> 
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      <button id="addToWishlist" data-id="${product.Id}">♡ Add to Wishlist</button>
    </div>
  </section>`;
}

function recentlyViewedTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  
  async init() {
    // use our datasource to get the details for the current product
    this.product = await this.dataSource.findProductById(this.productId);
    // once we have the product details we can render out the HTML
    this.renderProductDetails("main");
    // Add to recently viewed
    addToRecentlyViewed(this.product);
    // Render recently viewed products
    this.renderRecentlyViewed();
    // once the HTML is rendered we can add listeners
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
    document
      .getElementById("addToWishlist")
      .addEventListener("click", this.addToWishlist.bind(this));
  }
  
  // ProductDetails.mjs
addToCart() {
  let cartContents = getLocalStorage("so-cart");
  if (!cartContents) cartContents = [];
  
  const existingItem = cartContents.find(item => item.Id === this.product.Id);
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    this.product.quantity = 1;
    cartContents.push(this.product);
  }
  
  setLocalStorage("so-cart", cartContents);
  alertMessage(`${this.product.NameWithoutBrand} added to cart!`);
  updateCartCount(); // Ensure this is called
}
  
  addToWishlist() {
    addToWishlist(this.product);
  }
  
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product)
    );
  }
  
  renderRecentlyViewed() {
    const recentlyViewed = getRecentlyViewed();
    // Filter out current product
    const filteredRecent = recentlyViewed.filter(item => item.Id !== this.product.Id);
    
    if (filteredRecent.length > 0) {
      const recentlyViewedHTML = `
        <section class="recently-viewed">
          <h3>Recently Viewed</h3>
          <ul class="product-list">
            ${filteredRecent.map(recentlyViewedTemplate).join('')}
          </ul>
        </section>
      `;
      
      const mainElement = document.querySelector("main");
      mainElement.insertAdjacentHTML("beforeend", recentlyViewedHTML);
    }
  }
}
