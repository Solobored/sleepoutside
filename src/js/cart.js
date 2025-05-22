import { getLocalStorage, loadHeaderFooter } from "./utils.mjs"

// Load header and footer only once
loadHeaderFooter()

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []
  const productList = document.querySelector(".product-list")

  // Clear the product list first to prevent duplication
  productList.innerHTML = ""

  if (cartItems.length === 0) {
    productList.innerHTML = '<div class="empty-cart">Your cart is empty</div>'
    hideCartFooter()
    return
  }

  // Calculate total price and render cart items
  let totalPrice = 0
  cartItems.forEach((item) => {
    const cartItem = document.createElement("li")
    cartItem.className = "cart-card divider"
    cartItem.innerHTML = cartItemTemplate(item)
    productList.appendChild(cartItem)
    totalPrice += Number.parseFloat(item.FinalPrice)
  })

  // Display cart total and checkout button
  renderCartFooter(totalPrice)

  // Add event listeners to remove buttons
  document.querySelectorAll(".cart-card__remove").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id")
      removeItemFromCart(itemId)
    })
  })
}

function cartItemTemplate(item) {
  // Make sure we're using the correct image path
  const imagePath = item.Images?.PrimaryMedium || item.Image

  return `
    <a href="#" class="cart-card__image">
      <img src="${imagePath}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button class="cart-card__remove" data-id="${item.Id}">X</button>
  `
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
  footer.classList.remove("hide")
}

function createCartFooter() {
  const footer = document.createElement("div")
  footer.classList.add("cart-footer")
  document.querySelector(".products").appendChild(footer)
  return footer
}

function hideCartFooter() {
  const footer = document.querySelector(".cart-footer")
  if (footer) {
    footer.classList.add("hide")
  }
}

function removeItemFromCart(itemId) {
  let cartItems = getLocalStorage("so-cart") || []
  cartItems = cartItems.filter((item) => item.Id !== itemId)
  localStorage.setItem("so-cart", JSON.stringify(cartItems))
  renderCartContents()
  updateCartCount()

  // Show notification
  showNotification("Item removed from cart")
}

function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || []
  const countElement = document.querySelector(".cart-count")

  if (countElement) {
    if (cartItems.length > 0) {
      countElement.textContent = cartItems.length
      countElement.classList.remove("hide")
    } else {
      countElement.classList.add("hide")
    }
  }
}

function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector(".notification")
  if (!notification) {
    notification = document.createElement("div")
    notification.className = "notification"
    document.body.appendChild(notification)
  }

  notification.textContent = message
  notification.classList.add("show")

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", () => {
  renderCartContents()
  updateCartCount()
})
