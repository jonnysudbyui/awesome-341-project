import { renderListWithTemplate, setProperCase } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
    <img
    src="${product.Images.PrimaryMedium}"
    alt="Image of ${product.Name}"
    />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p></a>
    <button id="show-details" data-id="${product.Id}">Show Details </button>
    </li>`;
}

export default class ProductList {
  constructor(dataSource, category, listElement) {
    this.dataSource = dataSource;
    this.category = category;
    this.listElement = listElement;
  }
  async init() {
    const list = await this.dataSource.getData(this.category);
    document.querySelector("#products-crumb").innerHTML = `${setProperCase(
      this.category
    )} (${list.length} Items)`;

    let sortCriteria = "name-asc";
    const dropdown = document.querySelector("#sort-options");
    dropdown.addEventListener("change", (event) => {
      sortCriteria = event.target.value;
      sortList(sortCriteria, list);
      this.renderList(list);
    });
    this.renderList(list);
    document.querySelector(".title").innerHTML = setProperCase(this.category);

const AllDetailButtons = document.querySelectorAll("#show-details"); 
const modalWindow = document.querySelector(".modal-window");

AllDetailButtons.forEach(button =>{
  button.addEventListener("click", function() {
    
      const productToDisplay = list.find((myproduct) => myproduct.Id === button.dataset.id)
      const modalContent = document.querySelector(".modal-content");
      modalContent.innerHTML = ""

      const productName = document.createElement("h3");
      productName.innerHTML = productToDisplay.NameWithoutBrand;
      modalContent.appendChild(productName);

      modalContent.innerHTML =
         
      `<h3>${productToDisplay.Brand.Name}</h3>

      <h2 class="divider">${productToDisplay.Name}</h2>

      <img
        class="divider"
        src="${productToDisplay.Images.PrimaryLarge}"
        alt="${productToDisplay.NameWithoutBrand}"
      />
      
      <p class="product-card__price">$${productToDisplay.FinalPrice}
      <span class="product-card__discount">After a $${(
        productToDisplay.SuggestedRetailPrice - productToDisplay.FinalPrice
      ).toFixed(2)} discount! </span>
      </p>
      <p class="product__color">${productToDisplay.Colors[0].ColorName}</p>

      <p class="product__description">${productToDisplay.DescriptionHtmlSimple}</p>`

      const closeButton = document.createElement("button");
      closeButton.innerHTML = "Close";
      closeButton.classList.add("close-button")
      closeButton.addEventListener("click", () => {
        modalWindow.style.display = "none";
      });
      modalContent.appendChild(closeButton);

      //console.log(productToDisplay)
      modalWindow.style.display = "block";
    });
  });

  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}

//console.log(document.querySelector("#sort-options").value);
//document.querySelector("#sort-options").addEventListener("change",sortList(document.querySelector("#sort-options").value))

function sortList(sortCriteria, list) {
  switch (sortCriteria) {
    case "name-asc":
      list.sort((a, b) => (a.NameWithoutBrand > b.NameWithoutBrand ? 1 : -1));
      break;
    case "name-desc":
      list.sort((a, b) => (a.Name < b.Name ? 1 : -1));
      break;
    case "price-asc":
      list.sort((a, b) => a.ListPrice - b.ListPrice);
      break;
    case "price-desc":
      list.sort((a, b) => b.ListPrice - a.ListPrice);
      break;
  }
}
