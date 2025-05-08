// Make sure cart.js is loaded before this script
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart functionality only once
  loadCart();

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
  fetch("http://127.0.0.1:8000/api/products/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      populateProducts(data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      // Optionally show an error message to the user
      const productContainer = document.querySelector(".product-grid");
      if (productContainer) {
        productContainer.innerHTML = `<p class="error-message">Unable to load products. Please try again later.</p>`;
      }
    });
}

// Separated product population into its own function
function populateProducts(products) {
  const productContainer = document.querySelector(".product-grid");

  // Only proceed if product container exists
  if (!productContainer) return;

  // Clear existing content if any
  productContainer.innerHTML = "";

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
      <a href="/product-description/productdescription.html?product=${product.id}">
        <img src="${productImage}" alt="${product.name}" />
      </a>
    </div>
    <div class="product-info">
      <h3>
        <a href="/product-description/productdescription.html?product=${product.id}">
          ${product.name}
        </a>
      </h3>
      <p>${product.description}</p>
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
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    // Remove any existing event listeners first
    button.replaceWith(button.cloneNode(true));

    // Get the fresh button after replacement
    const freshButton = document.querySelector(
      `[data-id="${button.getAttribute("data-id")}"]`
    );

    if (freshButton) {
      freshButton.addEventListener("click", function (event) {
        // Prevent any default behavior or event bubbling
        event.preventDefault();
        event.stopPropagation();

        const productId = this.getAttribute("data-id");
        const productName = this.getAttribute("data-name");
        const price = this.getAttribute("data-price");
        const imageUrl = this.getAttribute("data-image");

        // Add item to cart (quantity 1 for quick add from product list)
        addItemToCart(productId, productName, price, 1, imageUrl);

        // Show confirmation
        showAddToCartConfirmation(productName);
      });
    }
  });
}

// Show confirmation message when item is added to cart
function showAddToCartConfirmation(productName) {
  // Remove any existing confirmation first
  const existingConfirmation = document.querySelector(
    ".add-to-cart-confirmation"
  );
  if (existingConfirmation) {
    existingConfirmation.remove();
  }

  // Create new confirmation
  const confirmationMessage = document.createElement("div");
  confirmationMessage.classList.add("add-to-cart-confirmation");
  confirmationMessage.innerHTML = `<p>Added ${productName} to cart!</p>`;
  document.body.appendChild(confirmationMessage);

  // Remove confirmation after 2 seconds
  setTimeout(() => {
    confirmationMessage.remove();
  }, 2000);
}
