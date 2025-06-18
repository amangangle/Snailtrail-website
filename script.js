document.addEventListener('DOMContentLoaded', function() {
// Cart functionality
let cart = [];
const cartModal = document.getElementById('cart');
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.total-amount');
const addToCartBtn = document.querySelector('.add-to-cart');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');
const checkoutBtn = document.querySelector('.checkout-btn');

// Product details
const product = {
name: 'Advanced Repair Serum (10% Niacinamide + 5% Snail Mucin + 1% Zinc)',
price: 29.99,
id: 'snailtrail-serum-001'
};

// Open cart modal
cartIcon.addEventListener('click', function(e) {
e.preventDefault();
cartModal.style.display = 'block';
renderCart();
});

// Close cart modal
closeCart.addEventListener('click', function() {
cartModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
if (e.target === cartModal) {
cartModal.style.display = 'none';
}
});

// Add to cart functionality
addToCartBtn.addEventListener('click', function() {
const quantity = parseInt(document.getElementById('quantity').value);

// Check if product already in cart
const existingItemIndex = cart.findIndex(item => item.id === product.id);

if (existingItemIndex !== -1) {
// Update quantity if product exists
cart[existingItemIndex].quantity += quantity;
} else {
// Add new item to cart
cart.push({
...product,
quantity: quantity
});
}

updateCartCount();
renderCart();

// Show confirmation
alert(`${quantity} ${product.name} added to cart!`);
});

// Update cart count in header
function updateCartCount() {
const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
cartCount.textContent = totalItems;
}

// Render cart items
function renderCart() {
if (cart.length === 0) {
cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
cartTotal.textContent = '0.00';
return;
}

cartItemsContainer.innerHTML = '';
let total = 0;

cart.forEach((item, index) => {
const itemTotal = item.price * item.quantity;
total += itemTotal;

const cartItem = document.createElement('div');
cartItem.className = 'cart-item';
cartItem.innerHTML = `
<div class="cart-item-info">
<div class="cart-item-name">${item.name}</div>
<div class="cart-item-price">$${item.price.toFixed(2)}</div>
</div>
<div class="cart-item-quantity">
<button class="decrease-quantity" data-index="${index}">-</button>
<span>${item.quantity}</span>
<button class="increase-quantity" data-index="${index}">+</button>
</div>
<div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
<div class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></div>
`;

cartItemsContainer.appendChild(cartItem);
});

cartTotal.textContent = total.toFixed(2);

// Add event listeners to quantity buttons
document.querySelectorAll('.decrease-quantity').forEach(button => {
button.addEventListener('click', function() {
const index = parseInt(this.getAttribute('data-index'));
if (cart[index].quantity > 1) {
cart[index].quantity--;
} else {
cart.splice(index, 1);
}
updateCartCount();
renderCart();
});
});

document.querySelectorAll('.increase-quantity').forEach(button => {
button.addEventListener('click', function() {
const index = parseInt(this.getAttribute('data-index'));
cart[index].quantity++;
updateCartCount();
renderCart();
});
});

document.querySelectorAll('.remove-item').forEach(button => {
button.addEventListener('click', function() {
const index = parseInt(this.getAttribute('data-index'));
cart.splice(index, 1);
updateCartCount();
renderCart();
});
});
}

// Checkout button
checkoutBtn.addEventListener('click', function() {
if (cart.length === 0) {
alert('Your cart is empty!');
return;
}

// In a real application, this would redirect to a checkout page
alert('Proceeding to checkout! Total: $' + cartTotal.textContent);
cart = [];
updateCartCount();
renderCart();
cartModal.style.display = 'none';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function(e) {
if (this.getAttribute('href') === '#cart') return;

e.preventDefault();
const targetId = this.getAttribute('href');
const targetElement = document.querySelector(targetId);

if (targetElement) {
window.scrollTo({
top: targetElement.offsetTop - 80,
behavior: 'smooth'
});
}
});
});

// Form submission handling (basic)
const contactForm = document.querySelector('.contact-form form');
const newsletterForm = document.querySelector('.newsletter-form');

if (contactForm) {
contactForm.addEventListener('submit', function(e) {
e.preventDefault();
alert('Thank you for your message! We will get back to you soon.');
this.reset();
});
}

if (newsletterForm) {
newsletterForm.addEventListener('submit', function(e) {
e.preventDefault();
const email = this.querySelector('input').value;
alert(`Thank you for subscribing with ${email}!`);
this.reset();
});
}
});