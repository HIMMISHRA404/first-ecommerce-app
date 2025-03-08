// Global variables
let products = [];
let cart = [];
let currentPage = 1;
const productsPerPage = 8;
let currentCategory = null;
let currentSort = 'default';
let isMobile = window.innerWidth < 640;

// DOM Elements
const featuredProductsContainer = document.getElementById('featured-products');
const productsContainer = document.getElementById('products-container');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const loadMoreBtn = document.getElementById('load-more');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const overlay = document.getElementById('overlay');
const productModal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const confirmationModal = document.getElementById('confirmation-modal');
const continueShoppingBtn = document.getElementById('continue-shopping');
const shopNowBtn = document.getElementById('shop-now-btn');
const allProductsLink = document.getElementById('all-products');
const categoryLinks = document.querySelectorAll('[data-category]');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if device is mobile
    checkDeviceSize();
    
    // Load products from API
    fetchProducts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load cart from localStorage
    loadCart();
});

// Check device size
function checkDeviceSize() {
    isMobile = window.innerWidth < 640;
    
    // Adjust UI based on device size
    if (isMobile) {
        // Mobile-specific adjustments
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.add('mobile-card');
        });
    } else {
        // Desktop-specific adjustments
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('mobile-card');
        });
    }
}

// Fetch products from FakeStore API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        products = await response.json();
        
        // Display featured products (random selection)
        displayFeaturedProducts();
        
        // Display all products
        displayProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        showToast('Failed to load products. Please try again later.', 'error');
    }
}

// Display featured products
function displayFeaturedProducts() {
    // Clear loading placeholders
    featuredProductsContainer.innerHTML = '';
    
    // Get 4 random products for featured section
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 4);
    
    featured.forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsContainer.appendChild(productCard);
    });
}

// Display products with pagination, filtering and sorting
function displayProducts() {
    // Clear loading placeholders
    productsContainer.innerHTML = '';
    
    // Filter products by category if needed
    let filteredProducts = products;
    if (currentCategory) {
        filteredProducts = products.filter(product => product.category === currentCategory);
    }
    
    // Sort products
    filteredProducts = sortProducts(filteredProducts, currentSort);
    
    // Paginate products
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Create product cards
    paginatedProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Hide "Load More" button if all products are displayed
    if (endIndex >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Create a product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow product-card';
    if (isMobile) {
        card.classList.add('mobile-card');
    }
    
    // Check if product is on sale (random for demo purposes)
    const isOnSale = Math.random() > 0.7;
    const salePrice = isOnSale ? (product.price * 0.8).toFixed(2) : null;
    
    // Truncate title for mobile
    const titleLength = isMobile ? 40 : 60;
    const truncatedTitle = product.title.length > titleLength ? 
        product.title.substring(0, titleLength) + '...' : 
        product.title;
    
    card.innerHTML = `
        <div class="relative">
            ${isOnSale ? `<div class="sale-badge">SALE</div>` : ''}
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="w-full h-40 sm:h-48 object-contain p-4 product-image">
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-sm sm:text-lg font-semibold mb-2 truncate" title="${product.title}">${truncatedTitle}</h3>
            <div class="flex items-center mb-2">
                <div class="flex text-yellow-400 mr-2 star-rating text-sm sm:text-base">
                    ${generateStarRating(product.rating.rate)}
                </div>
                <span class="text-gray-500 text-xs sm:text-sm">(${product.rating.count})</span>
            </div>
            <div class="flex justify-between items-center">
                <div>
                    ${isOnSale ? 
                        `<span class="text-gray-500 line-through mr-2 text-xs sm:text-sm">$${product.price.toFixed(2)}</span>
                         <span class="text-red-600 font-bold text-sm sm:text-base">$${salePrice}</span>` 
                        : 
                        `<span class="text-indigo-600 font-bold text-sm sm:text-base">$${product.price.toFixed(2)}</span>`
                    }
                </div>
                <button class="bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-indigo-700 btn-hover-scale add-to-cart-btn text-xs sm:text-sm" 
                        data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    // Add event listener to view product details
    card.addEventListener('click', (e) => {
        // Don't open modal if the add to cart button was clicked
        if (!e.target.classList.contains('add-to-cart-btn')) {
            openProductModal(product);
        }
    });
    
    // Add event listener to add to cart button
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening the modal
        addToCart(product);
        showToast(`${product.title.substring(0, 20)}... added to cart!`);
    });
    
    return card;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Sort products
function sortProducts(products, sortType) {
    const sortedProducts = [...products];
    
    switch (sortType) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        case 'name-desc':
            return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        default:
            return sortedProducts;
    }
}

// Search products
function searchProducts(query) {
    if (!query.trim()) {
        currentCategory = null;
        displayProducts();
        return;
    }
    
    const searchResults = products.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    // Clear products container
    productsContainer.innerHTML = '';
    
    if (searchResults.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500">No products found matching "${query}"</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
    } else {
        searchResults.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
        loadMoreBtn.style.display = 'none';
    }
}

// Add product to cart
function addToCart(product, quantity = 1) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Update cart UI
    updateCartUI();
    
    // Save cart to localStorage
    saveCart();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Update cart UI
    updateCartUI();
    
    // Save cart to localStorage
    saveCart();
}

// Update cart quantity
function updateCartQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity = quantity;
        
        // Remove item if quantity is 0
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        // Update cart UI
        updateCartUI();
        
        // Save cart to localStorage
        saveCart();
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="text-center text-gray-500 py-8">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'flex items-center py-2 border-b cart-item';
            
            // Truncate title based on device
            const titleLimit = isMobile ? 20 : 25;
            const displayTitle = item.title.length > titleLimit ? 
                item.title.substring(0, titleLimit) + '...' : 
                item.title;
            
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mr-2 sm:mr-4">
                <div class="flex-1">
                    <h4 class="text-xs sm:text-sm font-medium">${displayTitle}</h4>
                    <div class="flex items-center mt-1">
                        <button class="decrease-btn text-gray-500 hover:text-gray-700 text-xs sm:text-sm px-2" data-id="${item.id}">-</button>
                        <span class="mx-1 sm:mx-2 text-xs sm:text-sm">${item.quantity}</span>
                        <button class="increase-btn text-gray-500 hover:text-gray-700 text-xs sm:text-sm px-2" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-medium text-xs sm:text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn text-red-500 hover:text-red-700 text-xs sm:text-sm mt-1" data-id="${item.id}">Remove</button>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // Add event listeners to cart item buttons
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-id'));
                const cartItem = cart.find(item => item.id === productId);
                if (cartItem) {
                    updateCartQuantity(productId, cartItem.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-id'));
                const cartItem = cart.find(item => item.id === productId);
                if (cartItem) {
                    updateCartQuantity(productId, cartItem.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-id'));
                removeFromCart(productId);
                showToast('Item removed from cart');
            });
        });
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Update checkout modal totals if it exists
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (checkoutSubtotal && checkoutTotal) {
        checkoutSubtotal.textContent = `$${total.toFixed(2)}`;
        
        // Add shipping cost ($5.99) if cart is not empty
        const shippingCost = cart.length > 0 ? 5.99 : 0;
        checkoutTotal.textContent = `$${(total + shippingCost).toFixed(2)}`;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Open product modal
function openProductModal(product) {
    // Set modal content
    document.getElementById('modal-title').textContent = product.title;
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    
    // Set rating
    document.getElementById('modal-rating').innerHTML = generateStarRating(product.rating.rate);
    document.getElementById('modal-rating-count').textContent = `(${product.rating.count} reviews)`;
    
    // Reset quantity
    document.getElementById('product-quantity').value = 1;
    
    // Add event listener to add to cart button
    const addToCartModalBtn = document.getElementById('add-to-cart-modal');
    
    // Remove previous event listeners
    const newAddToCartBtn = addToCartModalBtn.cloneNode(true);
    addToCartModalBtn.parentNode.replaceChild(newAddToCartBtn, addToCartModalBtn);
    
    // Add new event listener
    newAddToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('product-quantity').value);
        addToCart(product, quantity);
        showToast(`${product.title.substring(0, 20)}... added to cart!`);
        closeProductModal();
    });
    
    // Show modal
    productModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    productModal.classList.add('hidden');
    overlay.classList.add('hidden');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
}

// Open cart sidebar
function openCart() {
    cartSidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    
    // Prevent body scrolling when cart is open
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCartSidebar() {
    cartSidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
}

// Open checkout modal
function openCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    // Update checkout totals
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkout-subtotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${(total + 5.99).toFixed(2)}`;
    
    // Close cart sidebar
    closeCartSidebar();
    
    // Show checkout modal
    checkoutModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

// Close checkout modal
function closeCheckoutModal() {
    checkoutModal.classList.add('hidden');
    overlay.classList.add('hidden');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
}

// Show order confirmation
function showOrderConfirmation() {
    // Generate random order number
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('order-number').textContent = orderNumber;
    
    // Hide checkout modal
    checkoutModal.classList.add('hidden');
    
    // Show confirmation modal
    confirmationModal.classList.remove('hidden');
    
    // Clear cart
    cart = [];
    updateCartUI();
    saveCart();
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'bg-red-600' : 'bg-indigo-600'}`;
    toast.textContent = message;
    
    // Add toast to body
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Window resize event
    window.addEventListener('resize', () => {
        checkDeviceSize();
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
    
    // Close cart button click
    closeCart.addEventListener('click', closeCartSidebar);
    
    // Checkout button click
    checkoutBtn.addEventListener('click', openCheckout);
    
    // Close checkout button click
    closeCheckout.addEventListener('click', closeCheckoutModal);
    
    // Close modal button click
    closeModal.addEventListener('click', closeProductModal);
    
    // Overlay click
    overlay.addEventListener('click', () => {
        closeCartSidebar();
        closeProductModal();
        closeCheckoutModal();
        confirmationModal.classList.add('hidden');
        overlay.classList.add('hidden');
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
    });
    
    // Load more button click
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        displayProducts();
    });
    
    // Sort select change
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        currentPage = 1;
        displayProducts();
    });
    
    // Search button click
    searchButton.addEventListener('click', () => {
        searchProducts(searchInput.value);
    });
    
    // Search input enter key
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchProducts(searchInput.value);
        }
    });
    
    // Checkout form submit
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showOrderConfirmation();
    });
    
    // Continue shopping button click
    continueShoppingBtn.addEventListener('click', () => {
        confirmationModal.classList.add('hidden');
        overlay.classList.add('hidden');
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
    });
    
    // Shop now button click
    shopNowBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.querySelector('section:last-of-type').offsetTop - 100,
            behavior: 'smooth'
        });
    });
    
    // All products link click
    allProductsLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentCategory = null;
        currentPage = 1;
        displayProducts();
        
        // Update active category
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('font-bold');
        });
        allProductsLink.classList.add('font-bold');
    });
    
    // Category links click
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = link.getAttribute('data-category');
            currentPage = 1;
            displayProducts();
            
            // Update active category
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('font-bold');
            });
            link.classList.add('font-bold');
        });
    });
    
    // Quantity buttons in product modal
    document.getElementById('decrease-quantity').addEventListener('click', () => {
        const quantityInput = document.getElementById('product-quantity');
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    document.getElementById('increase-quantity').addEventListener('click', () => {
        const quantityInput = document.getElementById('product-quantity');
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
    
    // Add touch event handling for mobile swipe to close cart
    if ('ontouchstart' in window) {
        let startX;
        let currentX;
        
        cartSidebar.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        cartSidebar.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            
            // Only allow swiping right to close
            if (diffX > 0) {
                cartSidebar.style.transform = `translateX(${diffX}px)`;
            }
        }, { passive: true });
        
        cartSidebar.addEventListener('touchend', () => {
            if (!startX || !currentX) {
                startX = null;
                currentX = null;
                return;
            }
            
            const diffX = currentX - startX;
            
            // If swiped more than 100px, close the cart
            if (diffX > 100) {
                closeCartSidebar();
            } else {
                // Otherwise, reset position
                cartSidebar.style.transform = '';
            }
            
            startX = null;
            currentX = null;
        }, { passive: true });
    }
} 