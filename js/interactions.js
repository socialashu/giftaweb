/* ========================================================================
   GIFTAWEB — Interactions
   Envelope contact, 3D card tilt, scroll reveals
   ======================================================================== */

class InteractionsController {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollReveals();
        this.setupCardTilt();
        this.setupEnvelope();
        this.setupProcessPath();
    }

    // ----- Intersection Observer for Scroll Reveals -----
    setupScrollReveals() {
        const options = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Mark process steps as revealed
                    if (entry.target.classList.contains('process-step')) {
                        entry.target.classList.add('revealed');
                    }
                }
            });
        }, options);

        const elements = document.querySelectorAll(
            '.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scale-in, .stagger-children, .process-step'
        );

        elements.forEach(el => observer.observe(el));
    }

    // ----- 3D Card Tilt on Service Cards -----
    setupCardTilt() {
        const cards = document.querySelectorAll('.service-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 768) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ----- Contact Envelope -----
    setupEnvelope() {
        const envelope = document.getElementById('contact-envelope');
        const letter = document.getElementById('contact-letter');

        if (!envelope || !letter) return;

        let isOpened = false;

        const openEnvelope = () => {
            if (isOpened) return;
            isOpened = true;

            // Add opened class for CSS animations
            envelope.classList.add('opened');

            // Set the date on the letter
            const dateEl = document.getElementById('letter-date');
            if (dateEl) {
                const now = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                dateEl.textContent = now.toLocaleDateString('en-US', options);
            }

            // After envelope animation completes, show letter
            setTimeout(() => {
                // Shrink and fade envelope
                envelope.style.transform = 'scale(0.8)';
                envelope.style.opacity = '0';
                envelope.style.transition = 'all 0.6s var(--ease-smooth)';

                setTimeout(() => {
                    envelope.style.display = 'none';
                    // Show letter with animation (rAF ensures transition triggers)
                    requestAnimationFrame(() => {
                        letter.classList.add('show');
                    });

                    // Trigger confetti
                    this.createConfetti();
                }, 600);
            }, 1000);
        };

        envelope.addEventListener('click', openEnvelope);
        envelope.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEnvelope();
            }
        });
    }

    // ----- Confetti Burst -----
    createConfetti() {
        const container = document.getElementById('contact-confetti');
        if (!container) return;

        const colors = ['#FF8FAB', '#FFD6E0', '#FFECD2', '#E8D5F5', '#FFB3C6', '#F2C572', '#D4F0E7'];
        const shapes = ['circle', 'square', 'heart'];

        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];

            piece.style.backgroundColor = color;
            piece.style.left = (Math.random() * 100) + '%';
            piece.style.top = '-20px';
            piece.style.width = (Math.random() * 8 + 5) + 'px';
            piece.style.height = (Math.random() * 8 + 5) + 'px';
            piece.style.animationDelay = (Math.random() * 1.5) + 's';
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';

            if (shape === 'circle') {
                piece.style.borderRadius = '50%';
            } else if (shape === 'heart') {
                piece.style.backgroundColor = 'transparent';
                piece.textContent = '♥';
                piece.style.color = color;
                piece.style.fontSize = '12px';
                piece.style.width = 'auto';
                piece.style.height = 'auto';
            }

            container.appendChild(piece);

            // Cleanup
            setTimeout(() => piece.remove(), 5000);
        }
    }

    // ----- Process Path Fill on Scroll -----
    setupProcessPath() {
        const pathFill = document.getElementById('process-path-fill');
        const processSection = document.getElementById('process');

        if (!pathFill || !processSection) return;

        const updatePath = () => {
            const rect = processSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight && rect.bottom > 0) {
                const sectionVisible = Math.min(
                    Math.max((windowHeight - rect.top) / (rect.height + windowHeight), 0),
                    1
                );
                pathFill.style.height = (sectionVisible * 100) + '%';
            }
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updatePath);
        }, { passive: true });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.interactionsController = new InteractionsController();
});
