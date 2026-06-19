let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ... (previous cart functions improved)

function showToast(msg) {
  // toast code...
}

// Admin Login Simulation
function adminLogin() {
  const username = prompt("Enter Admin Username:");
  const password = prompt("Enter Admin Password:");
  if (username === "admin" && password === "admin123") {
    window.location.href = "admin/dashboard.html";
  } else {
    alert("Invalid credentials. Try admin / admin123");
  }
}

// Mock Payment
function processPayment() {
  alert("Redirecting to Paystack...");
  setTimeout(() => {
    alert("✅ Payment Successful! Thank you for shopping with AC/DC Artisans.");
    clearCart();
    window.location.href = "index.html";
  }, 1500);
}