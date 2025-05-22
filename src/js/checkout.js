import { loadHeaderFooter, getLocalStorage } from "./utils.mjs"

loadHeaderFooter()

function renderOrderSummary() {
  const cartItems = getLocalStorage("so-cart") || []
  const summaryElement = document.querySelector(".checkout-summary")

  // Clear existing content
  summaryElement.innerHTML = ""

  // Add each item to the summary
  cartItems.forEach((item) => {
    const listItem = document.createElement("li")
    listItem.innerHTML = `
      <img src="${item.Images.PrimarySmall}" alt="${item.Name}" width="50">
      <span>${item.Name}</span>
      <span>$${item.FinalPrice}</span>
    `
    summaryElement.appendChild(listItem)
  })

  // Calculate and display total
  if (cartItems.length > 0) {
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0)
    document.getElementById("checkout-total-amount").textContent = `$${total.toFixed(2)}`
  } else {
    document.getElementById("checkout-total-amount").textContent = "$0.00"
  }
}

// Form validation and submission
document.querySelector("form[name='checkout']").addEventListener("submit", function (e) {
  e.preventDefault()

  // Basic form validation
  const formData = new FormData(this)
  let isValid = true

  // Check required fields
  for (const [name, value] of formData.entries()) {
    if (!value) {
      isValid = false
      const field = document.getElementById(name)
      field.classList.add("error")
    }
  }

  if (isValid) {
    // Process order
    alert("Order submitted successfully!")
    // Clear cart
    localStorage.removeItem("so-cart")
    // Redirect to confirmation page
    window.location.href = "/"
  }
})

// Initialize
renderOrderSummary()
