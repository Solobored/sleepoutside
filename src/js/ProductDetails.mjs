import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Get the product data from the data source
    this.product = await this.dataSource.findProductById(this.productId);
    
    // Render the product details
    this.renderProductDetails();
    
    // Add event listener to the Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
      
    // Update cart count on page load
    this.updateCartCount();
  }

  addProductToCart() {
    // Get current cart or initialize empty array
    const cart = getLocalStorage("so-cart") || [];
    
    // Add the current product to the cart array
    cart.push(this.product);
    
    // Save updated cart back to localStorage
    setLocalStorage("so-cart", cart);
    
    // Show feedback to user
    this.showAddedToCartFeedback();
    
    // Update cart count
    this.updateCartCount();
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
    feedback.style.color = "white";
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

  updateCartCount() {
    const cart = getLocalStorage("so-cart") || [];
    const cartElement = document.querySelector(".cart");
    
    // Remove existing count if any
    const existingCount = document.querySelector(".cart-count");
    if (existingCount) {
      existingCount.remove();
    }
    
    // Only show count if there are items
    if (cart.length > 0) {
      const countSpan = document.createElement("span");
      countSpan.className = "cart-count";
      countSpan.textContent = cart.length;
      countSpan.style.position = "absolute";
      countSpan.style.top = "-10px";
      countSpan.style.right = "-10px";
      countSpan.style.backgroundColor = "var(--primary-color)";
      countSpan.style.color = "white";
      countSpan.style.borderRadius = "50%";
      countSpan.style.padding = "2px 8px";
      countSpan.style.fontSize = "0.8rem";
      cartElement.style.position = "relative";
      cartElement.appendChild(countSpan);
    }
  }

  renderProductDetails() {
    // Get the main element where we'll render the product details
    const main = document.querySelector("main");
    
    // Create the HTML for the product details
    const productHTML = `
      <section class="product-detail">
        <h3>${this.product.Brand.Name}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        <img
          class="divider"
          src="${this.product.Images.PrimaryLarge}"
          alt="${this.product.NameWithoutBrand}"
        />
        <p class="product-card__price">$${this.product.FinalPrice}</p>
        <p class="product__color">${this.product.Colors[0].ColorName}</p>
        <p class="product__description">
          ${this.product.DescriptionHtmlSimple}
        </p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;
    
    // Clear the main element and add the product details
    main.innerHTML = productHTML;
  }
}