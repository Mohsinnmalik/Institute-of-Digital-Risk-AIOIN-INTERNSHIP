document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Custom Smooth Scrolling (Vanilla JS alternative to Lenis for extreme smoothness) --- */
    // A lightweight lerp logic for the smooth scroll feel
    let scrollY = window.scrollY;
    let targetY = window.scrollY;
    const scrollEase = 0.08;
    
    // We only apply this to wheel events, using native scroll bars for precision
    // Actually, modern browsers do smooth scrolling well. Let's create an elegant
    // scroll-based animation engine instead of overriding native scroll height which 
    // can be buggy without a library.

    /* --- 2. Advanced Intersection Observer for Reveal Animations --- */
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealElements = document.querySelectorAll('.js-reveal');
    
    // Apply initial state classes based on element type
    revealElements.forEach(el => {
        if (el.classList.contains('mask-reveal') || el.classList.contains('window-slide-up') || el.classList.contains('stagger-children')) {
            // Let specific classes handle their own initial states defined in CSS
        } else if (!el.classList.contains('fade-in-up')) {
            el.classList.add('fade-in-up'); // Fallback reveal animation
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Trigger immediately for elements in view on load, especially hero
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .js-reveal');
        heroElements.forEach(el => el.classList.add('reveal-visible'));
    }, 100);

    /* --- 3. Dynamic Navbar & Scroll Progress --- */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Navbar Scrolled State
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Dark theme navbar logic if over dark section
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            // If the section is a dark section and is currently under the header
            if (sec.classList.contains('bg-dark') || sec.classList.contains('bg-black')) {
                if(rect.top <= 80 && rect.bottom >= 80) {
                    navbar.classList.add('dark-mode');
                } else if(rect.top > 80 || rect.bottom < 80) {
                    // Check if another dark section took over in actual implementation
                }
            } else {
                if(rect.top <= 80 && rect.bottom >= 80) {
                    navbar.classList.remove('dark-mode');
                }
            }
        });
    });

    /* --- 4. Interactive Scroll Timeline (Time Scrolling) --- */
    const servicesSection = document.getElementById('services');
    const timelineProgress = document.getElementById('timelineProgress');
    const tSteps = document.querySelectorAll('.t-step');
    const pillarCards = document.querySelectorAll('.pillar-card');

    if (servicesSection && timelineProgress) {
        window.addEventListener('scroll', () => {
            const rect = servicesSection.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Calculate how far we scrolled through the highly visible part of the section
            // Start when top hits middle of screen, end when bottom hits middle
            const startScroll = rect.top - (viewHeight / 2);
            const scrollDistance = rect.height;
            
            let percentage = (Math.abs(Math.min(0, startScroll)) / (scrollDistance * 0.8)) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            
            timelineProgress.style.width = `${percentage}%`;

            // Activate steps based on percentage
            tSteps.forEach((step, index) => {
                const threshold = (index / (tSteps.length - 1)) * 100;
                if (percentage >= threshold - 5) { // Add active
                    step.classList.add('active');
                    // Sync card highlighting
                    if (index < pillarCards.length) {
                        pillarCards.forEach(c => c.classList.remove('highlighted'));
                        pillarCards[index].classList.add('highlighted');
                    }
                } else {
                    step.classList.remove('active');
                }
            });
        });
    }

    /* --- 5. Mouse Magnetic Buttons --- */
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle move limited to 15px max
            const pushX = (x / rect.width) * 15;
            const pushY = (y / rect.height) * 15;
            
            btn.style.transform = `translate(${pushX}px, ${pushY}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    /* --- 6. Form Handling with loader --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            
            btn.classList.add('loading');
            btn.disabled = true;
            
            setTimeout(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                alert('Success! Your structured data has been received.');
                contactForm.reset();
            }, 1500);
        });
    }

    /* --- 7. Minimal Vanilla Smooth Scroll for Links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- 8. Parallax Effects --- */
    const parallaxContainers = document.querySelectorAll('.js-parallax');
    window.addEventListener('scroll', () => {
        const scrollOffset = window.scrollY;
        parallaxContainers.forEach(container => {
            container.style.transform = `translateY(${scrollOffset * 0.4}px)`;
        });
    });

    /* --- 9. Mobile Menu Toggle --- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('open');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a, .nav-btn').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('open');
                navMenu.classList.remove('active');
            });
        });
    }

    /* --- 10. Dynamic Footer Year --- */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* --- 11. Hero Countdown Timer Effect --- */
    // Create a fixed future date (e.g., 14 days from now) for the cinematic launch effect
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 14);
    launchDate.setHours(launchDate.getHours() + 8);
    const targetTime = launchDate.getTime();

    const dEl = document.getElementById('t-days');
    const hEl = document.getElementById('t-hours');
    const mEl = document.getElementById('t-mins');
    const sEl = document.getElementById('t-secs');

    if (dEl && hEl && mEl && sEl) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance < 0) {
                clearInterval(timerInterval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            dEl.textContent = days.toString().padStart(2, '0');
            hEl.textContent = hours.toString().padStart(2, '0');
            mEl.textContent = minutes.toString().padStart(2, '0');
            sEl.textContent = seconds.toString().padStart(2, '0');
        };

        // Initial call
        updateCountdown();
        // Update every second
        const timerInterval = setInterval(updateCountdown, 1000);
    }
});