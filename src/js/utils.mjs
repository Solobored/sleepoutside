// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// helper to get parameter strings
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

// function to take a list of objects and a template and insert the objects as HTML into the DOM
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// function to take an optional object and a template and insert the objects as HTML into the DOM
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load template: ${path}`);
    }
    const template = await res.text();
    return template;
  } catch (error) {
    console.error("Error loading template:", error);
    return "";
  }
}

// function to dynamically load the header and footer into a page
export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate("/partials/header.html");
    const headerElement = document.querySelector("#main-header");
    const footerTemplate = await loadTemplate("/partials/footer.html");
    const footerElement = document.querySelector("#main-footer");

    if (headerElement && headerTemplate) {
      renderWithTemplate(headerTemplate, headerElement);
    }
    if (footerElement && footerTemplate) {
      renderWithTemplate(footerTemplate, footerElement);
    }
    
    // Update cart count after header loads
    setTimeout(updateCartCount, 100);
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener("click", callback);
  }
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      const main = document.querySelector("main");
      if (main && main.contains(this)) {
        main.removeChild(this);
      }
    }
  });
  
  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
    if (scroll) window.scrollTo(0, 0);
  }
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    const main = document.querySelector("main");
    if (main && main.contains(alert)) {
      main.removeChild(alert);
    }
  });
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount > 0 ? cartCount : "";
    cartCountElement.style.display = cartCount > 0 ? "block" : "none";
  }
}

// Wishlist functionality
export function addToWishlist(product) {
  let wishlist = getLocalStorage("so-wishlist") || [];
  const existingItem = wishlist.find(item => item.Id === product.Id);
  
  if (!existingItem) {
    wishlist.push(product);
    setLocalStorage("so-wishlist", wishlist);
    alertMessage(`${product.Name} added to wishlist!`);
    updateWishlistCount();
    return true;
  } else {
    alertMessage(`${product.Name} is already in your wishlist!`);
    return false;
  }
}

export function removeFromWishlist(productId) {
  let wishlist = getLocalStorage("so-wishlist") || [];
  const itemToRemove = wishlist.find(item => item.Id === productId);
  wishlist = wishlist.filter(item => item.Id !== productId);
  setLocalStorage("so-wishlist", wishlist);
  
  if (itemToRemove) {
    alertMessage(`${itemToRemove.Name} removed from wishlist!`);
  }
  updateWishlistCount();
}

export function updateWishlistCount() {
  const wishlist = getLocalStorage("so-wishlist") || [];
  const wishlistCountElement = document.querySelector(".wishlist-count");
  if (wishlistCountElement) {
    wishlistCountElement.textContent = wishlist.length > 0 ? wishlist.length : "";
    wishlistCountElement.style.display = wishlist.length > 0 ? "block" : "none";
  }
}

// Recently viewed functionality
export function addToRecentlyViewed(product) {
  let recentlyViewed = getLocalStorage("so-recently-viewed") || [];
  
  // Remove if already exists
  recentlyViewed = recentlyViewed.filter(item => item.Id !== product.Id);
  
  // Add to beginning
  recentlyViewed.unshift(product);
  
  // Keep only last 4 items
  if (recentlyViewed.length > 4) {
    recentlyViewed = recentlyViewed.slice(0, 4);
  }
  
  setLocalStorage("so-recently-viewed", recentlyViewed);
}

export function getRecentlyViewed() {
  return getLocalStorage("so-recently-viewed") || [];
}
