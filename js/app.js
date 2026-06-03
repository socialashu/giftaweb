/* ========================================================================
   GIFTAWEB — Main App Controller
   Navigation, preloader, scroll progress, smooth scrolling
   ======================================================================== */

class GiftawebApp {
    constructor() {
        this.nav = document.getElementById('main-nav');
        this.navToggle = document.getElementById('nav-toggle');
        this.mobileOverlay = document.getElementById('mobile-nav-overlay');
        this.progressFill = document.getElementById('scroll-progress-fill');
        this.preloader = document.getElementById('preloader');

        this.init();
    }

    init() {
        this.setupPreloader();
        this.setupNavigation();
        this.setupScrollProgress();
        this.setupSmoothScrolling();
        this.setupActiveNav();
        this.setupDynamicYear();
    }

    // ----- Preloader -----
    setupPreloader() {
        if (!this.preloader) return;

        // Prevent scrolling during preloader
        document.body.style.overflow = 'hidden';

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.preloader.classList.add('hidden');
                // Enable body scroll after preloader
                document.body.style.overflow = '';
            }, 2200);
        });

        // Fallback — hide preloader after 4 seconds no matter what
        setTimeout(() => {
            if (this.preloader) {
                this.preloader.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }, 4000);
    }

    // ----- Navigation -----
    setupNavigation() {
        // Scroll state
        let lastScroll = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;

                    // Add scrolled class
                    if (scrollY > 50) {
                        this.nav.classList.add('scrolled');
                    } else {
                        this.nav.classList.remove('scrolled');
                    }

                    lastScroll = scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Mobile toggle
        if (this.navToggle && this.mobileOverlay) {
            this.navToggle.addEventListener('click', () => {
                this.navToggle.classList.toggle('active');
                this.mobileOverlay.classList.toggle('active');

                // Prevent body scroll
                if (this.mobileOverlay.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close on link click
            const mobileLinks = this.mobileOverlay.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.navToggle.classList.remove('active');
                    this.mobileOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // ----- Scroll Progress -----
    setupScrollProgress() {
        if (!this.progressFill) return;

        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = (window.scrollY / scrollHeight) * 100;
                this.progressFill.style.width = scrolled + '%';
            });
        }, { passive: true });
    }

    // ----- Smooth Scrolling for anchor links -----
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();

                    const navHeight = this.nav ? this.nav.offsetHeight : 60;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ----- Active Nav Link on Scroll -----
    setupActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[data-section]');

        if (sections.length === 0 || navLinks.length === 0) return;

        const options = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.dataset.section === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, options);

        sections.forEach(section => observer.observe(section));
    }

    // ----- Dynamic Footer Year -----
    setupDynamicYear() {
        const yearEl = document.getElementById('footer-year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.giftawebApp = new GiftawebApp();
});
