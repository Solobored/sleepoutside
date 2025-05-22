import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product
    this.product = await this.dataSource.findProductById(this.productId);
    // render the HTML
    this.renderProductDetails();
    // add listener to Add to Cart button
    document
      .getElementById("add-to-cart")
      .addEventListener("click", this.addProductToCart.bind(this));
  
    // Add to recently viewed
    this.addToRecentlyViewed();
    // Render recently viewed products
    this.renderRecentlyViewed();
  }

  addProductToCart() {
    // Get current cart or initialize empty array
    const cart = getLocalStorage("so-cart") || [];
    // Add new product to the cart array
    cart.push(this.product);
    // Save updated cart back to localStorage
    setLocalStorage("so-cart", cart);
    // Update cart count
    this.updateCartCount();
    // Show feedback
    this.showAddedToCartFeedback();
  }

  updateCartCount() {
    const cart = getLocalStorage("so-cart") || [];
    const countElement = document.querySelector(".cart-count");
    
    if (countElement) {
      if (cart.length > 0) {
        countElement.textContent = cart.length;
        countElement.classList.remove("hide");
      } else {
        countElement.classList.add("hide");
      }
    }
  }

  showAddedToCartFeedback() {
    // Create feedback element
    const feedback = document.createElement("div");
    feedback.classList.add("add-to-cart-feedback");
    feedback.textContent = "Item added to cart!";
    feedback.style.position = "fixed";
    feedback.style.top = "20%";
    feedback.style.left = "50%";
    feedback.style.transform = "translateX(-50%)";
    feedback.style.backgroundColor = "var(--primary-color)";
    feedback.style.padding = "10px 20px";
    feedback.style.borderRadius = "5px";
    feedback.style.zIndex = "1000";

    // Add to DOM
    document.body.appendChild(feedback);

    // Remove after 3 seconds
    setTimeout(() => {
      feedback.remove();
    }, 3000);
  }

  renderProductDetails() {
    document.querySelector("h2").textContent = this.product.Category.charAt(0).toUpperCase() + this.product.Category.slice(1);
    document.querySelector("#p-brand").textContent = this.product.Brand.Name;
    document.querySelector("#p-name").textContent = this.product.NameWithoutBrand;

    const productImage = document.querySelector("#p-image");
    productImage.src = this.product.Images.PrimaryLarge;
    productImage.alt = this.product.NameWithoutBrand;
    
    document.querySelector("#p-price").textContent = `$${this.product.FinalPrice}`;
    document.querySelector("#p-color").textContent = this.product.Colors[0].ColorName;
    document.querySelector("#p-description").innerHTML = this.product.DescriptionHtmlSimple;

    document.querySelector("#add-to-cart").dataset.id = this.product.Id;
  }

  addToRecentlyViewed() {
    // Get current recently viewed products or initialize empty array
    const recentlyViewed = getLocalStorage("so-recently-viewed") || [];
    
    // Check if product is already in recently viewed
    const exists = recentlyViewed.find(item => item.Id === this.product.Id);
    
    // If product is not already in recently viewed, add it
    if (!exists) {
      // Add to the beginning of the array (most recent first)
      recentlyViewed.unshift(this.product);
      
      // Limit to 4 items
      const limitedRecent = recentlyViewed.slice(0, 4);
      
      // Save back to localStorage
      setLocalStorage("so-recently-viewed", limitedRecent);
    }
  }

  renderRecentlyViewed() {
    const recentlyViewed = getLocalStorage("so-recently-viewed") || [];
    
    // Filter out the current product
    const filteredRecent = recentlyViewed.filter(item => item.Id !== this.productId);
    
    // If there are recently viewed products, render them
    if (filteredRecent.length > 0) {
      // Create container if it doesn't exist
      let recentContainer = document.querySelector(".recently-viewed");
      if (!recentContainer) {
        recentContainer = document.createElement("section");
        recentContainer.className = "recently-viewed";
        recentContainer.innerHTML = `
          <h3>Recently Viewed Products</h3>
          <ul class="product-list"></ul>
        `;
        document.querySelector("main").appendChild(recentContainer);
      }
      
      // Render the recently viewed products
      const listElement = recentContainer.querySelector(".product-list");
      renderListWithTemplate(this.recentProductCardTemplate, listElement, filteredRecent);
    }
  }

  recentProductCardTemplate(product) {
    return `
      <li class="product-card">
        <a href="/product_pages/?product=${product.Id}">
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
          <h3>${product.Brand.Name}</h3>
          <p>${product.NameWithoutBrand}</p>
          <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
      </li>
    `;
  }
}
