// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Navigation and scroll handling
const nav = document.querySelector('nav');
const navHeight = nav.offsetHeight;
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.querySelector('.scroll-top');

// Scroll to top button visibility
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    // Add/remove scrolled class to navigation
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Update active navigation link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 10;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Scroll to top functionality
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile menu functionality
const mobileNavToggle = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navbarCollapse && !nav.contains(e.target) && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
    }
});

// Close mobile menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form handling with validation and animation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea');

    // Add floating label animation
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Form submission with validation
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!contactForm.checkValidity()) {
            e.stopPropagation();
            contactForm.classList.add('was-validated');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success mt-3';
            successAlert.role = 'alert';
            successAlert.innerHTML = 'Message sent successfully! I\'ll get back to you soon.';
            contactForm.appendChild(successAlert);
            
            // Reset form
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            formInputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });

            // Remove success message after 5 seconds
            setTimeout(() => {
                successAlert.remove();
            }, 5000);
        } catch (error) {
            // Show error message
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger mt-3';
            errorAlert.role = 'alert';
            errorAlert.innerHTML = 'There was an error sending your message. Please try again.';
            contactForm.appendChild(errorAlert);

            // Remove error message after 5 seconds
            setTimeout(() => {
                errorAlert.remove();
            }, 5000);
        } finally {
            // Reset button state
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Initialize lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Create placeholder SVG
    const createPlaceholder = () => {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E`;
    };

    // Handle image loading
    const loadImage = (img) => {
        if (img.dataset.src) {
            // Create a new image object to preload
            const tempImage = new Image();
            tempImage.onload = () => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            };
            tempImage.src = img.dataset.src;
        }
    };

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = createPlaceholder();
            loadImage(img);
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            img.src = createPlaceholder();
            imageObserver.observe(img);
        });
    }
});
