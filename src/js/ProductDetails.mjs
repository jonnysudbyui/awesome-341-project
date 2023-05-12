import { alertMessage, setLocalStorage, getLocalStorage, getSuperscript } from "./utils.mjs";

function productTemplate(product) {
  //console.log(product.Images.PrimaryLarge)
  
  return `<section class="product-detail">
        <h3>${product.Brand.Name}</h3>

        <h2 class="divider">${product.Name}</h2>

        ${productImages(product)}
        
        <p class="product-card__price">$${product.FinalPrice}
        <span class="product-card__discount">After a $${(
          product.SuggestedRetailPrice - product.FinalPrice
        ).toFixed(2)} discount! </span>
        </p>
        <p class="product__color">Color Options</p>

        ${createColorSwatch(product)}

        <p class="product__description">${product.DescriptionHtmlSimple}</p>

        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>
      </section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use our datasource to get the details for the current product.
    //findProductById will return a promise! use await or .then() to process it

    this.product = await this.dataSource.findProductById(this.productId);
    //console.log("🚀 ~ file: ProductDetails.mjs:8 ~ ProductDetails ~ constructor ~ this.product",this.product);

    // once we have the product details we can render out the HTML
    // once the HTML is rendered we can add a listener to Add to Cart button
    //const carouselImages = productImages(this.product);
    //console.log("🚀 ~ file: ProductDetails.mjs:47 ~ ProductDetails ~ init ~ carouselImages:", carouselImages)
    this.renderProductDetails("main");

    // Notice the .bind(this). Our callback will not work if we don't include that line.
    // Review the readings from this week on 'this' to understand why.

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
    document.querySelector("#product-crumb").innerHTML = this.product.NameWithoutBrand



  }

  addToCart() {
    let cart = getLocalStorage("so-cart");
    let IconTotal = getLocalStorage("so-ss");
    IconTotal += 1;
    setLocalStorage("so-ss", IconTotal);
    //Add Product if cart is empty
    if (cart === null) {
      cart = this.product;
      cart.Qty = 1; // I set the qty to one for later steps
      cart = [cart];
    } else if (!Array.isArray(cart)) {
      // If cart has only one item
      if (this.product.Id === cart.Id) {
        // See if this.id is the same as what is in the cart
        cart.Qty += 1;
      } else {
        this.product.Qty = 1;
        cart = [this.product].concat(cart);
      } // I set the qty to one for later steps   // if not add line to the cart
    } else if (cart.map((item) => item.Id).includes(this.product.Id)) {
      // is id in array?
      cart[cart.findIndex((item) => item.Id === this.product.Id)].Qty += 1;
    } else {
      this.product.Qty = 1;
      cart = [this.product].concat(cart);
    }

    //add cart adjustments to local storage
    setLocalStorage("so-cart", cart);

    // Spin Cart backpact so user knows something happened.
    let cartIcon = document.querySelector(".cardIcon");
    cartIcon.classList.add("animateIcon");
    setTimeout(function () {
      cartIcon.classList.remove("animateIcon");
    }, 1000);

    // drop the button for fun!!!

    addToCartButton();
    alertMessage("Product Added to Cart")
    }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML("afterBegin", productTemplate(this.product));
  }
}


// Drop button function

function addToCartButton() {
  const dropCartButton = document.querySelector("#addToCart");
  dropCartButton.classList.add("addedToCart");
  dropCartButton.innerHTML = "Adding to Cart";
  dropCartButton.addEventListener("animationend", removeClass);
  function removeClass() {
    dropCartButton.classList.remove("addedToCart");
    dropCartButton.innerHTML = "Add to Cart";
    getSuperscript("cart-icon");
  }
}


    //Create carousel

    function productImages(product) {
      //console.log("🚀 ~ file: ProductDetails.mjs:111 ~ productImages ~ product:", product.Images)
      
      const imageContainer = document.createElement("div")
      const imageCollection = document.createElement("div");
      imageCollection.classList.add("slideshow-container");
    
      if (product.Images.ExtraImages) { 
        const primarySlide = document.createElement("div")
        primarySlide.classList.add("imageSlide", "fade")
        
        const pnumText = document.createElement("div")
          pnumText.classList.add("numbertext");
          pnumText.innerHTML = `1/${product.Images.ExtraImages.length + 1}`
          primarySlide.appendChild(pnumText)
    
        const primaryImage = document.createElement("img");
        primaryImage.src = product.Images.PrimaryLarge
        primaryImage.style = "width:100%"
        primarySlide.appendChild(primaryImage)
        
        const primaryTitle = document.createElement("div")
        primaryTitle.classList.add("text");
        primaryTitle.innerHTML = `${product.NameWithoutBrand} (Main Image)`
        primarySlide.appendChild(primaryTitle)
        
        imageCollection.appendChild(primarySlide)
        
        product.Images.ExtraImages.forEach((image, index) => {
          const secondarySlide = document.createElement("div")
          secondarySlide.classList.add("imageSlide", "fade")
    
          const sNumText = document.createElement("div")
          sNumText.classList.add("numbertext");
          sNumText.innerHTML = `${(index + 2)}/${product.Images.ExtraImages.length + 1}`
          secondarySlide.appendChild(sNumText)
          
          const secondaryImage = document.createElement("img");
          secondaryImage.src = image.Src
          secondaryImage.style = "width:100%"
          secondarySlide.appendChild(secondaryImage)
    
          const secondaryTitle = document.createElement("div")
          secondaryTitle.classList.add("text");
          secondaryTitle.innerHTML = `${product.NameWithoutBrand} (${image.Title})`
          secondarySlide.appendChild(secondaryTitle)
    
          imageCollection.appendChild(secondarySlide)
        });
    
        const prev = document.createElement("a")
          prev.classList.add("prev");
          prev.innerHTML = "&#10094;";
        
          const next = document.createElement("a")
          next.classList.add("next");
          
          next.innerHTML = "&#10095;";
    
          imageCollection.appendChild(prev)
          imageCollection.appendChild(next)
    
          imageContainer.appendChild(imageCollection);
    
         const newBreak = document.createElement("br")
         imageContainer.appendChild(newBreak);
         
         const dotDiv = document.createElement("div");
         dotDiv.classList.add("dot-container")
         
         const primarydotSpan = document.createElement("span")
          primarydotSpan.classList.add("dot");
          primarydotSpan.setAttribute("index", 0)
          dotDiv.appendChild(primarydotSpan);
         
         product.Images.ExtraImages.forEach((image, index) => {
          const dotSpan = document.createElement("span")
          dotSpan.classList.add("dot");
          //dotSpan.onclick = currentSlide(index)
          dotSpan.setAttribute("index",index + 1)
          dotDiv.appendChild(dotSpan);
         });
        
      imageContainer.appendChild(dotDiv)
    
    
    
      } else {
        const primaryImage = document.createElement("img");
        primaryImage.src = product.Images.PrimaryLarge
        primaryImage.style = "width:100%"
        imageContainer.appendChild(primaryImage)
      }
    
      return imageContainer.innerHTML
    }  // End carosel formatting function
     

    
    const slideshow = {
      slideIndex: 0,
      slides: null,
      dots: null,
      
      init: function() {
        this.slides = document.querySelectorAll(".imageSlide");
        this.dots = document.querySelectorAll(".dot");
        this.showSlides(this.slideIndex);
        document.querySelector(".prev").addEventListener("click", () => {this.plusSlides(-1)});
        document.querySelector(".next").addEventListener("click", () => {this.plusSlides(1)});

        const dots = document.querySelectorAll(".dot");

        dots.forEach(dot => {
          dot.addEventListener("click", () => {this.currentSlide(dot.getAttribute("index"))})
        });
      },
      
      plusSlides: function(n) {
        this.showSlides(this.slideIndex += n);
      },
      
      currentSlide: function(n) {
        console.log(n)
        this.showSlides(this.slideIndex = n);
      },
      
      showSlides: function(n) {
        if (!this.slides || !this.dots) {
          console.error("Slides or dots not found");
          return;
        }
        
        let i;
        if (n > this.slides.length) {
          this.slideIndex = 1;
        }
        if (n < 1) {
          this.slideIndex = this.slides.length;
        }
        for (i = 0; i < this.slides.length; i++) {
          this.slides[i].style.display = "none";
        }
        
        for (i = 0; i < this.dots.length; i++) {
          this.dots[i].className = this.dots[i].className.replace(" active", "");
        }
        
        this.slides[this.slideIndex - 1].style.display = "block";
        this.dots[this.slideIndex - 1].className += " active";
      }
    };


    // add color swatch

   function createColorSwatch(product){
    //if (product.Colors.length > 1) {
      
      const colorSwatchContainor = document.createElement("div")
      console.log(product)
      
      product.Colors.forEach(color => {
        const swatch = document.createElement("img");
        swatch.classList.add("color-swatch")
        swatch.src =  color.ColorChipImageSrc
        colorSwatchContainor.appendChild(swatch);
      });



      return colorSwatchContainor.innerHTML

   }

   function addColorSwatchButtons(){
    const selectedSwatch = document.querySelector(".color-swatch")
    selectedSwatch.classList.add("active")
    const swatches = document.querySelectorAll(".color-swatch")

    swatches.forEach(swatch => {
      swatch.addEventListener("click", () => {
       
         swatches.forEach(item => {
          if (item.classList.contains("active")) {
            item.classList.toggle("active")
          }
         });
         swatch.classList.toggle("active")
      })
    });
   }
    
    // Call the init function when the page finishes loading
    window.addEventListener("load", function() {
      setTimeout(function () {
        if (document.querySelector(".dot-container")) { 
          slideshow.init();
        }
        addColorSwatchButtons()

      }, 1000);
    });
