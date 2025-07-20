document.addEventListener('DOMContentLoaded', function() {

  // --- 1. NAVBAR SCROLL EFFECT ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

  // --- 2. IMPACT COUNTER ANIMATION ON SCROLL ---
  const counterSection = document.querySelector('#impact-counter');
  if (counterSection) {
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200; // Lower number is faster

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(counter => {
            const animate = () => {
              const target = +counter.getAttribute('data-target');
              const current = +counter.innerText;
              const increment = Math.ceil(target / speed);

              if (current < target) {
                counter.innerText = Math.min(current + increment, target);
                requestAnimationFrame(animate);
              } else {
                counter.innerText = target;
              }
            };
            animate();
          });
          observer.unobserve(counterSection); // Stop observing after animation
        }
      });
    }, {
      threshold: 0.5 // Trigger when 50% of the element is visible
    });

    observer.observe(counterSection);
  }

  // --- 3. CAMPAIGN COUNTDOWN TIMER ---
  const countdownTimer = document.getElementById('countdown-timer');
  if (countdownTimer) {
    // IMPORTANT: Update this date for your specific campaign!
    // Format: "Month Day, Year HH:MM:SS"
    const campaignEndDate = new Date("March 30, 2026 00:00:00").getTime();

    const updateCountdown = setInterval(function() {
      const now = new Date().getTime();
      const distance = campaignEndDate - now;

      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update HTML elements
      document.getElementById('days').innerText = days;
      document.getElementById('hours').innerText = hours;
      document.getElementById('minutes').innerText = minutes;
      document.getElementById('seconds').innerText = seconds;

      // If the countdown is over, display a message
      if (distance < 0) {
        clearInterval(updateCountdown);
        countdownTimer.innerHTML = "<div class='text-center w-100'>This campaign has ended. Thank you for your support!</div>";
      }
    }, 1000);
  }

});