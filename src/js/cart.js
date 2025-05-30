import { getLocalStorage, setLocalStorage, loadHeaderFooter, alertMessage, updateCartCount } from "./utils.mjs"
import ShoppingCart from "./ShoppingCart.mjs"

loadHeaderFooter()

const cart = new ShoppingCart("so-cart", ".product-list")
cart.init()

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []
  const productListElement = document.querySelector(".product-list")
  const cartTotalElement = document.querySelector(".cart-total")
  const listFooterElement = document.querySelector(".list-footer")
  const emptyCartElement = document.querySelector(".empty-cart")

  if (!productListElement) {
    console.error("Product list element not found")
    return
  }

  if (cartItems.length === 0) {
    productListElement.innerHTML = ""
    if (listFooterElement) listFooterElement.classList.add("hide")
    if (emptyCartElement) emptyCartElement.classList.remove("hide")
    return
  }

  // Show cart contents
  if (emptyCartElement) emptyCartElement.classList.add("hide")
  if (listFooterElement) listFooterElement.classList.remove("hide")

  const htmlItems = cartItems.map((item) => cartItemTemplate(item))
  productListElement.innerHTML = htmlItems.join("")

  // Update cart total
  const total = calculateCartTotal(cartItems)
  if (cartTotalElement) {
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`
  }

  // Add event listeners for remove buttons
  addRemoveListeners()

  // Update cart count in header
  updateCartCount()
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium || item.Image || "/images/placeholder.svg"}"
      alt="${item.Name}"
    />
  </a>
  <a href="/product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__remove" data-id="${item.Id}">❌</button>
</li>`

  return newItem
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove")
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart)
  })
}

function removeFromCart(e) {
  const id = e.target.dataset.id
  let cartItems = getLocalStorage("so-cart") || []
  const itemToRemove = cartItems.find((item) => item.Id === id)
  cartItems = cartItems.filter((item) => item.Id !== id)
  setLocalStorage("so-cart", cartItems)
  renderCartContents()
  if (itemToRemove) {
    alertMessage(`${itemToRemove.Name} removed from cart`)
  }
}

function calculateCartTotal(items) {
  return items.reduce((total, item) => {
    const quantity = item.quantity || 1
    return total + item.FinalPrice * quantity
  }, 0)
}

function addCheckoutListener() {
  const checkoutButton = document.querySelector(".checkout")
  if (checkoutButton) {
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault()
      const cartItems = getLocalStorage("so-cart") || []
      if (cartItems.length === 0) {
        alertMessage("Your cart is empty. Add some items before checking out.")
        return
      }
      window.location.href = "/checkout/index.html"
    })
  }
}

// Initialize cart display
renderCartContents()
addCheckoutListener()
