// Global state
let currentUser = null;
let userType = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

// Authentication Functions
function handleStaffLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    // API call to staff login endpoint
    fetch('/api/staff/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            currentUser = credentials.username;
            userType = 'staff';
            showStaffDashboard();
        }
    })
    .catch(error => alert('Login failed'));
}

function handleCustomerLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    fetch('/api/customers/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            currentUser = credentials.username;
            userType = 'customer';
            showCustomerDashboard();
        }
    })
    .catch(error => alert('Login failed'));
}

// Dashboard Functions
function showStaffDashboard() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('staffDashboard').classList.remove('hidden');
    loadStaffDashboard();
}

function showCustomerDashboard() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('customerDashboard').classList.remove('hidden');
    loadAvailableBooks();
}

function loadAvailableBooks() {
    fetch('/api/books', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(books => {
        const bookGrid = document.getElementById('bookGrid');
        bookGrid.innerHTML = '';
        books.forEach(book => {
            bookGrid.appendChild(createBookCard(book));
        });
    });
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <h3>${book.bookName}</h3>
        <p>Author: ${book.author}</p>
        <p>Genre: ${book.genre}</p>
        <p>Price: ₹${book.price}</p>
        <p>Available: ${book.quantity}</p>
        ${userType === 'customer' ? 
            `<button onclick="purchaseBook('${book.bookName}')">Purchase</button>` : 
            `<button onclick="editBook('${book.bookName}')">Edit</button>`}
    `;
    return card;
}

// Additional functionality can be added based on requirements