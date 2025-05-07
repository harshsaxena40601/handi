// Product data - this would ideally come from a database
const productData = {
  "rattan-basket": {
    name: "Handwoven Rattan Basket",
    price: "₹1,599",
    description:
      "This beautiful handwoven rattan basket is made with love and attention to detail by skilled artisans using traditional techniques. Each piece is unique, featuring intricate weaving patterns and high-quality natural materials that ensure both style and durability. Perfect for storage, decoration, or as a thoughtful gift.",
    features: [
      "Handmade with premium natural rattan",
      "Unique traditional weaving pattern",
      "Sturdy construction with reinforced handles",
      "Versatile for storage or decoration",
      "Environmentally sustainable materials",
      'Dimensions: 12" × 10" × 8"',
    ],
    mainImage: "product1.jpg",
    thumbnails: [
      "product1.jpg",
      "product2.jpg",
      "product3.jpg",
      "product4.jpg",
    ],
  },
  "ceramic-vase": {
    name: "Handmade Ceramic Vase",
    price: "₹1,199",
    description:
      "This exquisite handmade ceramic vase showcases the skill and artistry of our master potters. Each vase is carefully shaped, fired, and glazed to create a one-of-a-kind piece with natural variations in color and texture. Perfect for displaying fresh or dried flowers, or as a standalone decorative accent in your home.",
    features: [
      "Hand-thrown by skilled potters",
      "Unique glaze with natural variations",
      "Food-safe and water-tight",
      "Kiln-fired for durability",
      "Makes an elegant centerpiece",
      'Dimensions: 8" height × 5" diameter',
    ],
    mainImage: "product1.jpg",
    thumbnails: [
      "product1.jpg",
      "product2.jpg",
      "product3.jpg",
      "product4.jpg",
    ],
  },
  "cushion-cover": {
    name: "Embroidered Cushion Cover",
    price: "₹899",
    description:
      "Add a touch of artisanal elegance to your home with this hand-embroidered cushion cover. Featuring intricate needlework on natural cotton fabric, this cover combines traditional craftsmanship with contemporary design. Each stitch is carefully placed by skilled artisans to create a beautiful piece that will enhance any living space.",
    features: [
      "Hand-embroidered by skilled artisans",
      "Premium 100% cotton fabric",
      "Hidden zipper closure",
      "Vibrant, colorfast dyes",
      'Fits standard 18" × 18" cushions',
      "Machine washable on gentle cycle",
    ],
    mainImage: "product1.jpg",
    thumbnails: [
      "product1.jpg",
      "product2.jpg",
      "product3.jpg",
      "product4.jpg",
    ],
  },
  "wooden-bowl": {
    name: "Carved Wooden Bowl",
    price: "₹2,199",
    description:
      "This meticulously carved wooden bowl represents the pinnacle of traditional woodworking craftsmanship. Made from sustainably sourced hardwood by master craftsmen, each bowl features unique grain patterns and natural characteristics of the wood. Perfect for serving, as a decorative centerpiece, or as a treasured gift.",
    features: [
      "Hand-carved from premium hardwood",
      "Unique wood grain patterns",
      "Food-safe finish",
      "Treated with natural oils",
      "Sustainably sourced materials",
      'Dimensions: 10" diameter × 4" height',
    ],
    mainImage: "product1.jpg",
    thumbnails: [
      "product1.jpg",
      "product2.jpg",
      "product3.jpg",
      "product4.jpg",
    ],
  },
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
    thumbnails: [
      "product1.jpg",
      "product2.jpg",
      "product3.jpg",
      "product4.jpg",
    ],
  },
};

// Function to load product details based on URL parameter
function loadProductDetails() {
  // Get the product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product") || "floral-purse"; // Default to floral purse if no parameter

  // Get product data
  const product = productData[productId];

  if (product) {
    // Update product title
    document.querySelector(".product-title").textContent = product.name;

    // Update breadcrumb
    document.querySelector(".product-breadcrumb span").textContent =
      product.name;

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

    // Update main image (using the same image for now as placeholders)
    document.getElementById("main-product-image").src = product.mainImage;
    document.getElementById("main-product-image").alt = product.name;

    // Update page title
    document.title = `${product.name} - SK HandiCraft`;
  }
}

// Load product details when the page loads
window.addEventListener("DOMContentLoaded", loadProductDetails);

// Keep the existing functions
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

function addToCart() {
  const quantity = document.getElementById("quantity").value;
  const productName = document.querySelector(".product-title").textContent;
  alert(`Added ${quantity} ${productName}(s) to your cart!`);

  // Here you would typically update the cart counter
  // For demonstration, we'll just show an alert
}
