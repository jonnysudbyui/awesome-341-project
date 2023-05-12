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

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param)
  return product
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
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function getSuperscript(elementId) {
  let superscript = getLocalStorage("so-ss");
  document.query
  if (document.querySelector(".ss-icon")) {
    document.querySelector(".ss-icon").innerHTML = superscript;
  } else {
    const element = document.getElementById(elementId);
    
    const superscriptElement = document.createElement("div");
    const newA = document.createElement("a");
    superscriptElement.setAttribute("class", "ss-icon");
    newA.setAttribute("href", "/cart/index.html");   
    superscriptElement.innerHTML = superscript;
    element.appendChild(newA);
    newA.appendChild(superscriptElement);
    
  }    
}

export async function loadHeaderFooter() {
  let header = document.querySelector("header");
  const headerTemplate = await loadTemplate("../partials/header.html"); 
  renderWithTemplate(headerTemplate,header)
  
  const footerTemplate = await loadTemplate("../partials/footer.html");
  let footer = document.querySelector("footer");
  renderWithTemplate(footerTemplate,footer)

  setTimeout(function () {
    getSuperscript("cart-icon");
  }, 500);

  
}



export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  if(callback) {
      callback(data);
  }
}

async function loadTemplate(path) {
  let content = await fetch(path)
  let text = await content.text();
  return text
}

export function setProperCase(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function alertMessage(message, scroll = true) {
  // create element to hold our alert
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert");
  // set the contents. You should have a message and an X or something the user can click on to remove
  alert.innerHTML = `<p>${message} <span>  X</span></p>`;
  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child
  alert.addEventListener("click", function(e) {
      if(e.target.tagName == "SPAN") { // how can we tell if they clicked on our X or on something else?  hint: check out e.target.tagName or e.target.innerText
        main.removeChild(this);
      }
  })
  // add the alert to the top of main
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if(scroll)
    window.scrollTo(0,0);

}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}