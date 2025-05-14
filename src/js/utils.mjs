// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// helper to get URL parameter values
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// function to render a list of products
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlItems = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlItems.join(""));
}

// function to render a single item with template
export function renderWithTemplate(template, parentElement, data, position = "afterbegin") {
  parentElement.insertAdjacentHTML(position, template);
  if (data) {
    Object.keys(data).forEach(key => {
      const element = parentElement.querySelector(`[data-${key}]`);
      if (element) {
        element.textContent = data[key];
      }
    });
  }
}

async function loadHeaderFooter() {
  console.log('header')
}

export { loadHeaderFooter };