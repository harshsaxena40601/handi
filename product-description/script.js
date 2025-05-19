const API_BASE_URL = "https://handicraft-5708.onrender.com";

// Get product ID from URL
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Switch main image when thumbnail is clicked
function changeImage(src, thumbnail) {
  const mainImage = document.getElementById("main-product-image");
  if (mainImage) mainImage.src = src;

  document
    .querySelectorAll(".thumbnail")
    .forEach((t) => t.classList.remove("active"));
  thumbnail.classList.add("active");
}

// Show confirmation message after adding to cart
function showAddToCartConfirmation(productName) {
  const div = document.createElement("div");
  div.className = "add-to-cart-confirmation";
  div.textContent = `${productName} added to cart!`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

// Fetch and display product details
async function loadProductDetails() {
  const productId = getUrlParameter("product");
  if (!productId)
    return showEmptyState(
      "No product ID",
      "Try selecting a product from the homepage."
    );

  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}/`);
    if (!res.ok) throw new Error(`Product not found (HTTP ${res.status})`);
    const product = await res.json();

    // Show content
    document.querySelector(".loading-container").style.display = "none";
    document.querySelector(".product-gallery").style.display = "block";
    document.querySelector(".product-details").style.display = "block";

    // Populate fields
    document.querySelector(".product-title").textContent = product.name;
    document.querySelector(".product-breadcrumb span").textContent =
      product.name;
    document.querySelector(".product-price").textContent = `₹${product.price}`;
    document.querySelector(".product-description p").textContent =
      product.description;
    document.title = `${product.name} - SK HandiCraft`;

    // Image
    const mainImageUrl = product.images?.[0]?.image
      ? `${API_BASE_URL}${product.images[0].image}`
      : "/api/placeholder/400/320";

    const mainImage = document.getElementById("main-product-image");
    mainImage.src = mainImageUrl;
    mainImage.alt = product.name;

    // Thumbnails
    const thumbnailContainer = document.querySelector(".thumbnail-container");
    thumbnailContainer.innerHTML = "";
    product.images?.forEach((img, index) => {
      const url = `${API_BASE_URL}${img.image}`;
      const thumb = document.createElement("img");
      thumb.src = url;
      thumb.className = "thumbnail";
      if (index === 0) thumb.classList.add("active");
      thumb.addEventListener("click", () => changeImage(url, thumb));
      thumbnailContainer.appendChild(thumb);
    });

    // Features
    const featuresList = document.querySelector(".product-features ul");
    featuresList.innerHTML = "";
    (product.features || []).forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      featuresList.appendChild(li);
    });

    // Save for cart
    window.currentProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImageUrl,
    };

    loadRecommendedProducts(product.id);
  } catch (err) {
    console.error("Failed to load product:", err);
    showEmptyState(
      "Product not found",
      "Try going back and selecting another item."
    );
  }
}

// Show error/empty state
function showEmptyState(title, message) {
  const container = document.querySelector(".product-content");
  container.innerHTML = `
    <div class="empty-state">
      <i class="fa-solid fa-circle-exclamation"></i>
      <h3>${title}</h3>
      <p>${message}</p>
      <a href="/index.html" class="view-product-btn">Return Home</a>
    </div>
  `;
  document.querySelector(".more-products").style.display = "none";
}

// Load recommended products
async function loadRecommendedProducts(currentId) {
  const grid = document.querySelector(".products-grid");
  grid.innerHTML = `<div class="loading-spinner"></div>`;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/products/recommended/?exclude=${currentId}`
    );
    const data = res.ok ? await res.json() : [];

    if (!data.length) throw new Error("No recommendations");

    grid.innerHTML = "";
    const max = Math.min(4, data.length);
    for (let i = 0; i < max; i++) {
      const p = data[i];
      if (p.id == currentId) continue;

      const img = p.images?.[0]?.image
        ? `${API_BASE_URL}${p.images[0].image}`
        : "/api/placeholder/400/320";

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${img}" alt="${p.name}" />
        <div class="product-card-content">
          <h3>${p.name}</h3>
          <div class="product-card-price">₹${p.price}</div>
          <a href="productdescription.html?product=${p.id}" class="view-product-btn">View Product</a>
          <button class="add-to-cart-recommended"
                  data-id="${p.id}"
                  data-name="${p.name}"
                  data-price="${p.price}"
                  data-image="${img}">Add to Cart</button>
        </div>
      `;
      grid.appendChild(card);
    }

    document.querySelectorAll(".add-to-cart-recommended").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { id, name, price, image } = btn.dataset;
        if (typeof addItemToCart === "function") {
          addItemToCart(id, name, price, 1, image);
          showAddToCartConfirmation(name);
        }
      });
    });
  } catch {
    grid.innerHTML = `<div class="empty-state"><p>No recommendations found.</p></div>`;
  }
}

// Handle add to cart button
function setupAddToCartButton() {
  const btn = document.querySelector(".add-to-cart-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const qty = parseInt(document.getElementById("quantity").value) || 1;
    const p = window.currentProduct;
    if (p && typeof addItemToCart === "function") {
      addItemToCart(p.id, p.name, p.price, qty, p.image);
      showAddToCartConfirmation(p.name);
    } else {
      alert("Cart not ready. Please refresh.");
    }
  });
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  if (typeof loadCart === "function") loadCart();
  loadProductDetails();
  setupAddToCartButton();

  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      document.querySelector(".mobile-menu").classList.toggle("active");
    });
  }
});
