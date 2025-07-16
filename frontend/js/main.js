// Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    // Counter animation
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCounter, 1, counter, target, speed);
        } else {
            counter.innerText = target;
        }
    });
    
    function updateCounter(counter, target, speed) {
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCounter, 1, counter, target, speed);
        } else {
            counter.innerText = target;
        }
    }
    
    // Testimonial carousel
    const testimonialCarousel = new bootstrap.Carousel(document.getElementById('testimonialCarousel'), {
        interval: 5000,
        pause: 'hover'
    });
    
    // Donation amount toggle
    const amountRadios = document.querySelectorAll('input[name="donationAmount"]');
    const customAmountContainer = document.getElementById('customAmountContainer');
    
    amountRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                customAmountContainer.style.display = 'block';
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
    
    // Form submission handlers
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Process donation form
            const currentStep = document.querySelector('.donation-step.active');
            const nextStep = currentStep.nextElementSibling;
            
            if (nextStep) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
            } else {
                // Final submission
                document.getElementById('confirmationEmail').textContent = document.getElementById('email').value;
                currentStep.classList.remove('active');
                document.getElementById('step5').style.display = 'block';
            }
        });
    }
    
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Show confirmation message
            volunteerForm.style.display = 'none';
            document.getElementById('confirmationMessage').style.display = 'block';
        });
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Show confirmation message
            contactForm.style.display = 'none';
            document.getElementById('confirmationMessage').style.display = 'block';
        });
    }
    
    // Next/prev step buttons
    const nextButtons = document.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.donation-step');
            const nextStep = currentStep.nextElementSibling;
            
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
        });
    });
    
    const prevButtons = document.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.donation-step');
            const prevStep = currentStep.previousElementSibling;
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
        });
    });
    
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('show');
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
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Volunteer specific JS
document.addEventListener('DOMContentLoaded', function() {
    // Volunteer form specific functionality
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        // Add any volunteer form specific JS here
    }
});

// Contact specific JS
document.addEventListener('DOMContentLoaded', function() {
    // Contact form specific functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add any contact form specific JS here
    }
});

// Dashboard specific JS
document.addEventListener('DOMContentLoaded', function() {
    // Dashboard specific functionality
    const dashboardElements = document.querySelector('.dashboard-content');
    if (dashboardElements) {
        // Add any dashboard specific JS here
    }
});