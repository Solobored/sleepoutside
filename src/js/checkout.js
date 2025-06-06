import { loadHeaderFooter } from "./utils.mjs"
import CheckoutProcess from "./CheckoutProcess.mjs"

loadHeaderFooter()

const myCheckout = new CheckoutProcess("so-cart", ".checkout-summary")
myCheckout.init()

// calculate the totals once the zip has been entered
document.querySelector("#zip").addEventListener("blur", myCheckout.calculateOrdertotal.bind(myCheckout))

// listening for click on the button
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault()
  const myForm = document.forms["checkout"]
  const chk_status = myForm.checkValidity()
  myForm.reportValidity()
  if (chk_status) {
    myCheckout.checkout()
  }
})
