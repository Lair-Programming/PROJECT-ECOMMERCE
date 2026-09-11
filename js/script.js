const CART_KEY = 'elevenShopCart';

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    const cartLink = document.querySelector('.cart-link');

    if (!cartCount || !cartLink) {
        return;
    }

    cartCount.textContent = totalQuantity;
    cartLink.setAttribute('aria-label', `Cart with ${totalQuantity} product${totalQuantity === 1 ? '' : 's'}`);
}

function showMessage(message) {
    const toastMessage = document.getElementById('toastMessage');
    const cartToast = document.getElementById('cartToast');

    if (!toastMessage || !cartToast) {
        return;
    }

    toastMessage.textContent = message;
    bootstrap.Toast.getOrCreateInstance(cartToast, { delay: 2600 }).show();
}

function addToCart(productCard, button) {
    const product = {
        id: Number(productCard.dataset.productId),
        name: productCard.dataset.productName,
        price: Number(productCard.dataset.productPrice),
        image: productCard.dataset.productImage,
        category: productCard.dataset.productCategory,
        quantity: 1
    };
    const cart = getCart();
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    updateCartCount();
    button.classList.add('added');
    button.innerHTML = '<i class="bi bi-check2"></i> Added';
    showMessage(`${product.name} added to cart!`);

    window.setTimeout(() => {
        button.classList.remove('added');
        button.innerHTML = '<i class="bi bi-bag-plus"></i> Add to Cart';
    }, 1500);
}

function setupProductActions() {
    document.querySelectorAll('.add-cart-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            addToCart(productCard, button);
        });
    });

    document.querySelectorAll('.wishlist-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            button.classList.toggle('is-liked');
            icon.classList.toggle('bi-heart');
            icon.classList.toggle('bi-heart-fill');
            button.setAttribute('aria-label', button.classList.contains('is-liked') ? 'Remove from wishlist' : 'Add to wishlist');
        });
    });
}

function setupNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    const newsletterFeedback = document.getElementById('newsletterFeedback');

    if (!newsletterForm || !emailInput || !newsletterFeedback) {
        return;
    }

    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!emailInput.validity.valid || emailInput.value.trim() === '') {
            newsletterFeedback.textContent = 'Please enter a valid email address.';
            newsletterFeedback.className = 'form-feedback error';
            emailInput.focus();
            return;
        }

        newsletterFeedback.textContent = 'Thanks for subscribing to the ElevenShop weekly.';
        newsletterFeedback.className = 'form-feedback success';
        newsletterForm.reset();
    });
}

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems || !emptyCart || !cartContent || !cartSubtotal || !cartShipping || !cartTotal) {
        return;
    }

    const cart = getCart();
    cartItems.innerHTML = '';
    emptyCart.hidden = cart.length > 0;
    cartContent.hidden = cart.length === 0;

    if (cart.length === 0) {
        return;
    }

    let subtotal = 0;
    cart.forEach((product) => {
        subtotal += product.price * product.quantity;
        const item = document.createElement('article');
        item.className = 'cart-item';
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="cart-item-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <strong>${formatCurrency(product.price)}</strong>
            </div>
            <div class="cart-item-actions">
                <label for="quantity-${product.id}">Quantity</label>
                <input id="quantity-${product.id}" class="cart-quantity" type="number" min="1" value="${product.quantity}" data-product-id="${product.id}">
                <button class="remove-cart-btn" type="button" data-product-id="${product.id}">Remove</button>
            </div>`;
        cartItems.appendChild(item);
    });

    const shipping = subtotal >= 75 ? 0 : 7.99;
    cartSubtotal.textContent = formatCurrency(subtotal);
    cartShipping.textContent = shipping === 0 ? 'Free' : formatCurrency(shipping);
    cartTotal.textContent = formatCurrency(subtotal + shipping);

    cartItems.querySelectorAll('.cart-quantity').forEach((input) => {
        input.addEventListener('change', () => {
            const cart = getCart();
            const product = cart.find((item) => item.id === Number(input.dataset.productId));
            if (!product) {
                return;
            }
            product.quantity = Math.max(1, Number(input.value) || 1);
            saveCart(cart);
            updateCartCount();
            renderCart();
        });
    });

    cartItems.querySelectorAll('.remove-cart-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const cart = getCart().filter((item) => item.id !== Number(button.dataset.productId));
            saveCart(cart);
            updateCartCount();
            renderCart();
        });
    });
}

function setupCartActions() {
    const clearCartButton = document.getElementById('clearCart');

    if (!clearCartButton) {
        return;
    }

    clearCartButton.addEventListener('click', () => {
        saveCart([]);
        updateCartCount();
        renderCart();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupProductActions();
    setupNewsletter();
    renderCart();
    setupCartActions();
});
