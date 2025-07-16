document.addEventListener('DOMContentLoaded', function() {
    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simple validation
            if (!email || !password) {
                showAlert('Please fill in all fields', 'danger');
                return;
            }
            
            // Simulate API call
            simulateAuthRequest('login', { email, password, rememberMe })
                .then(response => {
                    if (response.success) {
                        // Store user data in localStorage
                        localStorage.setItem('dreamersAuthToken', response.token);
                        localStorage.setItem('dreamersUser', JSON.stringify(response.user));
                        
                        // Redirect to dashboard
                        window.location.href = 'dashboard.html';
                    } else {
                        showAlert(response.message, 'danger');
                    }
                })
                .catch(error => {
                    showAlert('An error occurred. Please try again.', 'danger');
                    console.error('Login error:', error);
                });
        });
    }
    
    // Registration Form Handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('acceptTerms').checked;
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                showAlert('Please fill in all fields', 'danger');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'danger');
                return;
            }
            
            if (!terms) {
                showAlert('You must accept the terms and conditions', 'danger');
                return;
            }
            
            // Simulate API call
            simulateAuthRequest('register', { name, email, password })
                .then(response => {
                    if (response.success) {
                        showAlert('Registration successful! Please login.', 'success');
                        // Clear form
                        registerForm.reset();
                        // Redirect to login
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 1500);
                    } else {
                        showAlert(response.message, 'danger');
                    }
                })
                .catch(error => {
                    showAlert('An error occurred. Please try again.', 'danger');
                    console.error('Registration error:', error);
                });
        });
    }
    
    // Logout Functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear auth data
            localStorage.removeItem('dreamersAuthToken');
            localStorage.removeItem('dreamersUser');
            
            // Redirect to home
            window.location.href = 'index.html';
        });
    }
    
    // Check authentication status on protected pages
    const protectedPages = ['dashboard.html', 'profile.html'];
    if (protectedPages.includes(window.location.pathname.split('/').pop())) {
        checkAuthStatus();
    }
    
    // Helper Functions
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.auth-container') || document.querySelector('main');
        container.prepend(alertDiv);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }
    
    function checkAuthStatus() {
        const token = localStorage.getItem('dreamersAuthToken');
        if (!token) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        }
    }
    
    function simulateAuthRequest(endpoint, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock responses
                if (endpoint === 'login') {
                    if (data.email === 'test@example.com' && data.password === 'password123') {
                        resolve({
                            success: true,
                            token: 'mock-auth-token-123456',
                            user: {
                                id: 1,
                                name: 'Test User',
                                email: data.email,
                                role: 'donor'
                            },
                            message: 'Login successful'
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Invalid email or password'
                        });
                    }
                } else if (endpoint === 'register') {
                    resolve({
                        success: true,
                        message: 'Registration successful'
                    });
                }
            }, 1000);
        });
    }
    
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});