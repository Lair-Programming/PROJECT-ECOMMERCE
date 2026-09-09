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

    cartCount.textContent = totalQuantity;
    cartLink.setAttribute('aria-label', `Cart with ${totalQuantity} product${totalQuantity === 1 ? '' : 's'}`);
}

function showMessage(message) {
    const toastMessage = document.getElementById('toastMessage');
    const cartToast = document.getElementById('cartToast');
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

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupProductActions();
    setupNewsletter();
});
