// =============================================
// app.js - AC/DC Artisans E-commerce
// Fully functional cart + mobile menu
// =============================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  
  if (existing) {
    existing.quantity += 1;
    existing.total = existing.quantity * existing.price;
  } else {
    cart.push({
      name: name,
      price: parseFloat(price),
      quantity: 1,
      total: parseFloat(price)
    });
  }
  
  saveCart();
  updateCartCount();
  showToast(`${name} added to cart!`);
}

// Update quantity in cart
function updateQuantity(name, newQty) {
  const item = cart.find(i => i.name === name);
  if (item) {
    const qty = parseInt(newQty);
    if (qty < 1) {
      removeFromCart(name);
      return;
    }
    item.quantity = qty;
    item.total = qty * item.price;
    saveCart();
    updateCartDisplay();
    updateCartCount();
  }
}

// Remove item from cart
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  updateCartDisplay();
  updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartLink = document.getElementById("cart-link");
  if (cartLink) {
    cartLink.textContent = count > 0 ? `Cart (${count})` : "Cart";
  }
}

// Render cart items
function updateCartDisplay() {
  const tbody = document.querySelector(".cart-summary tbody");
  const subtotalEl = document.querySelector(".subtotal");
  if (!tbody) return;

  tbody.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.total;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" 
               style="width:70px; text-align:center;" 
               onchange="updateQuantity('${item.name}', this.value)">
      </td>
      <td>₦${item.price.toLocaleString()}</td>
      <td>₦${item.total.toLocaleString()}</td>
      <td>
        <button onclick="removeFromCart('${item.name}')" 
                style="background:#e74c3c; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer;">
          Remove
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  if (subtotalEl) {
    subtotalEl.innerHTML = `<strong>Subtotal: ₦${subtotal.toLocaleString()}</strong>`;
  }
}

// Toast notification
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: #004d40; color: white; padding: 14px 24px; border-radius: 6px;
      z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}

// Admin Login
function adminLogin() {
  const username = prompt("Enter Admin Username:");
  const password = prompt("Enter Admin Password:");
  if (username === "admin" && password === "admin123") {
    window.location.href = "admin/dashboard.html";
  } else {
    alert("Invalid credentials!\n\nHint: admin / admin123");
  }
}

// Mock Payment Processing
function processPayment() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  if (confirm("Proceed to secure checkout with Paystack?")) {
    alert("Redirecting to Paystack payment gateway...");
    setTimeout(() => {
      alert("✅ Payment Successful! Thank you for shopping with AC/DC Artisans.");
      cart = [];
      saveCart();
      updateCartCount();
      window.location.href = "index.html";
    }, 1500);
  }
}

// Change main product image
function changeImage(imgElement) {
  const mainImg = document.getElementById("mainImg");
  if (mainImg) mainImg.src = imgElement.src;
}

// Hamburger Menu Toggle
function toggleMobileMenu() {
  const navUl = document.querySelector("nav ul");
  if (navUl) navUl.classList.toggle("active");
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Hamburger Menu
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener("click", () => {
      const navUl = document.querySelector("nav ul");
      if (navUl) navUl.classList.remove("active");
    });
  });

  // Featured Products on Homepage
  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    const products = [
      { name: "200Ah Lithium Battery", price: 250000, img: "assets/images/battery.png" },
      { name: "500W Solar Panel", price: 185000, img: "assets/images/solar-banner.png" },
      { name: "3.5kVA Hybrid Inverter", price: 450000, img: "assets/images/battery-side.png" }
    ];

    featuredGrid.innerHTML = "";
    products.forEach(product => {
      const div = document.createElement("div");
      div.style.textAlign = "center";
      div.innerHTML = `
        <img src="${product.img}" alt="${product.name}" style="max-width:100%; border-radius:8px;">
        <h3 style="margin:12px 0 8px;">${product.name}</h3>
        <p class="price" style="font-size:1.1rem; font-weight:bold;">₦${product.price.toLocaleString()}</p>
        <button onclick="addToCart('${product.name}', ${product.price})" style="margin-top:8px;">Add to Cart</button>
      `;
      featuredGrid.appendChild(div);
    });
  }

  // Product Page Buttons
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      if (name && price) addToCart(name, price);
    });
  });

  document.querySelectorAll(".buy-now").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      if (name && price) {
        addToCart(name, price);
        window.location.href = "cart.html";
      }
    });
  });

  // Cart Page
  if (document.querySelector(".cart-summary")) {
    updateCartDisplay();
  }
});