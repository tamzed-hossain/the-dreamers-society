document.addEventListener('DOMContentLoaded', function() {
    // Initialize donation form steps
    const steps = document.querySelectorAll('.donation-step');
    if (steps.length > 0) {
        steps[0].classList.add('active');
    }
    
    // Next/previous step navigation
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.donation-step');
            const nextStep = currentStep.nextElementSibling;
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                
                // Update progress bar
                updateProgressBar();
            }
        });
    });
    
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.donation-step');
            const prevStep = currentStep.previousElementSibling;
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            
            // Update progress bar
            updateProgressBar();
        });
    });
    
    // Custom amount toggle
    const amountRadios = document.querySelectorAll('input[name="donationAmount"]');
    const customAmountContainer = document.getElementById('customAmountContainer');
    
    amountRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                customAmountContainer.style.display = 'block';
                document.getElementById('customAmount').focus();
            } else {
                customAmountContainer.style.display = 'none';
            }
        });
    });
    
    // Dedication toggle
    const dedicationRadios = document.querySelectorAll('input[name="dedication"]');
    const dedicationDetails = document.getElementById('dedicationDetails');
    
    dedicationRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                dedicationDetails.style.display = 'block';
            } else {
                dedicationDetails.style.display = 'none';
            }
        });
    });
    
    // Payment method toggle
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardForm = document.getElementById('creditCardForm');
    const paypalForm = document.getElementById('paypalForm');
    const bankTransferForm = document.getElementById('bankTransferForm');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            creditCardForm.style.display = 'none';
            paypalForm.style.display = 'none';
            bankTransferForm.style.display = 'none';
            
            if (this.value === 'credit-card') {
                creditCardForm.style.display = 'block';
            } else if (this.value === 'paypal') {
                paypalForm.style.display = 'block';
            } else if (this.value === 'bank-transfer') {
                bankTransferForm.style.display = 'block';
            }
        });
    });
    
    // Form submission
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Process donation
            processDonation()
                .then(response => {
                    if (response.success) {
                        // Show confirmation
                        document.getElementById('confirmationEmail').textContent = 
                            document.getElementById('email').value;
                        
                        // Hide all steps
                        document.querySelectorAll('.donation-step').forEach(step => {
                            step.classList.remove('active');
                        });
                        
                        // Show confirmation step
                        document.getElementById('step5').style.display = 'block';
                        
                        // Update donation history if on dashboard
                        if (typeof updateDonationHistory === 'function') {
                            updateDonationHistory();
                        }
                    } else {
                        showDonationError(response.message);
                    }
                })
                .catch(error => {
                    showDonationError('An error occurred. Please try again.');
                    console.error('Donation error:', error);
                });
        });
    }
    
    // Project selector if coming from project page
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    if (projectId) {
        // In a real app, you would highlight the selected project
        console.log('Donating to project:', projectId);
    }
    
    // Helper Functions
    function validateStep(step) {
        const requiredFields = step.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
                
                // Add error message if not already present
                if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'This field is required';
                    field.after(errorDiv);
                }
            } else {
                field.classList.remove('is-invalid');
                const errorDiv = field.nextElementSibling;
                if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                    errorDiv.remove();
                }
                
                // Additional validation for specific fields
                if (field.type === 'email' && !validateEmail(field.value)) {
                    field.classList.add('is-invalid');
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'Please enter a valid email address';
                    field.after(errorDiv);
                    isValid = false;
                }
            }
        });
        
        if (!isValid) {
            // Scroll to first invalid field
            const firstInvalid = step.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }
    
    function updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const currentStep = document.querySelector('.donation-step.active');
            const stepIndex = Array.from(steps).indexOf(currentStep);
            const progressPercent = (stepIndex / (steps.length - 1)) * 100;
            progressBar.style.width = `${progressPercent}%`;
            progressBar.setAttribute('aria-valuenow', progressPercent);
        }
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function processDonation() {
        // Collect form data
        const formData = {
            type: document.querySelector('input[name="donationType"]:checked').value,
            amount: document.querySelector('input[name="donationAmount"]:checked').value === 'other' 
                ? document.getElementById('customAmount').value 
                : document.querySelector('input[name="donationAmount"]:checked').value,
            dedication: document.querySelector('input[name="dedication"]:checked').value === 'yes' ? {
                name: document.querySelector('#dedicationDetails input[type="text"]').value,
                type: document.querySelector('#dedicationDetails select').value,
                message: document.querySelector('#dedicationDetails textarea').value
            } : null,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            paymentDetails: getPaymentDetails(),
            donorInfo: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value
            },
            projectId: new URLSearchParams(window.location.search).get('project'),
            newsletter: document.getElementById('newsletter').checked,
            taxReceipt: document.getElementById('taxReceipt').checked
        };
        
        // Simulate API call
        return simulateDonationRequest(formData);
    }
    
    function getPaymentDetails() {
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        if (method === 'credit-card') {
            return {
                cardNumber: document.getElementById('cardNumber').value,
                cardName: document.getElementById('cardName').value,
                cardExpiry: document.getElementById('cardExpiry').value,
                cardCvv: document.getElementById('cardCvv').value
            };
        } else if (method === 'paypal') {
            return { method: 'paypal' };
        } else if (method === 'bank-transfer') {
            return { method: 'bank-transfer' };
        }
        
        return null;
    }
    
    function simulateDonationRequest(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock response
                resolve({
                    success: true,
                    message: 'Donation processed successfully',
                    donationId: 'DON-' + Math.floor(Math.random() * 1000000),
                    amount: data.amount,
                    date: new Date().toISOString()
                });
            }, 1500);
        });
    }
    
    function showDonationError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const form = document.getElementById('donationForm') || document.querySelector('main');
        form.prepend(alertDiv);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }
});