import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices();
const productId = getParam("product");

const productToDisplay = new ProductDetails(productId, dataSource);
productToDisplay.init();
