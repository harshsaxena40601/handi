// Main script.js file

// DOM Elements
const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.getElementById("navbarSupportedContent");
const carouselItems = document.querySelectorAll(".carousel-item");
const prevButton = document.querySelector(".carousel-control-prev");
const nextButton = document.querySelector(".carousel-control-next");
const testimonialItems = document.querySelectorAll(
  "#testimonialCarousel .carousel-item"
);
const testimonialPrevBtn = document.querySelector(
  "#testimonialCarousel .carousel-control-prev"
);
const testimonialNextBtn = document.querySelector(
  "#testimonialCarousel .carousel-control-next"
);
const productGrid = document.querySelector(".product-grid");
const loadingIndicator = document.querySelector(".loading-indicator");
const yearElement = document.getElementById("displayYear");

// Display current year in footer
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Mobile menu toggle
if (navbarToggler) {
  navbarToggler.addEventListener("click", function () {
    navbarCollapse.classList.toggle("show");
  });
}

// Initialize carousels
let currentSlideIndex = 0;
let currentTestimonialIndex = 0;

// Hide all slides except first one
function initializeCarousel() {
  if (carouselItems.length > 0) {
    carouselItems.forEach((item, index) => {
      if (index !== currentSlideIndex) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  }

  if (testimonialItems.length > 0) {
    testimonialItems.forEach((item, index) => {
      if (index !== currentTestimonialIndex) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  }
}

// Hero carousel controls
function showSlide(index) {
  if (carouselItems.length === 0) return;

  // Remove active class from current slide
  carouselItems[currentSlideIndex].classList.remove("active");

  // Update index
  currentSlideIndex = index;

  // Handle looping
  if (currentSlideIndex >= carouselItems.length) {
    currentSlideIndex = 0;
  }
  if (currentSlideIndex < 0) {
    currentSlideIndex = carouselItems.length - 1;
  }

  // Add active class to new current slide
  carouselItems[currentSlideIndex].classList.add("active");
}

// Testimonial carousel controls
function showTestimonial(index) {
  if (testimonialItems.length === 0) return;

  // Remove active class from current testimonial
  testimonialItems[currentTestimonialIndex].classList.remove("active");

  // Update index
  currentTestimonialIndex = index;

  // Handle looping
  if (currentTestimonialIndex >= testimonialItems.length) {
    currentTestimonialIndex = 0;
  }
  if (currentTestimonialIndex < 0) {
    currentTestimonialIndex = testimonialItems.length - 1;
  }

  // Add active class to new current testimonial
  testimonialItems[currentTestimonialIndex].classList.add("active");
}

// Add event listeners for carousel buttons
if (prevButton) {
  prevButton.addEventListener("click", function (e) {
    e.preventDefault();
    showSlide(currentSlideIndex - 1);
  });
}

if (nextButton) {
  nextButton.addEventListener("click", function (e) {
    e.preventDefault();
    showSlide(currentSlideIndex + 1);
  });
}

if (testimonialPrevBtn) {
  testimonialPrevBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showTestimonial(currentTestimonialIndex - 1);
  });
}

if (testimonialNextBtn) {
  testimonialNextBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showTestimonial(currentTestimonialIndex + 1);
  });
}

// Variables to control product loading
let currentProductsShown = 0;
const productsPerLoad = 4;
let loadMoreBtn = null;

// Format price to INR format
function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

// Create product card element
function createProductCard(product) {
  const productCard = document.createElement("div");
  productCard.className = "product-item";

  productCard.innerHTML = `
    <div class="product-img">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">${formatPrice(product.price)}</p>
      <div class="product-buttons">
        <a href="/product-description/productdescription.html?product=${
          product.id
        }" class="view-btn">View Details</a>
        <button class="add-to-cart-btn" data-product-id="${
          product.id
        }">Add to Cart</button>
      </div>
    </div>
  `;

  return productCard;
}

// Load products function
function loadProducts() {
  if (productGrid) {
    // First, check if we need to create the "Load More" button
    if (!loadMoreBtn && currentProductsShown === 0) {
      // Remove loading indicator if it exists
      if (loadingIndicator) {
        productGrid.removeChild(loadingIndicator);
      }

      // Create button container
      const btnBox = document.createElement("div");
      btnBox.className = "btn-box text-center mt-4";
      btnBox.style.gridColumn = "1 / -1";

      // Create Load More button
      loadMoreBtn = document.createElement("button");
      loadMoreBtn.className = "load-more-btn";
      loadMoreBtn.textContent = "Load More Products";

      // Add event listener to load more
      loadMoreBtn.addEventListener("click", loadMoreProducts);

      // Add button to container
      btnBox.appendChild(loadMoreBtn);

      // Add the button container after the product grid
      productGrid.parentNode.insertBefore(btnBox, productGrid.nextSibling);
    }
  }
}

// Load more products function
function loadMoreProducts() {
  if (!productGrid) return;

  // In a real application, you would fetch products from an API here
  // For now, this function is kept but the sample products array has been removed
}

// Add to cart function
function addToCart(product) {
  // Get existing cart items from localStorage
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Check if product is already in cart
  const existingProductIndex = cartItems.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex !== -1) {
    // If product exists, increase quantity
    cartItems[existingProductIndex].quantity += 1;
  } else {
    // If product doesn't exist, add it with quantity 1
    cartItems.push({
      ...product,
      quantity: 1,
    });
  }

  // Save updated cart to localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Update cart badge
  updateCartBadge();

  // Show confirmation message
  showNotification("Product added to cart!");
}

// Update cart badge function
function updateCartBadge() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const badge = document.querySelector(".badge");

  if (badge) {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    badge.textContent = totalItems;
  }
}

// Show notification function
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  // Style the notification
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "#007bff";
  notification.style.color = "#fff";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "4px";
  notification.style.zIndex = "1000";
  notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  notification.style.transition = "opacity 0.3s ease-in-out";

  // Add notification to body
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize carousels
  initializeCarousel();

  // Update cart badge from localStorage on page load
  updateCartBadge();

  // Load initial products
  loadProducts();

  // Auto-rotate carousel every 5 seconds
  setInterval(() => {
    showSlide(currentSlideIndex + 1);
  }, 5000);

  // Auto-rotate testimonials every 8 seconds
  setInterval(() => {
    showTestimonial(currentTestimonialIndex + 1);
  }, 8000);
});
