// =========================================================
// 1. PRODUKT-KLASS
// =========================================================

class Product {
  constructor(id, name, price, category, desc, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.desc = desc;
    this.image = image;
  }

  createCard() {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="card-image-container">
        <img src="${this.image}" alt="${this.name}" onerror="this.src='https://picsum.photos/seed/${this.id}/300/200.jpg'">
      </div>

      <div class="card-content">
        <h3 class="card-title">${this.name}</h3>

        <div class="card-footer">
          <span class="card-price">${this.price} kr</span>
          <button class="add-btn">Köp</button>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openProductModal(this));

    card.querySelector(".add-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(this.id, 1);
    });

    return card;
  }
}

// =========================================================
// 2. PRODUKTER
// =========================================================

const products = [
  new Product(1, "Mjölk 1L", 15, "mejeri", "Färsk svensk mjölk.", "assets/mjolk.jpg"),
  new Product(2, "Smör", 55, "mejeri", "Normalsaltat smör.", "assets/smor.jpg"),

  new Product(3, "Oxfilé", 299, "kott", "Mör oxfilé.", "assets/oxfile.jpg"),
  new Product(4, "Kycklingfilé", 120, "kott", "Fryst kyckling.", "assets/kyckling.avif"),

  new Product(5, "Bananer", 25, "frukt", "Ekologiska bananer.", "assets/bananer.jpg"),
  new Product(6, "Äpplen", 29, "frukt", "Svenska äpplen.", "assets/apple.webp"),

  new Product(7, "Avocado", 15, "gront", "Mogen avocado.", "assets/avocado.jpg"),
  new Product(8, "Gurka", 12, "gront", "Svensk gurka.", "assets/gurka.webp"),
];

// =========================================================
// 3. VARUKORG
// =========================================================

let cart = [];

function addToCart(id, qty = 1) {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if (item) item.qty += qty;
  else cart.push({ ...product, qty });

  updateCartCounter();
}

function updateCartCounter() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cart-counter").innerText = total;
}

function openCartModal() {
  renderCart();
  document.getElementById("cart-modal").classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");

  container.innerHTML = "";
  let sum = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Varukorgen är tom.</p>";
    totalPrice.innerText = "0.00";
    return;
  }

  cart.forEach(item => {
    sum += item.price * item.qty;

    const row = document.createElement("div");
    row.innerHTML = `
      <strong>${item.name}</strong><br>
      ${item.qty} st × ${item.price} kr
    `;
    container.appendChild(row);
  });

  totalPrice.innerText = sum.toFixed(2);
}

// =========================================================
// 4. PRODUKT-MODAL
// =========================================================

let currentProduct = null;
let modalQty = 0;

function openProductModal(product) {
  currentProduct = product;
  modalQty = 0;

  const modalImg = document.getElementById("modal-img");
  modalImg.src = product.image;
  modalImg.onerror = function() {
    this.src = `https://picsum.photos/seed/${product.id}/300/200.jpg`;
  };
  
  document.getElementById("modal-title").innerText = product.name;
  document.getElementById("modal-desc").innerText = product.desc;
  document.getElementById("modal-price").innerText = product.price + " kr";
  document.getElementById("modal-qty").innerText = "0 st";

  document.getElementById("product-modal").classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("product-modal").classList.add("hidden");
}

function changeQty(amount) {
  modalQty = Math.max(0, modalQty + amount);
  document.getElementById("modal-qty").innerText = modalQty + " st";
}

function addModalToCart() {
  if (modalQty > 0) {
    addToCart(currentProduct.id, modalQty);
    closeProductModal();
  }
}

// =========================================================
// 5. RENDERING (NU 100 % SÄKER)
// =========================================================

const container = document.getElementById("product-container");

function loadProducts() {
  const category = document.body.dataset.category || "all";

  const list =
    category === "all"
      ? products
      : products.filter(p => p.category === category);

  container.innerHTML = "";
  list.forEach(p => container.appendChild(p.createCard()));
}

// =========================================================
// 6. NAV
// =========================================================

function toggleMenu() {
  document.getElementById("category-nav").classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", loadProducts);