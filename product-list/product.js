// API base URL constant
const API_BASE_URL = "https://handicraft-5708.onrender.com";

// Global variables
let sampleProducts = []; // Will be populated from backend
let currentProducts = [];
let currentPage = 1;
const productsPerPage = 6;

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  console.log("Product page loaded");

  // Show loading state
  showLoadingState();

  // Fetch products from backend
  fetchProducts();

  setupEventListeners();
  updateCartBadge();
});

function showLoadingState() {
  const grid = document.getElementById("products-grid");
  if (grid) {
    grid.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    `;
  }
}

function fetchProducts() {
  console.log("Fetching products from backend");

  fetch(`${API_BASE_URL}/api/products/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Products fetched successfully:", data);
      // Transform backend data to match our expected format
      sampleProducts = transformBackendProducts(data);
      currentProducts = [...sampleProducts];
      renderProducts();
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      showErrorState(error);
    });
}

function transformBackendProducts(backendProducts) {
  return backendProducts.map((product) => {
    // Get the first image or use placeholder
    const productImage =
      product.images && product.images.length > 0
        ? `${API_BASE_URL}${product.images[0].image}`
        : "/api/placeholder/280/220";

    return {
      id: product.id,
      name: product.name,
      description: product.description || "Beautiful handcrafted item",
      price: `₹${product.price}`,
      priceNum: parseFloat(product.price),
      image: productImage,
      category: product.category ? product.category.toLowerCase() : "general",
      featured: product.featured || false,
      badge: product.badge || (product.featured ? "Featured" : null),
    };
  });
}

function showErrorState(error) {
  const grid = document.getElementById("products-grid");
  if (grid) {
    grid.innerHTML = `
      <div class="error-state">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <h3>Unable to load products</h3>
        <p>Please check that the backend server is running.</p>
        <p>Error: ${error.message}</p>
        <button class="retry-btn" onclick="fetchProducts()">
          <i class="fa-solid fa-refresh"></i>
          Retry
        </button>
      </div>
    `;
  }

  // Update products count
  const productsCount = document.getElementById("products-count");
  if (productsCount) {
    productsCount.textContent = "Error loading products";
  }
}

function setupEventListeners() {
  // Filter and sort event listeners
  document
    .getElementById("category-filter")
    .addEventListener("change", filterProducts);
  document
    .getElementById("price-filter")
    .addEventListener("change", filterProducts);
  document
    .getElementById("sort-filter")
    .addEventListener("change", filterProducts);
  document
    .getElementById("product-search")
    .addEventListener("input", debounce(filterProducts, 300));

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
    });
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function filterProducts() {
  const categoryFilter = document.getElementById("category-filter").value;
  const priceFilter = document.getElementById("price-filter").value;
  const sortFilter = document.getElementById("sort-filter").value;
  const searchQuery = document
    .getElementById("product-search")
    .value.toLowerCase();

  let filtered = [...sampleProducts];

  // Apply category filter
  if (categoryFilter) {
    filtered = filtered.filter(
      (product) => product.category === categoryFilter
    );
  }

  // Apply price filter
  if (priceFilter) {
    const [min, max] = priceFilter.split("-").map((p) => p.replace("+", ""));
    filtered = filtered.filter((product) => {
      if (max) {
        return (
          product.priceNum >= parseInt(min) && product.priceNum <= parseInt(max)
        );
      } else {
        return product.priceNum >= parseInt(min);
      }
    });
  }

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );
  }

  // Apply sorting
  switch (sortFilter) {
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      filtered.sort((a, b) => a.priceNum - b.priceNum);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.priceNum - a.priceNum);
      break;
    case "newest":
      filtered.sort((a, b) => b.id - a.id);
      break;
    case "featured":
    default:
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  currentProducts = filtered;
  currentPage = 1;
  renderProducts();
}

// New function to handle product navigation
function navigateToProduct(productId) {
  // Store product data in sessionStorage for the product description page
  const product = sampleProducts.find((p) => p.id === productId);
  if (product) {
    sessionStorage.setItem("selectedProduct", JSON.stringify(product));
  }

  // Navigate to product description page
  window.location.href = `/product-description/productdescription.html?product=${productId}`;
}

// Enhanced function to make entire product card clickable
function makeProductCardClickable(productId) {
  return `onclick="navigateToProduct(${productId})" style="cursor: pointer;"`;
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = currentProducts.slice(startIndex, endIndex);

  // Update products count
  const productsCount = document.getElementById("products-count");
  if (productsCount) {
    productsCount.textContent = `Showing ${startIndex + 1}-${Math.min(
      endIndex,
      currentProducts.length
    )} of ${currentProducts.length} products`;
  }

  if (productsToShow.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms.</p>
        <button class="browse-all-btn" onclick="clearAllFilters()">Browse All Products</button>
      </div>
    `;
  } else {
    grid.innerHTML = productsToShow
      .map(
        (product) => `
      <div class="product-card" ${makeProductCardClickable(product.id)}>
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" />
          ${
            product.badge
              ? `<div class="product-badge">${product.badge}</div>`
              : ""
          }
          <div class="quick-actions">
            <button class="quick-action-btn" title="Quick View" onclick="event.stopPropagation(); navigateToProduct(${
              product.id
            })">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="quick-action-btn" title="Add to Wishlist" onclick="event.stopPropagation(); addToWishlist(${
              product.id
            })">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>
        <div class="product-card-content">
          <h3><a href="/product-description/productdescription.html?product=${
            product.id
          }" onclick="event.stopPropagation();">${product.name}</a></h3>
          <p class="product-description">${product.description}</p>
          <div class="product-card-price">${product.price}</div>
          <div class="product-card-actions">
            <a href="/product-description/productdescription.html?product=${
              product.id
            }" class="view-product-btn" onclick="event.stopPropagation();">
              View Details
            </a>
            <button class="add-to-cart-btn-card" onclick="event.stopPropagation(); addToCartFromList(${
              product.id
            })">
              <i class="fa-solid fa-cart-plus"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  const pagination = document.getElementById("pagination");

  if (totalPages <= 1) {
    pagination.style.display = "none";
    return;
  }

  pagination.style.display = "flex";

  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageNumbers = document.getElementById("page-numbers");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Generate page numbers
  let pagesHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === currentPage ||
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pagesHTML += `<button class="page-btn ${
        i === currentPage ? "active" : ""
      }" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pagesHTML += "<span>...</span>";
    }
  }
  pageNumbers.innerHTML = pagesHTML;

  // Event listeners for prev/next
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
    }
  };
}

function goToPage(page) {
  currentPage = page;
  renderProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearAllFilters() {
  document.getElementById("category-filter").value = "";
  document.getElementById("price-filter").value = "";
  document.getElementById("sort-filter").value = "featured";
  document.getElementById("product-search").value = "";
  filterProducts();
}

function addToCartFromList(productId) {
  const product = sampleProducts.find((p) => p.id === productId);
  if (product) {
    // Check if addItemToCart function exists (from cart.js)
    if (typeof addItemToCart === "function") {
      addItemToCart(
        product.id,
        product.name,
        product.priceNum,
        1,
        product.image
      );
    } else if (typeof addToCart === "function") {
      // Fallback to addToCart function
      addToCart({
        id: product.id,
        name: product.name,
        price: product.priceNum,
        image: product.image,
        quantity: 1,
      });
    } else {
      console.error("No cart function found!");
      alert("Unable to add to cart. Please refresh the page and try again.");
      return;
    }

    updateCartBadge();
  }
}

function quickView(productId) {
  // Use the new navigation function
  navigateToProduct(productId);
}

function addToWishlist(productId) {
  // Implement wishlist functionality
  console.log("Add to wishlist:", productId);
}

function updateCartBadge() {
  // Update cart badge - check for different cart functions
  const badge = document.querySelector(".badge");
  if (badge) {
    if (typeof getCartCount === "function") {
      badge.textContent = getCartCount();
    } else {
      // Fallback to checking cart in memory or localStorage
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalItems = cart.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
        badge.textContent = totalItems;
      } catch (error) {
        console.error("Error updating cart badge:", error);
        badge.textContent = "0";
      }
    }
  }
}

// Handle page visibility changes to update cart badge
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    updateCartBadge();
  }
});

// Handle storage events to sync cart across tabs
window.addEventListener("storage", function (e) {
  if (e.key === "cart") {
    updateCartBadge();
  }
});

// Add CSS for loading and error states
const style = document.createElement("style");
style.textContent = `
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    grid-column: 1 / -1;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #8c52ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    grid-column: 1 / -1;
    text-align: center;
    color: #666;
  }

  .error-state i {
    font-size: 48px;
    color: #d32f2f;
    margin-bottom: 20px;
  }

  .error-state h3 {
    margin-bottom: 10px;
    color: #333;
  }

  .retry-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #8c52ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .retry-btn:hover {
    background-color: #7a47e6;
  }

  /* Enhanced clickable product card styles */
  .product-card {
    transition: all 0.3s ease, transform 0.3s ease;
  }

  .product-card:hover {
    transform: translateY(-8px) !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important;
  }

  .product-card[style*="cursor: pointer"]:active {
    transform: translateY(-4px) scale(0.98);
  }
`;
document.head.appendChild(style);
