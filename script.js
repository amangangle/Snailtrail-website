document.addEventListener('DOMContentLoaded', function() {
    // ========== CART FUNCTIONALITY ==========
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const closeCart = document.querySelector('.close-cart');
    const addToCartBtn = document.querySelector('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
    
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart();
    
    // Toggle cart dropdown
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartDropdown.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartDropdown.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', function() {
        cartDropdown.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Quantity selector
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('quantity');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });
    
    // Add to cart
    addToCartBtn.addEventListener('click', function() {
        const id = addToCartBtn.dataset.id;
        const name = addToCartBtn.dataset.name;
        const price = parseFloat(addToCartBtn.dataset.price);
        const quantity = parseInt(quantityInput.value);
        const image = document.querySelector('.product-image img').src;
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity,
                image
            });
        }
        
        // Save to localStorage and update UI
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        showNotification('Item added to cart');
        
        // Reset quantity
        quantityInput.value = 1;
    });
    
    // Update cart UI
    function updateCart() {
        // Clear cart items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartCount.textContent = '0';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        // Add items to cart
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <span class="remove-item" data-id="${item.id}">Remove</span>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update cart total and count
        cartTotal.textContent = `$${total.toFixed(2)}`;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Add event listeners to cart items
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = btn.dataset.id;
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
                showNotification('Item removed from cart');
            });
        });
        
        document.querySelectorAll('.cart-item-quantity').forEach(input => {
            input.addEventListener('change', function() {
                const id = input.dataset.id;
                const quantity = parseInt(input.value);
                
                if (quantity < 1) {
                    input.value = 1;
                    return;
                }
                
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity = quantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.cart-item .minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = btn.dataset.id;
                const item = cart.find(item => item.id === id);
                
                if (item && item.quantity > 1) {
                    item.quantity--;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.cart-item .plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = btn.dataset.id;
                const item = cart.find(item => item.id === id);
                
                if (item) {
                    item.quantity++;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart();
                }
            });
        });
    }
    
    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('active');
        
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }
    
    // ========== ACCORDION FUNCTIONALITY ==========
    const accordionHeader = document.querySelector('.accordion-header');
    const accordionContent = document.querySelector('.accordion-content');
    const accordionIcon = document.querySelector('.accordion-header i');
    
    accordionHeader.addEventListener('click', function() {
        accordionContent.classList.toggle('active');
        accordionIcon.classList.toggle('fa-chevron-down');
        accordionIcon.classList.toggle('fa-chevron-up');
    });
    
    // ========== FORM SUBMISSIONS ==========
    // Contact form
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        showNotification('Message sent successfully!');
        contactForm.reset();
    });
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        
        // Here you would typically send the email to your mailing list
        console.log('Newsletter subscription:', email);
        
        // Show success message
        showNotification('Thanks for subscribing!');
        newsletterForm.reset();
    });
    
    // ========== SCROLL EFFECTS ==========
    // Header shadow on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('header').classList.add('scrolled');
        } else {
            document.querySelector('header').classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close cart if open
                cartDropdown.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
});