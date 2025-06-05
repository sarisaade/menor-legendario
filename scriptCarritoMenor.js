document.addEventListener('DOMContentLoaded', initCarritoMenor);

function initCarritoMenor() {
    displayCartMenor();
    updateCartCountMenor();

    document.querySelectorAll('.add-to-cart-menor').forEach(button => {
        button.addEventListener('click', function(event) {
            const productId = parseInt(this.getAttribute('data-id'));
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productTalle = document.querySelector(`#talle-${productId}`).value;
            const productQuantity = parseInt(document.querySelector(`#cantidad-${productId}`).value);

            if (productTalle && productQuantity > 0) {
                addToCartMenor(productId, productName, productPrice, productTalle, productQuantity);
                updateCartIndicator();
            } else {
                alert("Selecciona un talle y una cantidad válida.");
            }
        });
    });

    document.querySelector('.clear-cart-menor').addEventListener('click', () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        localStorage.removeItem('cart_menor');
        localStorage.setItem("cartCountMenor", 0);
        updateCartCountMenor();
        displayCartMenor();
    }
});

document.getElementById('confirmar-carrito-menor-btn').addEventListener('click', confirmPurchaseMenor);

// **Agregar producto al carrito**
function addToCartMenor(productId, productName, productPrice, productTalle, productQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart_menor')) || [];
    const product = { id: productId, name: productName, price: productPrice, talle: productTalle, quantity: productQuantity };

    const existingProduct = cart.find(item => item.id === productId && item.talle === productTalle);
    if (existingProduct) {
        existingProduct.quantity += productQuantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart_menor', JSON.stringify(cart));
    updateCartCountMenor();
    displayCartMenor();
}

// **Mostrar carrito**
function displayCartMenor() {
    const cart = JSON.parse(localStorage.getItem('cart_menor')) || [];
    const cartContainer = document.querySelector('.cart-items-menor');
    cartContainer.innerHTML = '';

    cart.forEach(product => {
        const listItem = document.createElement('div');
        listItem.classList.add('cart-item-menor');
        listItem.innerHTML = `
            <p>${product.quantity} x ${product.name} (Talle: ${product.talle}) - Precio: $${(product.price * product.quantity).toFixed(2)}</p>
        `;
        cartContainer.appendChild(listItem);
    });

    updateCartTotalMenor();
}

// **Actualizar total del carrito**
function updateCartTotalMenor() {
    const cart = JSON.parse(localStorage.getItem('cart_menor')) || [];
    const cartTotal = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    document.querySelector('.cart-total-menor').textContent = cartTotal.toFixed(2);
}

// **Actualizar contador**
function updateCartCountMenor() {
    let totalCount = JSON.parse(localStorage.getItem('cart_menor'))?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    document.querySelectorAll(".cart-count-menor").forEach(el => el.textContent = totalCount);
}

// **Confirmar compra sin interferencias del sitio mayorista**
function confirmPurchaseMenor() {
    const buyerName = document.getElementById('buyer-name').value.trim();
    const buyerPhone = document.getElementById('buyer-phone').value.trim();
    const buyerEmail = document.getElementById('buyer-email').value.trim();
    const cart = JSON.parse(localStorage.getItem('cart_menor')) || [];

    if (!buyerName || !buyerPhone || !buyerEmail || cart.length === 0) {
        alert("Por favor, completa todos los campos y agrega al menos un producto al carrito antes de confirmar la compra.");
        return;
    }

    let cartDetails = `Detalles del Carrito:\n`;
    cart.forEach(product => {
        cartDetails += `${product.quantity} x ${product.name} (Talle: ${product.talle}) - Precio: $${(product.price * product.quantity).toFixed(2)}\n`;
    });

    setTimeout(() => {
        const message = `Hola, soy ${buyerName}. Quiero comprar.\nTeléfono: ${buyerPhone}\nEmail: ${buyerEmail}\n${cartDetails}`;
        const encodedMessage = encodeURIComponent(message);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const whatsappURL = isMobile 
            ? `https://api.whatsapp.com/send?phone=5491154511489&text=${encodedMessage}` 
            : `https://web.whatsapp.com/send?phone=5491154511489&text=${encodedMessage}`;

        window.location.href = whatsappURL;
    }, 2000);

    localStorage.removeItem('cart_menor');
    updateCartCountMenor();
    displayCartMenor();
}
