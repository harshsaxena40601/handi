// Global cart variable
let cart = [];

// Load cart from localStorage
function loadCart() {
  console.log("Loading cart from local storage");
  try {
    const savedCart = localStorage.getItem("cart");
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartBadge();
    console.log("Cart loaded:", cart);
  } catch (error) {
    console.error("Error loading cart:", error);
    cart = [];
  }
}

// Save cart to localStorage
function saveCart() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart saved to localStorage:", cart);
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

// Add item to cart
function addItemToCart(id, name, price, quantity, imageUrl) {
  console.log("Adding to cart:", id, name, price, quantity);

  // Check if item already exists in cart
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    // Update existing item quantity
    existingItem.quantity += parseInt(quantity);
    console.log("Updated existing item quantity:", existingItem);
  } else {
    // Add new item to cart
    cart.push({
      id: id,
      name: name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl: imageUrl,
    });
    console.log("Added new item to cart:", cart[cart.length - 1]);
  }

  // Save cart to localStorage
  saveCart();

  // Update cart badge
  updateCartBadge();

  return true;
}

// Update cart badge with current number of items
function updateCartBadge() {
  const cartBadge = document.querySelector(".badge");
  if (cartBadge) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
    console.log("Cart badge updated:", totalItems);
  }
}

// Remove item from cart
function removeItemFromCart(id) {
  console.log("Removing item from cart:", id);
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartBadge();
}

// Update cart item quantity
function updateCartItemQuantity(id, quantity) {
  console.log("Updating quantity for item:", id, "to", quantity);
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = parseInt(quantity);
    saveCart();
    updateCartBadge();
  }
}

// Debug function to see cart contents
function debugCart() {
  console.log("Current cart contents:", cart);
  console.log("Cart JSON:", JSON.stringify(cart, null, 2));
  alert("Cart contents logged to console");
}

// Initialize cart on script load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Cart.js loaded");
  loadCart();
});

// Show confirmation message when item is added to cart
function showAddToCartConfirmation(productName) {
  console.log("Showing confirmation for adding:", productName);

  // Remove any existing confirmation
  const existingConfirmation = document.querySelector(
    ".add-to-cart-confirmation"
  );
  if (existingConfirmation) {
    existingConfirmation.remove();
  }

  // Create confirmation element
  const confirmation = document.createElement("div");
  confirmation.classList.add("add-to-cart-confirmation");
  confirmation.innerHTML = `<p>Added ${productName} to cart!</p>`;

  // Add to DOM
  document.body.appendChild(confirmation);

  // Remove after 2 seconds
  setTimeout(() => {
    confirmation.remove();
  }, 2000);

  // Add styles if they don't exist
  if (!document.querySelector(".cart-confirmation-style")) {
    const style = document.createElement("style");
    style.classList.add("cart-confirmation-style");
    style.textContent = `
      .add-to-cart-confirmation {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}
