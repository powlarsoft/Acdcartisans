// Load cart from localStorage if available
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(productName, price, quantity = 1) {
  const existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.quantity += quantity;
    existing.total = existing.quantity * existing.price;
  } else {
    cart.push({ name: productName, price, quantity, total: price * quantity });
  }
  saveCart();
  updateCartDisplay();
  updateCartCount(); // update nav badge
}

// Update cart display (for cart.html)
function updateCartDisplay() {
  const cartTable = document.querySelector(".cart-summary table");
  const subtotalElement = document.querySelector(".subtotal");
  if (!cartTable || !subtotalElement) return;

  cartTable.innerHTML = `
    <tr>
      <th>Product</th><th>Quantity</th><th>Price</th><th>Total</th>
    </tr>
  `;

  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.total;
    cartTable.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td><input type="number" value="${item.quantity}" 
            onchange="updateQuantity('${item.name}', this.value)">
        </td>
        <td>₦${item.price.toLocaleString()}</td>
        <td>₦${item.total.toLocaleString()}</td>
      </tr>
    `;
  });

  subtotalElement.textContent = `Subtotal: ₦${subtotal.toLocaleString()}`;
}

// Update quantity dynamically
function updateQuantity(productName, newQty) {
  const item = cart.find(i => i.name === productName);
  if (item) {
    item.quantity = parseInt(newQty);
    item.total = item.quantity * item.price;
    saveCart();
    updateCartDisplay();
    updateCartCount(); // update nav badge
  }
}

// Clear cart (optional for checkout)
function clearCart() {
  cart = [];
  saveCart();
  updateCartDisplay();
  updateCartCount(); // update nav badge
}

// Update cart count in navigation bar
function updateCartCount() {
  const cartLink = document.querySelector("nav ul li a[href='cart.html']");
  if (cartLink) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartLink.textContent = `Cart (${count})`;
  }
}

// Attach event listeners for product page
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".product-details button:first-of-type");
  const buyBtn = document.querySelector(".product-details button:last-of-type");

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addToCart("200Ah Lithium Battery", 250000, 1);
      alert("Added to cart!");
    });
  }

  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      addToCart("200Ah Lithium Battery", 250000, 1);
      window.location.href = "cart.html";
    });
  }

  // If on cart page, render saved cart
  if (document.querySelector(".cart-summary")) {
    updateCartDisplay();
  }

  // Always update nav badge on load
  updateCartCount();
});
