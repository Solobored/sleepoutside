import { getLocalStorage } from "./utils.mjs"

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []

  // Display cart count in header
  displayCartCount(cartItems.length)

  // Display cart items or empty cart message
  const productList = document.querySelector(".product-list")

  if (cartItems.length === 0) {
    productList.innerHTML = '<div class="cart-empty">Your cart is empty</div>'
    hideCartFooter()
    return
  }

  // Calculate total price and render cart items
  let totalPrice = 0
  const htmlItems = cartItems.map((item) => {
    totalPrice += Number.parseFloat(item.FinalPrice)
    return cartItemTemplate(item)
  })

  productList.innerHTML = htmlItems.join("")

  // Display cart total and checkout button
  renderCartFooter(totalPrice)
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="remove-item" data-id="${item.Id}">X</button>
</li>`

  return newItem
}

function renderCartFooter(total) {
  const footer = document.querySelector(".cart-footer") || createCartFooter()

  footer.innerHTML = `
    <div class="cart-total">
      <p>Total: $${total.toFixed(2)}</p>
    </div>
    <button class="checkout-button">Checkout</button>
  `

  document.querySelector(".checkout-button").addEventListener("click", () => {
    window.location.href = "../checkout/index.html"
  })

  // Show the footer
  footer.style.display = "block"
}

function createCartFooter() {
  const footer = document.createElement("section")
  footer.classList.add("cart-footer")
  document.querySelector("main").appendChild(footer)
  return footer
}

function hideCartFooter() {
  const footer = document.querySelector(".cart-footer")
  if (footer) {
    footer.style.display = "none"
  }
}

function displayCartCount(count) {
  // Get the cart element
  const cartElement = document.querySelector(".cart")

  // Remove existing cart count if any
  const existingCount = document.querySelector(".cart-count")
  if (existingCount) {
    existingCount.remove()
  }

  // Only add count if there are items
  if (count > 0) {
    const countSpan = document.createElement("span")
    countSpan.className = "cart-count"
    countSpan.textContent = count
    cartElement.appendChild(countSpan)
  }
}

// Function to set up event listeners for all pages
function setupCartEvents() {
  // Display cart count on page load for all pages
  const cartItems = getLocalStorage("so-cart") || []
  displayCartCount(cartItems.length)

  // Add remove item functionality if on cart page
  if (document.querySelector(".product-list")) {
    document.querySelector(".product-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-item")) {
        removeItemFromCart(e.target.getAttribute("data-id"))
      }
    })
  }
}

function removeItemFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || []
  cartItems = cartItems.filter((item) => item.Id !== id)
  localStorage.setItem("so-cart", JSON.stringify(cartItems))
  renderCartContents()
}

// Initialize the cart functionality
document.addEventListener("DOMContentLoaded", () => {
  setupCartEvents()

  // Only render cart contents if on the cart page
  if (document.querySelector(".product-list")) {
    renderCartContents()
  }
})
