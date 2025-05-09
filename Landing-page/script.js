// script.js - Fixed version with better error handling
document.addEventListener("DOMContentLoaded", function () {
  console.log("Main script loaded");

  // Make sure the cart is initialized
  if (typeof loadCart === "function") {
    loadCart();
  } else {
    console.error(
      "loadCart function not found! Make sure cart.js is loaded before script.js"
    );
  }

  // Load products from backend
  fetchProducts();

  // Initialize mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      document.querySelector(".mobile-menu").classList.toggle("active");
    });
  }
});

// Separated product fetching into its own function
function fetchProducts() {
  console.log("Fetching products from backend");

  // Show loading indicator
  const productContainer = document.querySelector(".product-grid");
  if (productContainer) {
    productContainer.innerHTML = `
      <div class="loading-indicator">
        <p>Loading products...</p>
      </div>
    `;
  }

  // Add some basic styles for loading indicator
  const style = document.createElement("style");
  style.textContent = `
    .loading-indicator {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    .error-message {
      color: #d32f2f;
      text-align: center;
      padding: 20px;
      background-color: #fdecea;
      border-radius: 4px;
      margin: 20px 0;
    }
  `;
  document.head.appendChild(style);

  fetch("http://127.0.0.1:8000/api/products/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Products fetched successfully:", data);
      populateProducts(data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);

      // Show error message to the user
      if (productContainer) {
        productContainer.innerHTML = `
          <div class="error-message">
            <p><strong>Unable to load products.</strong></p>
            <p>Please check that the backend server is running at http://127.0.0.1:8000</p>
            <p>Error details: ${error.message}</p>
            <button onclick="fetchProducts()" class="retry-btn">Retry</button>
          </div>
        `;
      }

      // Add some test products if in development mode
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.log("Loading test products for development");
        const testProducts = [
          {
            id: "test1",
            name: "Handwoven Bamboo Basket",
            description:
              "A beautiful hand-crafted basket made from sustainable bamboo.",
            price: 899,
            images: [],
          },
          {
            id: "test2",
            name: "Ceramic Flower Vase",
            description: "Elegant ceramic vase with hand-painted details.",
            price: 1299,
            images: [],
          },
          {
            id: "test3",
            name: "Embroidered Cushion Cover",
            description: "Intricate embroidery on premium cotton fabric.",
            price: 599,
            images: [],
          },
        ];
        populateProducts(testProducts);
      }
    });
}

// Separated product population into its own function
function populateProducts(products) {
  const productContainer = document.querySelector(".product-grid");

  // Only proceed if product container exists
  if (!productContainer) {
    console.error("Product container not found!");
    return;
  }

  console.log("Populating products:", products.length);

  // Clear existing content if any
  productContainer.innerHTML = "";

  // Check if we have products
  if (!products || products.length === 0) {
    productContainer.innerHTML = `
      <div class="no-products">
        <p>No products found.</p>
      </div>
    `;
    return;
  }

  // Create product cards
  products.forEach((product) => {
    const productCard = createProductCard(product);
    productContainer.appendChild(productCard);
  });

  // Add event listeners after all products are added to DOM
  addCartEventListeners();
}

// Create a product card element
function createProductCard(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");

  // Ensure that the image URL is complete (prefix the domain if necessary)
  const productImage =
    product.images && product.images.length > 0
      ? `http://127.0.0.1:8000${product.images[0].image}`
      : "/api/placeholder/400/300"; // fallback to placeholder if no image

  productCard.innerHTML = `
    <div class="product-img">
      <a href="/product-description/productdescription.html?product=${
        product.id
      }">
        <img src="${productImage}" alt="${product.name}" />
      </a>
    </div>
    <div class="product-info">
      <h3>
        <a href="/product-description/productdescription.html?product=${
          product.id
        }">
          ${product.name}
        </a>
      </h3>
      <p>${product.description || "Beautiful handcrafted item"}</p>
      <span class="product-price">₹${product.price}</span>
      <button class="add-to-cart" data-id="${product.id}" 
              data-name="${product.name}" 
              data-price="${product.price}" 
              data-image="${productImage}">Add to Cart</button>
    </div>
  `;

  return productCard;
}

// Add event listeners to all "Add to Cart" buttons
function addCartEventListeners() {
  console.log("Adding cart event listeners");

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    // Remove any existing event listeners first
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    // Add event listener to the fresh button
    newButton.addEventListener("click", function (event) {
      // Prevent any default behavior or event bubbling
      event.preventDefault();
      event.stopPropagation();

      const productId = this.getAttribute("data-id");
      const productName = this.getAttribute("data-name");
      const price = this.getAttribute("data-price");
      const imageUrl = this.getAttribute("data-image");

      console.log("Add to cart clicked for:", productName);

      // Check if addItemToCart function exists
      if (typeof addItemToCart !== "function") {
        console.error(
          "addItemToCart function not found! Make sure cart.js is loaded properly."
        );
        alert(
          "Unable to add item to cart. Please refresh the page and try again."
        );
        return;
      }

      // Add item to cart (quantity 1 for quick add from product list)
      addItemToCart(productId, productName, price, 1, imageUrl);

      // Show confirmation
      if (typeof showAddToCartConfirmation === "function") {
        showAddToCartConfirmation(productName);
      } else {
        console.log(
          "showAddToCartConfirmation function not found, using alert instead"
        );
        alert(`${productName} added to cart!`);
      }
    });
  });
}
