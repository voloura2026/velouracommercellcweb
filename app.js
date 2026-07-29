const products = [
  { name: 'The Everyday Tumbler', type: 'home', meta: 'Hand-finished stoneware', price: 32, tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85' },
  { name: 'Ritual Candle No. 01', type: 'ritual', meta: 'Cedar · Fig · Smoke', price: 48, tag: 'New', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85' },
  { name: 'The Soft Carryall', type: 'carry', meta: 'Organic cotton canvas', price: 84, tag: 'Made to last', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85' },
  { name: 'Sunday Incense Set', type: 'ritual', meta: 'Sandalwood · 30 sticks', price: 28, tag: '', image: 'https://images.unsplash.com/photo-1602607208132-7f9e2aa6eab0?auto=format&fit=crop&w=700&q=85' },
  { name: 'The Daily Notebook', type: 'carry', meta: 'Recycled paper · A5', price: 24, tag: '', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=85' },
  { name: 'Linen Hand Towel', type: 'home', meta: 'European flax linen', price: 36, tag: '', image: 'https://images.unsplash.com/photo-1583845112203-454c77fba7c3?auto=format&fit=crop&w=700&q=85' },
  { name: 'The Quiet Tray', type: 'home', meta: 'Solid acacia wood', price: 64, tag: '', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=85' },
  { name: 'Amber Glass Mist', type: 'ritual', meta: 'Neroli · Bergamot', price: 26, tag: '', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85' }
];

const state = {
  cart: []
};

const productGrid = document.querySelector('#productGrid');
const cartDrawer = document.querySelector('#cartDrawer');
const cartItems = document.querySelector('#cartItems');
const cartCount = document.querySelector('#cartCount');
const drawerCount = document.querySelector('#drawerCount');
const cartTotal = document.querySelector('#cartTotal');
const checkoutModal = document.querySelector('#checkoutModal');
const checkoutForm = document.querySelector('#checkoutForm');
const checkoutItems = document.querySelector('#checkoutItems');
const checkoutTotal = document.querySelector('#checkoutTotal');
const checkoutMessage = document.querySelector('#checkoutMessage');
const orderModal = document.querySelector('#orderModal');
const orderId = document.querySelector('#orderId');
const orderSummaryName = document.querySelector('#orderSummaryName');
const orderContact = document.querySelector('#orderContact');
const orderAddress = document.querySelector('#orderAddress');
const orderTotal = document.querySelector('#orderTotal');
const contactPanel = document.querySelector('#contact');
const categoryTabs = Array.from(document.querySelectorAll('.category-tabs button'));

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function getCartEntry(productIndex) {
  return state.cart.find((item) => item.productIndex === productIndex);
}

function getCartEntries() {
  return state.cart
    .map((item) => {
      const product = products[item.productIndex];
      if (!product) return null;
      return {
        ...item,
        product,
        subtotal: product.price * item.quantity
      };
    })
    .filter(Boolean);
}

function getCartCount() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return getCartEntries().reduce((total, item) => total + item.subtotal, 0);
}

function addToCart(productIndex, quantity = 1) {
  const existingItem = getCartEntry(productIndex);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    state.cart.push({ productIndex, quantity });
  }
  updateCart();
}

function increaseQuantity(productIndex) {
  addToCart(productIndex, 1);
}

function decreaseQuantity(productIndex) {
  const entry = getCartEntry(productIndex);
  if (!entry) return;

  entry.quantity -= 1;
  if (entry.quantity < 1) {
    state.cart = state.cart.filter((item) => item.productIndex !== productIndex);
  }
  updateCart();
}

function removeItem(productIndex) {
  state.cart = state.cart.filter((item) => item.productIndex !== productIndex);
  updateCart();
}

function renderProducts(filter = 'all') {
  const filteredProducts = products.filter((product) => filter === 'all' || product.type === filter);
  productGrid.innerHTML = filteredProducts
    .map((product) => {
      const index = products.indexOf(product);
      return `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
            <button class="add-button" type="button" data-action="add" data-index="${index}" aria-label="Add ${product.name} to cart">+</button>
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.meta}<strong>${formatCurrency(product.price)}</strong></p>
            <div class="product-actions">
              <button class="add-to-cart" type="button" data-action="add" data-index="${index}">Add to Cart</button>
              <button class="buy-now" type="button" data-action="buy" data-index="${index}">Buy It Now <span>↗</span></button>
            </div>
          </div>
        </article>`;
    })
    .join('');
}

function updateCart() {
  const entries = getCartEntries();
  const total = getCartTotal();

  cartCount.textContent = getCartCount();
  drawerCount.textContent = getCartCount();
  cartTotal.textContent = formatCurrency(total);

  cartItems.innerHTML = entries.length
    ? entries
        .map(
          ({ product, productIndex, quantity, subtotal }) => `
            <article class="cart-row">
              <img src="${product.image}" alt="${product.name}">
              <div class="cart-row-content">
                <div class="cart-row-top">
                  <div>
                    <h3>${product.name}</h3>
                    <p>${product.meta}</p>
                  </div>
                  <strong>${formatCurrency(subtotal)}</strong>
                </div>
                <div class="cart-item-controls">
                  <button type="button" data-action="decrease" data-index="${productIndex}" aria-label="Decrease quantity of ${product.name}">−</button>
                  <span>${quantity}</span>
                  <button type="button" data-action="increase" data-index="${productIndex}" aria-label="Increase quantity of ${product.name}">+</button>
                  <button type="button" class="cart-remove" data-action="remove" data-index="${productIndex}">Remove</button>
                </div>
              </div>
            </article>`
        )
        .join('')
    : '<div class="empty-cart">Your bag is waiting for something lovely.</div>';
}

function renderCheckout() {
  const entries = getCartEntries();
  checkoutItems.innerHTML = entries.length
    ? entries
        .map(
          ({ product, quantity, subtotal }) => `
            <div class="summary-item">
              <img src="${product.image}" alt="${product.name}">
              <div>
                <h3>${product.name}</h3>
                <p>${quantity} x ${formatCurrency(product.price)}</p>
              </div>
              <strong>${formatCurrency(subtotal)}</strong>
            </div>`
        )
        .join('')
    : '<p class="empty-cart">Your bag is empty.</p>';

  checkoutTotal.textContent = formatCurrency(getCartTotal());
}

function openCart() {
  cartDrawer.classList.add('open');
  document.querySelector('#backdrop').classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  document.querySelector('#backdrop').classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function openCheckout() {
  if (!state.cart.length) {
    alert('Add a product to your bag before checkout.');
    return;
  }

  closeCart();
  renderCheckout();
  checkoutMessage.textContent = '';
  checkoutMessage.classList.remove('is-visible');
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
}

function generateOrderId() {
  return `#VEL-${Math.floor(10000 + Math.random() * 90000)}`;
}

function formatShippingAddress(address) {
  return [
    address.addressLine1,
    address.addressLine2,
    `${address.city}${address.state ? `, ${address.state}` : ''}${address.zipCode ? ` ${address.zipCode}` : ''}`,
    address.country
  ].filter(Boolean);
}

function openOrderConfirmation({ fullName, phone, shippingAddress, total }) {
  orderId.textContent = generateOrderId();
  orderSummaryName.textContent = fullName || 'Guest';
  orderContact.textContent = phone || 'Not provided';
  orderAddress.textContent = shippingAddress.length ? shippingAddress.join('\n') : 'Not provided';
  orderTotal.textContent = formatCurrency(total);
  orderModal.classList.add('open');
  orderModal.setAttribute('aria-hidden', 'false');
}

function closeOrderConfirmation() {
  orderModal.classList.remove('open');
  orderModal.setAttribute('aria-hidden', 'true');
}

function revealContact(event) {
  if (event) event.preventDefault();
  contactPanel.classList.toggle('contact-visible');
}

productGrid.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;

  const productIndex = Number(actionButton.dataset.index);
  const action = actionButton.dataset.action;

  if (action === 'add') {
    addToCart(productIndex);
    openCart();
  }

  if (action === 'buy') {
    addToCart(productIndex);
    openCheckout();
  }
});

cartItems.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;

  const productIndex = Number(control.dataset.index);
  const action = control.dataset.action;

  if (action === 'increase') increaseQuantity(productIndex);
  if (action === 'decrease') decreaseQuantity(productIndex);
  if (action === 'remove') removeItem(productIndex);
});

categoryTabs.forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.category-tabs .active')?.classList.remove('active');
    button.classList.add('active');
    renderProducts(button.dataset.filter);
  });
});

document.querySelector('#cartButton').addEventListener('click', openCart);
document.querySelector('#closeCart').addEventListener('click', closeCart);
document.querySelector('#backdrop').addEventListener('click', closeCart);
document.querySelector('#checkoutButton').addEventListener('click', openCheckout);
document.querySelector('#closeCheckout').addEventListener('click', closeCheckout);
document.querySelector('#closeOrderModal').addEventListener('click', closeOrderConfirmation);
document.querySelector('#searchButton').addEventListener('click', () => document.querySelector('#searchModal').classList.add('open'));
document.querySelector('#closeSearch').addEventListener('click', () => document.querySelector('#searchModal').classList.remove('open'));
document.querySelector('#contactButton').addEventListener('click', revealContact);
document.querySelectorAll('a[href="#contact"]').forEach((link) => link.addEventListener('click', revealContact));
document.querySelector('#contactClose').addEventListener('click', () => contactPanel.classList.remove('contact-visible'));

checkoutModal.addEventListener('click', (event) => {
  if (event.target === checkoutModal) closeCheckout();
});

orderModal.addEventListener('click', (event) => {
  if (event.target === orderModal) closeOrderConfirmation();
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!state.cart.length) {
    checkoutMessage.textContent = 'Your cart is empty.';
    checkoutMessage.classList.add('is-visible');
    return;
  }

  const formData = new FormData(checkoutForm);
  const fullName = String(formData.get('fullName') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const addressLine1 = String(formData.get('addressLine1') || '').trim();
  const addressLine2 = String(formData.get('addressLine2') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const stateName = String(formData.get('state') || '').trim();
  const zipCode = String(formData.get('zipCode') || '').trim();
  const country = String(formData.get('country') || '').trim();
  const total = getCartTotal();
  const shippingAddress = formatShippingAddress({
    addressLine1,
    addressLine2,
    city,
    state: stateName,
    zipCode,
    country
  });

  checkoutForm.reset();
  checkoutForm.querySelector('input[value="Cash on Delivery"]').checked = true;

  openOrderConfirmation({ fullName, phone, shippingAddress, city, total });
  state.cart = [];
  updateCart();
  renderCheckout();
  closeCheckout();
});

document.querySelector('#newsletterForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#formMessage').textContent = 'You’re on the list — see you in your inbox.';
  event.target.reset();
});

renderProducts();
updateCart();
