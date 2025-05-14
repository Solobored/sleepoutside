import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs"
import ProductData from "./ProductData.mjs"
import ProductDetails from "./ProductDetails.mjs"

const productId = getParam("product")
const dataSource = new ProductData("tents")

const product = new ProductDetails(productId, dataSource)
product.init()

function addProductToCart(product) {
  // Get current cart or initialize empty array
  const cart = getLocalStorage("so-cart") || []

  // Add new product to the cart array
  cart.push(product)

  // Save updated cart back to localStorage
  setLocalStorage("so-cart", cart)

  // Give user feedback that item was added
  showAddedToCartFeedback()

  // Update cart count in the header
  updateCartCount()
}

function showAddedToCartFeedback() {
  // Create feedback element
  const feedback = document.createElement("div")
  feedback.classList.add("add-to-cart-feedback")
  feedback.textContent = "Item added to cart!"
  feedback.style.position = "fixed"
  feedback.style.top = "20%"
  feedback.style.left = "50%"
  feedback.style.transform = "translateX(-50%)"
  feedback.style.backgroundColor = "var(--primary-color)"
  feedback.style.padding = "10px 20px"
  feedback.style.borderRadius = "5px"
  feedback.style.zIndex = "1000"

  // Add to DOM
  document.body.appendChild(feedback)

  // Remove after 3 seconds
  setTimeout(() => {
    feedback.remove()
  }, 3000)
}

function updateCartCount() {
  const cart = getLocalStorage("so-cart") || []
  const cartElement = document.querySelector(".cart")

  // Remove existing count if any
  const existingCount = document.querySelector(".cart-count")
  if (existingCount) {
    existingCount.remove()
  }

  // Only show count if there are items
  if (cart.length > 0) {
    const countSpan = document.createElement("span")
    countSpan.className = "cart-count"
    countSpan.textContent = cart.length
    cartElement.appendChild(countSpan)
  }
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id)
  addProductToCart(product)
}

// Display cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
})

// add listener to Add to Cart button
document.getElementById("addToCart").addEventListener("click", addToCartHandler)
