// Enhanced cart.js with improved functionality
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded - initializing cart");

  // Initialize cart
  loadCart();

  // Check if we're on the cart page
  if (
    window.location.pathname.includes("productcart.html") ||
    window.location.pathname.endsWith("/productcart.html")
  ) {
    console.log("On cart page - rendering cart items");
    renderCartItems();
    updateCartSummary();
    checkIfCartEmpty();

    // Event listeners for the cart page
    setupEventListeners();
  }

  // Make sure cart counter is updated on all pages
  updateCartCounter();

  // If no items in cart, add some test products (for testing only)
  if (
    cart.length === 0 &&
    window.location.pathname.includes("productcart.html")
  ) {
    addTestProducts();
  }
});

// Cart functionality
let cart = [];
let isCartInitialized = false; // Flag to prevent multiple initializations

// Load cart from localStorage on page load with improved error handling
function loadCart() {
  // Check if cart has already been initialized to prevent duplicate loading
  if (isCartInitialized) return;

  try {
    const savedCart = localStorage.getItem("cart");
    console.log("Loading cart from localStorage:", savedCart);

    if (savedCart) {
      cart = JSON.parse(savedCart);
      console.log("Parsed cart:", cart);
    } else {
      console.log("No cart found in localStorage, initializing empty cart");
      cart = [];
    }
    isCartInitialized = true;
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    // Reset cart if there's an error parsing the saved cart
    cart = [];
    localStorage.removeItem("cart");
  }

  // Debug: Log cart state after loading
  console.log("Cart after loadCart():", cart);
}

// Save cart to localStorage with validation
function saveCart() {
  try {
    // Ensure cart is valid before saving
    if (!Array.isArray(cart)) {
      console.error("Invalid cart format, resetting cart");
      cart = [];
    }

    // Remove any invalid items before saving
    cart = cart.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.id &&
        item.name &&
        !isNaN(parseFloat(item.price)) &&
        !isNaN(parseInt(item.quantity))
    );

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart saved to localStorage:", cart);
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

// Add item to cart with improved validation
function addItemToCart(id, name, price, quantity = 1, imageUrl) {
  console.log("Adding to cart:", { id, name, price, quantity, imageUrl });

  // Validate inputs before adding to cart
  if (!id || !name || isNaN(parseFloat(price)) || quantity <= 0) {
    console.error("Invalid product data:", { id, name, price, quantity });
    return;
  }

  // Load cart again to ensure we have latest data
  loadCart();

  // Ensure price is a number
  const numericPrice = parseFloat(price);

  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    // Update quantity if product already exists
    existingItem.quantity += quantity;
    console.log("Updated existing item quantity:", existingItem);
  } else {
    // Add new item to cart
    cart.push({
      id: id,
      name: name,
      price: numericPrice,
      quantity: quantity,
      imageUrl: imageUrl || getDefaultImageUrl(id), // Use a function to get default image
    });
    console.log("Added new item to cart");
  }

  // Save to localStorage and update UI
  saveCart();
  updateCartCounter();

  // If on cart page, refresh display
  if (window.location.pathname.includes("productcart.html")) {
    renderCartItems();
    updateCartSummary();
    checkIfCartEmpty();
  }

  // Show notification that item was added
  showCartNotification(name);
}

// Helper function to generate default image URLs based on product ID
function getDefaultImageUrl(productId) {
  // This maps product IDs to their appropriate image paths
  const imageMap = {
    hand001: "Media/products/wooden-lamp.jpg",
    hand002: "Media/products/table-runner.jpg",
    hand003: "Media/products/ceramic-vase.jpg",
    // Add more mappings as needed
  };

  // Return the mapped image or a generic default
  return imageMap[productId] || "Media/products/default-product.jpg";
}

// Remove item from cart
function removeItemFromCart(id) {
  console.log("Removing item from cart:", id);

  const itemElement = document.querySelector(`.cart-item[data-id="${id}"]`);
  if (itemElement) {
    // Add fade-out animation before removing
    itemElement.classList.add("fade-out");

    // Wait for animation to complete before updating the DOM
    setTimeout(() => {
      cart = cart.filter((item) => item.id !== id);
      saveCart();
      updateCartCounter();
      renderCartItems(); // Re-render cart after removing item
      updateCartSummary();
      checkIfCartEmpty();
    }, 500);
  } else {
    // If no element found in DOM, just update the data
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    updateCartCounter();
    updateCartSummary();
    checkIfCartEmpty();
  }
}

// Update quantity of item in cart
function updateCartItemQuantity(id, quantity) {
  console.log("Updating quantity for item:", id, "to", quantity);

  // Make sure quantity is a number
  quantity = parseInt(quantity);

  if (isNaN(quantity) || quantity < 1) {
    console.error("Invalid quantity:", quantity);
    return;
  }

  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = quantity;
    saveCart();
    updateCartCounter();
    updateCartSummary();

    // Update the displayed item total
    const itemElement = document.querySelector(`.cart-item[data-id="${id}"]`);
    if (itemElement) {
      const itemTotal = item.price * item.quantity;
      const totalEl = itemElement.querySelector(".item-total");
      if (totalEl) {
        totalEl.textContent = `₹${itemTotal.toFixed(2)}`;
      }

      // Also update the quantity display
      const quantityDisplay = itemElement.querySelector(".quantity");
      if (quantityDisplay) {
        quantityDisplay.textContent = quantity;
      }
    }
  }
}

// Get cart total (number of items)
function getCartItemCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get cart total price
function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Update the cart counter in the UI
function updateCartCounter() {
  const counters = document.querySelectorAll(".badge");
  if (counters.length > 0) {
    const itemCount = getCartItemCount();
    console.log("Updating cart counter to:", itemCount);

    counters.forEach((counter) => {
      counter.textContent = itemCount;

      // Show/hide the badge based on cart content
      if (itemCount === 0) {
        counter.style.display = "none";
      } else {
        counter.style.display = "flex";
      }
    });
  }
}

// Show notification when an item is added to cart
function showCartNotification(productName) {
  console.log("Showing cart notification for:", productName);

  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");
    document.body.appendChild(toastContainer);
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.classList.add("toast", "success");
  notification.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <div class="toast-content">
      <span class="toast-title">Added to Cart</span>
      <span class="toast-message">${productName} was added to your cart</span>
    </div>
  `;

  // Add to toast container
  toastContainer.appendChild(notification);

  // Show the toast
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Function to create cart item elements with improved error handling
function createCartItemElement(item) {
  if (!item || !item.id || !item.name) {
    console.error("Invalid item data:", item);
    return document.createElement("div"); // Return empty div to prevent errors
  }

  const itemDiv = document.createElement("div");
  itemDiv.classList.add("cart-item");
  itemDiv.setAttribute("data-id", item.id);

  // Ensure price and quantity are valid numbers
  const price = parseFloat(item.price) || 0;
  const quantity = parseInt(item.quantity) || 1;
  const itemTotal = (price * quantity).toFixed(2);

  // Default image URL if none is provided or fix placeholder URL
  const imageUrl =
    item.imageUrl && !item.imageUrl.includes("/api/placeholder")
      ? item.imageUrl
      : getDefaultImageUrl(item.id);

  itemDiv.innerHTML = `
    <div class="item-image">
      <img src="${imageUrl}" alt="${item.name}">
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-category">Handcrafted Item</div>
      </div>
    </div>
    <div class="item-price">₹${price.toFixed(2)}</div>
    <div class="quantity-selector">
      <button class="quantity-btn decrease" data-id="${item.id}">-</button>
      <span class="quantity">${quantity}</span>
      <button class="quantity-btn increase" data-id="${item.id}">+</button>
    </div>
    <div class="item-total">₹${itemTotal}</div>
    <div class="item-actions">
      <button class="remove-btn" data-id="${item.id}" title="Remove item">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;

  return itemDiv;
}

// Setup event listeners for the cart page
function setupEventListeners() {
  // Checkout button
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }

  // Continue shopping button
  const continueShoppingBtn = document.querySelector(".continue-shopping");
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cart.html";
    });
  }

  // Mobile menu button
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }
}

// Add event listeners to cart items
function addCartItemListeners() {
  // Quantity decrease buttons
  const decreaseBtns = document.querySelectorAll(".quantity-btn.decrease");
  decreaseBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const item = cart.find((item) => item.id === id);
      if (item && item.quantity > 1) {
        updateCartItemQuantity(id, item.quantity - 1);
      }
    });
  });

  // Quantity increase buttons
  const increaseBtns = document.querySelectorAll(".quantity-btn.increase");
  increaseBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const item = cart.find((item) => item.id === id);
      if (item) {
        updateCartItemQuantity(id, item.quantity + 1);
      }
    });
  });

  // Remove buttons
  const removeBtns = document.querySelectorAll(".remove-btn");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      removeItemFromCart(id);

      // Add pulse animation to cart icon
      const cartIcon = document.querySelector(".cart-icon");
      if (cartIcon) {
        cartIcon.classList.add("pulse");
        setTimeout(() => {
          cartIcon.classList.remove("pulse");
        }, 500);
      }
    });
  });
}

// Show toast notifications
function showToast(message, type = "info") {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.classList.add("toast", type);

  // Set icon based on type
  let icon = "fa-info-circle";
  if (type === "success") icon = "fa-circle-check";
  if (type === "error") icon = "fa-circle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <div class="toast-content">
      <span class="toast-message">${message}</span>
    </div>
  `;

  // Add to container
  toastContainer.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty", "error");
    return;
  }

  // Here you would normally redirect to the checkout page
  showToast("Proceeding to checkout...", "success");

  // Simulate loading state
  const loadingOverlay = document.createElement("div");
  loadingOverlay.classList.add("loading-overlay");
  loadingOverlay.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(loadingOverlay);

  setTimeout(() => {
    loadingOverlay.classList.add("active");
  }, 10);

  // Simulate redirect after 2 seconds
  setTimeout(() => {
    loadingOverlay.classList.remove("active");
    setTimeout(() => {
      loadingOverlay.remove();
      // In a real application, redirect to checkout page
      showToast("This is a demo - no actual checkout", "info");
    }, 300);
  }, 2000);
}

// Improved function to render cart items
function renderCartItems() {
  const cartItemsContainer = document.querySelector(".cart-items");
  if (!cartItemsContainer) {
    console.warn("Cart items container not found");
    return;
  }

  console.log("Rendering cart items:", cart);

  // Clear current items
  cartItemsContainer.innerHTML = "";

  // If cart is empty, show empty state
  if (!cart || cart.length === 0) {
    console.log("Cart is empty, showing empty state");
    checkIfCartEmpty();
    return;
  }

  // Add each item to the cart display
  cart.forEach((item) => {
    const cartItemElement = createCartItemElement(item);
    cartItemsContainer.appendChild(cartItemElement);
  });

  // Add event listeners to all quantity inputs and remove buttons
  addCartItemListeners();
}

// Improved function to check if cart is empty
function checkIfCartEmpty() {
  const cartContent = document.querySelector(".cart-content");
  const emptyCart = document.querySelector(".cart-empty");

  if (!cartContent || !emptyCart) {
    console.warn("Cart containers not found");
    return;
  }

  console.log("Checking if cart is empty. Cart length:", cart.length);

  if (!cart || cart.length === 0) {
    cartContent.style.display = "none";
    emptyCart.style.display = "flex";
  } else {
    cartContent.style.display = "flex";
    emptyCart.style.display = "none";
  }
}

// Improved function to update cart summary
function updateCartSummary() {
  // Get elements
  const itemsCountEl = document.getElementById("summary-items");
  const subtotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const taxEl = document.getElementById("summary-tax");
  const totalEl = document.getElementById("summary-total");

  if (!itemsCountEl || !subtotalEl || !shippingEl || !taxEl || !totalEl) {
    console.warn("Summary elements not found");
    return;
  }

  // Calculate values
  const itemCount = getCartItemCount();
  const cartTotal = getCartTotal();

  console.log("Updating cart summary - Items:", itemCount, "Total:", cartTotal);

  // Set shipping cost based on cart total
  let shippingCost = 0;
  if (cartTotal > 0 && cartTotal < 1000) {
    shippingCost = 100;
  }

  // Calculate tax (GST - 18%)
  const taxRate = 0.18;
  const taxAmount = cartTotal * taxRate;

  // Update summary values
  itemsCountEl.textContent = `Items (${itemCount})`;
  subtotalEl.textContent = `₹${cartTotal.toFixed(2)}`;
  shippingEl.textContent = `₹${shippingCost.toFixed(2)}`;
  taxEl.textContent = `₹${taxAmount.toFixed(2)}`;

  // Update total
  const finalTotal = cartTotal + shippingCost + taxAmount;
  totalEl.textContent = `₹${finalTotal.toFixed(2)}`;
}

// Function to manually add test products to cart (for demonstration)
function addTestProducts() {
  console.log("Adding test products to cart");
  addItemToCart(
    "hand001",
    "Handcrafted Wooden Lamp",
    1299,
    1,
    "Media/products/wooden-lamp.jpg"
  );
  addItemToCart(
    "hand002",
    "Embroidered Table Runner",
    899,
    2,
    "Media/products/table-runner.jpg"
  );
  addItemToCart(
    "hand003",
    "Ceramic Flower Vase",
    749,
    1,
    "Media/products/ceramic-vase.jpg"
  );
}

// Scroll behavior for the navbar
window.addEventListener("scroll", function () {
  const navbar = document.querySelector("nav");
  const scrollPosition = window.scrollY;

  if (scrollPosition > 100) {
    navbar.classList.add("hidden");
  } else {
    navbar.classList.remove("hidden");
  }
});

// Execute initial load
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  // Document already loaded
  loadCart();
  updateCartCounter();
} else {
  // Wait for document to load
  document.addEventListener("DOMContentLoaded", function () {
    loadCart();
    updateCartCounter();
  });
}
