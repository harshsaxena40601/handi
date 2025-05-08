// Function to get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Initialize static product data for fallback
const productData = {
  "floral-purse": {
    name: "Handcrafted Floral Purse",
    price: "$49.99",
    description:
      "This beautiful handcrafted floral purse is made with love and attention to detail. Each piece is unique, featuring intricate embroidery and high-quality materials that ensure both style and durability. Perfect for adding a touch of elegance to any outfit or as a thoughtful gift for someone special.",
    features: [
      "Handmade with premium fabric",
      "Unique floral embroidery design",
      "Spacious interior with inner pocket",
      "Adjustable shoulder strap",
      "Secure zipper closure",
      'Dimensions: 9" × 6" × 3"',
    ],
    mainImage: "product1.jpg",
  },
};

// Function to load product details from backend API
async function loadProductDetails() {
  try {
    // Get the product ID from URL
    const productId = getUrlParameter("product");

    if (!productId) {
      console.error("No product ID specified in URL");
      // Use the default product if no ID is specified
      window.currentProduct = {
        id: "floral-purse",
        name: "Handcrafted Floral Purse",
        price: 49.99,
        image: "product1.jpg",
      };
      return;
    }

    // Fetch product data from backend API
    const response = await fetch(
      `http://127.0.0.1:8000/api/products/${productId}/`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const product = await response.json();

    // Update product title
    document.querySelector(".product-title").textContent = product.name;

    // Update breadcrumb
    document.querySelector(".product-breadcrumb span").textContent =
      product.name;

    // Update price (assuming price is stored as number in database)
    document.querySelector(".product-price").textContent = `₹${product.price}`;

    // Update description
    document.querySelector(".product-description p").textContent =
      product.description;

    // Update features list if available
    if (product.features && Array.isArray(product.features)) {
      const featuresList = document.querySelector(".product-features ul");
      featuresList.innerHTML = "";
      product.features.forEach((feature) => {
        const li = document.createElement("li");
        li.textContent = feature;
        featuresList.appendChild(li);
      });
    }

    // Update main image and thumbnails if available
    if (product.images && product.images.length > 0) {
      // Update main image
      const mainImageUrl = `http://127.0.0.1:8000${product.images[0].image}`;
      const mainImage = document.getElementById("main-product-image");
      mainImage.src = mainImageUrl;
      mainImage.alt = product.name;

      // Update thumbnails if there are multiple images
      const thumbnailContainer = document.querySelector(".thumbnail-container");
      if (thumbnailContainer) {
        thumbnailContainer.innerHTML = ""; // Clear existing thumbnails

        product.images.forEach((img, index) => {
          const imgUrl = `http://127.0.0.1:8000${img.image}`;
          const thumbnail = document.createElement("img");
          thumbnail.src = imgUrl;
          thumbnail.alt = `${product.name} - View ${index + 1}`;
          thumbnail.className = "thumbnail";
          if (index === 0) thumbnail.classList.add("active");

          thumbnail.onclick = function () {
            changeImage(imgUrl, this);
          };

          thumbnailContainer.appendChild(thumbnail);
        });
      }
    }

    // Store current product data for add to cart functionality
    window.currentProduct = {
      id: productId,
      name: product.name,
      price: product.price,
      image:
        product.images && product.images.length > 0
          ? `http://127.0.0.1:8000${product.images[0].image}`
          : "/api/placeholder/400/320",
    };

    // Update page title
    document.title = `${product.name} - SK HandiCraft`;

    // Also fetch recommended products
    loadRecommendedProducts(productId);
  } catch (error) {
    console.error("Error loading product details:", error);
    // Fallback to static data if API call fails
    fallbackToStaticData();
  }
}

// Function to load recommended products from backend
async function loadRecommendedProducts(currentProductId) {
  try {
    // Fetch recommended products (you might need to adjust the API endpoint)
    const response = await fetch(
      `http://127.0.0.1:8000/api/products/recommended/?exclude=${currentProductId}`
    );

    if (!response.ok) {
      // If recommended endpoint fails, try fetching all products
      const allProductsResponse = await fetch(
        `http://127.0.0.1:8000/api/products/`
      );
      if (!allProductsResponse.ok) {
        throw new Error(`HTTP error! Status: ${allProductsResponse.status}`);
      }

      const allProducts = await allProductsResponse.json();
      // Filter out current product
      const filteredProducts = allProducts.filter(
        (p) => p.id !== currentProductId
      );
      displayRecommendedProducts(filteredProducts, currentProductId);
      return;
    }

    const products = await response.json();
    displayRecommendedProducts(products, currentProductId);
  } catch (error) {
    console.error("Error loading recommended products:", error);
  }
}

// Function to display recommended products
function displayRecommendedProducts(products, currentProductId) {
  // Get the products grid container
  const productsGrid = document.querySelector(".products-grid");
  if (!productsGrid) return;

  // Clear existing recommended products
  productsGrid.innerHTML = "";

  // Add up to 4 recommended products
  const maxProducts = Math.min(4, products.length);
  for (let i = 0; i < maxProducts; i++) {
    const product = products[i];
    // Skip if this is the current product
    if (product.id === currentProductId) continue;

    const productCard = document.createElement("div");
    productCard.className = "product-card";

    // Get product image or use placeholder
    const productImage =
      product.images && product.images.length > 0
        ? `http://127.0.0.1:8000${product.images[0].image}`
        : "/api/placeholder/400/320";

    productCard.innerHTML = `
      <img src="${productImage}" alt="${product.name}" />
      <div class="product-card-content">
        <h3>${product.name}</h3>
        <div class="product-card-price">₹${product.price}</div>
        <a href="productdescription.html?product=${product.id}" class="view-product-btn">View Product</a>
        <button class="add-to-cart-recommended" 
                data-id="${product.id}" 
                data-name="${product.name}" 
                data-price="${product.price}" 
                data-image="${productImage}">Add to Cart</button>
      </div>
    `;

    productsGrid.appendChild(productCard);
  }

  // Add event listeners to recommended product "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-recommended").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const productId = this.getAttribute("data-id");
      const productName = this.getAttribute("data-name");
      const price = this.getAttribute("data-price");
      const imageUrl = this.getAttribute("data-image");

      // Add item to cart (quantity 1 for quick add from recommendations)
      addItemToCart(productId, productName, price, 1, imageUrl);

      // Show confirmation
      alert(`Added ${productName} to your cart!`);
    });
  });
}

// Fallback function in case the API fails
function fallbackToStaticData() {
  // Get the product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product") || "floral-purse"; // Default to floral purse if no parameter

  // Use the static product data
  const product = productData[productId] || productData["floral-purse"];

  // Update product title
  document.querySelector(".product-title").textContent = product.name;

  // Update breadcrumb
  document.querySelector(".product-breadcrumb span").textContent = product.name;

  // Update price
  document.querySelector(".product-price").textContent = product.price;

  // Update description
  document.querySelector(".product-description p").textContent =
    product.description;

  // Update features list
  const featuresList = document.querySelector(".product-features ul");
  featuresList.innerHTML = "";
  product.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    featuresList.appendChild(li);
  });

  // Update main image
  document.getElementById("main-product-image").src = product.mainImage;
  document.getElementById("main-product-image").alt = product.name;

  // Set current product data for add to cart
  window.currentProduct = {
    id: productId,
    name: product.name,
    price: parseFloat(product.price.replace("$", "")), // Convert price string to number
    image: product.mainImage,
  };

  // Update page title
  document.title = `${product.name} - SK HandiCraft`;
}

// Function to change the main product image
function changeImage(src, thumbnail) {
  document.getElementById("main-product-image").src = src;

  // Remove active class from all thumbnails
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach((thumb) => {
    thumb.classList.remove("active");
  });

  // Add active class to clicked thumbnail
  thumbnail.classList.add("active");
}

// Function to add product to cart - using cart.js functionality
function addToCart() {
  if (!window.currentProduct) {
    console.error("Product details not loaded properly");
    return;
  }

  const quantity = parseInt(document.getElementById("quantity").value);
  const { id, name, price, image } = window.currentProduct;

  // Add to cart using the shared cart.js functionality
  addItemToCart(id, name, price, quantity, image);

  // Show confirmation
  alert(`Added ${quantity} ${name}(s) to your cart!`);
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Load product details
  loadProductDetails();

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      document.querySelector(".mobile-menu").classList.toggle("active");
    });
  }

  // Add to cart button event
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCart);
  }

  // Add CSS for the recommended product add to cart button
  const style = document.createElement("style");
  style.textContent = `
    .add-to-cart-recommended {
      display: block;
      width: 100%;
      background-color: #ff3b5c;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px;
      margin-top: 10px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .add-to-cart-recommended:hover {
      background-color: #e0344f;
    }
  `;
  document.head.appendChild(style);

  // Initialize cart
  loadCart();
});
