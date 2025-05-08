// Cart functionality
let cart = [];
let isCartInitialized = false; // Flag to prevent multiple initializations

// Load cart from localStorage on page load
function loadCart() {
  // Check if cart has already been initialized to prevent duplicate loading
  if (isCartInitialized) return;

  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartCounter();
    }
    isCartInitialized = true;
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    // Reset cart if there's an error parsing the saved cart
    cart = [];
    localStorage.removeItem("cart");
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item to cart
function addItemToCart(id, name, price, quantity, imageUrl) {
  // Validate inputs before adding to cart
  if (!id || !name || isNaN(parseFloat(price)) || quantity <= 0) {
    console.error("Invalid product data:", { id, name, price, quantity });
    return;
  }

  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    // Update quantity if product already exists
    existingItem.quantity += quantity;
  } else {
    // Add new item to cart
    cart.push({
      id: id,
      name: name,
      price: parseFloat(price),
      quantity: quantity,
      imageUrl: imageUrl,
    });
  }

  // Save to localStorage and update UI
  saveCart();
  updateCartCounter();

  console.log("Cart updated:", cart); // For debugging
}

// Remove item from cart
function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartCounter();
}

// Update quantity of item in cart
function updateCartItemQuantity(id, quantity) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeItemFromCart(id);
    } else {
      saveCart();
      updateCartCounter();
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
  const counter = document.querySelector(".badge");
  if (counter) {
    const itemCount = getCartItemCount();
    counter.textContent = itemCount;

    // Optionally hide the badge when cart is empty
    if (itemCount === 0) {
      counter.style.display = "none";
    } else {
      counter.style.display = "flex";
    }
  }
}

// Clear the entire cart
function clearCart() {
  cart = [];
  saveCart();
  updateCartCounter();
}

// Initialize cart on page load - with safeguards to prevent multiple initializations
document.addEventListener("DOMContentLoaded", function () {
  if (!isCartInitialized) {
    loadCart();
  }
});
