document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector(".cart-items");
  const badge = document.querySelector(".badge");
  const summaryItems = document.getElementById("summary-items");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryShipping = document.getElementById("summary-shipping");
  const summaryTotal = document.getElementById("summary-total");
  const emptyCartEl = document.querySelector(".cart-empty");
  const cartContent = document.querySelector(".cart-content");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartBadge() {
    badge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function updateSummary() {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;

    summaryItems.textContent = `Items (${cart.length})`;
    summarySubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    summaryShipping.textContent = `₹${shipping.toFixed(2)}`;
    summaryTotal.textContent = `₹${total.toFixed(2)}`;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    updateSummary();
  }

  // Function to get the correct image URL
  function getImageUrl(item) {
    // Check if the item has an imageUrl property (from script.js)
    if (item.imageUrl) {
      return item.imageUrl;
    }

    // Check if the item has an image property (alternative naming)
    if (item.image) {
      return item.image;
    }

    // Check if the item has images array (from API response)
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      const API_BASE_URL = "https://handicraft-5708.onrender.com";
      return `${API_BASE_URL}${item.images[0].image}`;
    }

    // Fallback to placeholder image
    return "/api/placeholder/300/300";
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      emptyCartEl.style.display = "flex";
      cartContent.style.display = "none";
      updateCartBadge();
      updateSummary();
      return;
    } else {
      emptyCartEl.style.display = "none";
      cartContent.style.display = "flex";
    }

    cart.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";

      // Get the correct image URL
      const imageUrl = getImageUrl(item);

      itemEl.innerHTML = `
        <div class="item-image">
          <img src="${imageUrl}" alt="${
        item.name
      }" onerror="this.src='/api/placeholder/300/300'" />
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-category">${item.category || "Handcraft"}</div>
          </div>
        </div>
        <div class="item-price">₹${item.price}</div>
        <div class="quantity-selector">
          <button class="quantity-btn decrement">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn increment">+</button>
        </div>
        <div class="item-total">₹${(item.price * item.quantity).toFixed(
          2
        )}</div>
        <div class="item-actions">
          <button class="remove-btn" title="Remove from cart">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;

      // Quantity Handlers
      itemEl.querySelector(".increment").addEventListener("click", () => {
        cart[index].quantity++;
        // Add pulse animation to quantity
        const quantityEl = itemEl.querySelector(".quantity");
        quantityEl.classList.add("pulse");
        setTimeout(() => quantityEl.classList.remove("pulse"), 600);

        saveCart();
        renderCart();
      });

      itemEl.querySelector(".decrement").addEventListener("click", () => {
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          // Add pulse animation to quantity
          const quantityEl = itemEl.querySelector(".quantity");
          quantityEl.classList.add("pulse");
          setTimeout(() => quantityEl.classList.remove("pulse"), 600);
        } else {
          // If quantity is 1, remove the item
          itemEl.classList.add("fade-out");
          setTimeout(() => {
            cart.splice(index, 1);
            saveCart();
            renderCart();
          }, 300);
          return;
        }
        saveCart();
        renderCart();
      });

      // Remove button handler
      const removeBtn = itemEl.querySelector(".remove-btn");
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          // Add fade out animation
          itemEl.classList.add("fade-out");
          setTimeout(() => {
            cart.splice(index, 1);
            saveCart();
            renderCart();
          }, 300);
        });
      }

      cartItemsContainer.appendChild(itemEl);
    });

    saveCart();
  }

  // Checkout button functionality
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Show loading state
      checkoutBtn.textContent = "Processing...";
      checkoutBtn.disabled = true;

      // Simulate checkout process (replace with actual checkout logic)
      setTimeout(() => {
        alert("Checkout functionality would be implemented here!");
        checkoutBtn.textContent = "Proceed to Checkout";
        checkoutBtn.disabled = false;
      }, 2000);
    });
  }

  // Mobile menu functionality
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  // Search functionality
  const searchForm = document.querySelector(".search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchInput = searchForm.querySelector("input[type='search']");
      if (searchInput && searchInput.value.trim()) {
        alert(`Search functionality for: ${searchInput.value}`);
        // Implement actual search logic here
      }
    });
  }

  // Initialize cart on page load
  renderCart();

  // Debug function to check cart data structure
  window.debugCartData = function () {
    console.log("Current cart data:", cart);
    cart.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        image: item.image,
        images: item.images,
      });
    });
  };

  // Make updateCartDisplay function available globally for cart.js sync
  window.updateCartDisplay = function () {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    renderCart();
  };
});
