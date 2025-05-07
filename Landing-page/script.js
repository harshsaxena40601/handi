// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

// Search Functionality
const searchInput = document.querySelector(".search-icon");
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
    }
  }
});

// Add to Cart Button
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert("Item added to cart!");
    // Here, you can make a call to your Django API to add the item to the cart
  });
});

// Newsletter Form Submission
const newsletterForm = document.querySelector(".newsletter-form");
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.querySelector("input").value.trim();
  if (email) {
    alert(`Thank you for subscribing with ${email}!`);
    // Here, you can make a call to your Django API to add the email to the newsletter list
    event.target.reset();
  }
});

// Fetch Products from Django Backend
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:8000/api/products/");
    const data = await response.json();
    console.log(data);
    // You can use this data to dynamically populate the product list on your page
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Call the function to load products on page load
fetchProducts();
