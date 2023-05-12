import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

const dataSource = new ExternalServices();

const listElement = document.querySelector(".product-list");

const productList = new ProductList(dataSource, category, listElement);

productList.init();
