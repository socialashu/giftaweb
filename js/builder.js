/* ========================================================================
   GIFTAWEB — Interactive Builder Experience
   3-step wizard with magical reveal sequence
   ======================================================================== */

class BuilderExperience {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.selections = {
            audience: null,
            vibe: null,
            palette: null,
        };

        this.stepsContainer = document.getElementById('builder-steps');
        this.revealContainer = document.getElementById('builder-reveal');
        this.progressDots = document.querySelectorAll('.builder-dot');

        if (!this.stepsContainer) return;

        this.init();
    }

    init() {
        this.bindOptionClicks();
        this.bindNavButtons();
        this.bindSwipeGestures();
    }

    // ----- Swipe support on mobile -----
    bindSwipeGestures() {
        const wrapper = document.querySelector('.builder-wrapper');
        if (!wrapper) return;

        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipe = 60;

        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) < minSwipe) return;

            if (diff > 0 && this.currentStep < this.totalSteps) {
                // Swipe left → next step (only if selection made)
                if (this.selections[['audience', 'vibe', 'palette'][this.currentStep - 1]]) {
                    this.goToStep(this.currentStep + 1);
                }
            } else if (diff < 0 && this.currentStep > 1) {
                // Swipe right → previous step
                this.goToStep(this.currentStep - 1);
            }
        }, { passive: true });
    }

    // ----- Option Selection -----
    bindOptionClicks() {
        // Step 1 options
        this.bindStepOptions('step1-options', 'audience', 'step1-next');
        // Step 2 options
        this.bindStepOptions('step2-options', 'vibe', 'step2-next');
        // Step 3 palette options
        this.bindStepOptions('step3-options', 'palette', 'step3-next');
    }

    bindStepOptions(containerId, selectionKey, nextBtnId) {
        const container = document.getElementById(containerId);
        const nextBtn = document.getElementById(nextBtnId);
        if (!container || !nextBtn) return;

        const options = container.querySelectorAll('.builder-option, .palette-option');

        options.forEach(option => {
            option.addEventListener('click', () => {
                // Deselect siblings
                options.forEach(o => o.classList.remove('selected'));
                // Select this one
                option.classList.add('selected');
                // Store selection
                this.selections[selectionKey] = option.dataset.value;
                // Enable next button
                nextBtn.disabled = false;

                // Add a little haptic feedback animation
                option.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    option.style.transform = '';
                }, 150);
            });

            // Keyboard support
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });
    }

    // ----- Navigation -----
    bindNavButtons() {
        // Step 1 next
        const step1Next = document.getElementById('step1-next');
        if (step1Next) {
            step1Next.addEventListener('click', () => this.goToStep(2));
        }

        // Step 2
        const step2Back = document.getElementById('step2-back');
        const step2Next = document.getElementById('step2-next');
        if (step2Back) step2Back.addEventListener('click', () => this.goToStep(1));
        if (step2Next) step2Next.addEventListener('click', () => this.goToStep(3));

        // Step 3
        const step3Back = document.getElementById('step3-back');
        const step3Next = document.getElementById('step3-next');
        if (step3Back) step3Back.addEventListener('click', () => this.goToStep(2));
        if (step3Next) step3Next.addEventListener('click', () => this.startMagicalReveal());
    }

    goToStep(stepNum) {
        // Hide all steps
        document.querySelectorAll('.builder-step').forEach(s => {
            s.classList.remove('active');
        });

        // Show target step
        const targetStep = document.getElementById(`builder-step-${stepNum}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }

        // Update progress dots
        this.progressDots.forEach(dot => {
            const dotStep = parseInt(dot.dataset.step);
            dot.classList.remove('active', 'completed');
            if (dotStep < stepNum) dot.classList.add('completed');
            if (dotStep === stepNum) dot.classList.add('active');
        });

        this.currentStep = stepNum;

        // Scroll builder into view
        const builderSection = document.getElementById('builder');
        if (builderSection) {
            builderSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // ----- MAGICAL REVEAL SEQUENCE -----
    startMagicalReveal() {
        // Hide steps, show reveal
        this.stepsContainer.style.display = 'none';
        document.querySelector('.builder-progress').style.display = 'none';
        this.revealContainer.classList.add('active');

        // Start sparkles
        this.createSparkles();

        // Phase 1: Magic text sequence
        const magicText = document.getElementById('magic-text');
        const magicSubtext = document.getElementById('magic-subtext');

        const phases = [
            { text: 'Gathering your choices...', sub: 'This is going to be beautiful', delay: 0 },
            { text: 'Mixing colors and vibes...', sub: 'Almost like painting a dream', delay: 1500 },
            { text: 'Adding a sprinkle of magic...', sub: '✨ just a little more ✨', delay: 3000 },
            { text: 'Wrapping it with love...', sub: 'Every pixel, placed with care', delay: 4500 },
        ];

        phases.forEach(phase => {
            setTimeout(() => {
                if (magicText) {
                    magicText.style.opacity = 0;
                    setTimeout(() => {
                        magicText.textContent = phase.text;
                        magicText.style.opacity = 1;
                    }, 300);
                }
                if (magicSubtext) {
                    magicSubtext.style.opacity = 0;
                    setTimeout(() => {
                        magicSubtext.textContent = phase.sub;
                        magicSubtext.style.opacity = 1;
                    }, 300);
                }
            }, phase.delay);
        });

        // Phase 2: Show the result
        setTimeout(() => {
            this.revealPreview();
        }, 6500);
    }

    createSparkles() {
        const container = document.getElementById('reveal-sparkles');
        if (!container) return;

        const sparkleChars = ['✨', '💕', '🌸', '⭐', '💖', '✦', '♥'];

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const spark = document.createElement('span');
                spark.className = 'sparkle-particle';
                spark.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
                spark.style.left = Math.random() * 100 + '%';
                spark.style.top = Math.random() * 100 + '%';
                spark.style.animationDelay = Math.random() * 2 + 's';
                spark.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
                spark.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
                container.appendChild(spark);

                // Cleanup
                setTimeout(() => spark.remove(), 4000);
            }, Math.random() * 5000);
        }
    }

    revealPreview() {
        const revealMagic = document.getElementById('reveal-magic');
        const revealResult = document.getElementById('reveal-result');

        // Hide magic phase
        if (revealMagic) {
            revealMagic.style.opacity = 0;
            revealMagic.style.transform = 'scale(0.9)';
            revealMagic.style.transition = 'all 0.6s var(--ease-smooth)';
            setTimeout(() => revealMagic.style.display = 'none', 600);
        }

        // Apply selections to preview
        this.applySelectionsToPreview();

        // Show result with animation
        setTimeout(() => {
            if (revealResult) {
                revealResult.classList.add('show');
            }

            // Animate preview elements one by one
            const elements = document.querySelectorAll('#reveal-result .preview-element');
            elements.forEach((el, i) => {
                setTimeout(() => el.classList.add('show'), 300 + i * 400);
            });

            // Typewriter effect for title
            setTimeout(() => {
                const titleEl = document.getElementById('preview-title');
                if (titleEl) {
                    titleEl.style.width = '0';
                    titleEl.style.animation = 'typewriter 1.5s steps(30) forwards, blinkCursor 0.8s step-end 3';
                    setTimeout(() => {
                        titleEl.classList.add('typed');
                    }, 2000);
                }
            }, 800);

        }, 800);
    }

    applySelectionsToPreview() {
        const previewContent = document.getElementById('preview-content');
        const previewTitle = document.getElementById('preview-title');
        const previewBtn = document.getElementById('preview-btn');

        // Set title based on audience
        const titles = {
            partner: 'A Love Story ♥',
            business: 'Welcome to Your Brand',
            event: 'You\'re Invited! 🎉',
        };

        if (previewTitle) {
            previewTitle.textContent = titles[this.selections.audience] || 'Your Experience';
        }

        // Set button text
        const btnTexts = {
            partner: 'Open With Love',
            business: 'Explore',
            event: 'Join the Celebration',
        };

        if (previewBtn) {
            previewBtn.textContent = btnTexts[this.selections.audience] || 'Open Your Gift';
        }

        // Apply color palette to preview
        const palettes = {
            sunset: { bg: 'linear-gradient(135deg, #FFF8F0, #FFE8EE)', accent: '#E8567F', btnBg: '#E8567F' },
            ocean: { bg: 'linear-gradient(135deg, #F0F7EE, #B8E8FC)', accent: '#4A90D9', btnBg: '#4A90D9' },
            midnight: { bg: 'linear-gradient(135deg, #2D1B30, #3D2040)', accent: '#F2C572', btnBg: '#E8567F' },
            lavender: { bg: 'linear-gradient(135deg, #FFFAFC, #E8D5F5)', accent: '#9B6FCF', btnBg: '#9B6FCF' },
            garden: { bg: 'linear-gradient(135deg, #F0F7EE, #D4F0E7)', accent: '#5A9E78', btnBg: '#5A9E78' },
        };

        const palette = palettes[this.selections.palette] || palettes.sunset;

        if (previewContent) {
            previewContent.style.background = palette.bg;
        }

        if (previewBtn) {
            previewBtn.style.background = palette.btnBg;
        }

        // Update polaroid mini-images based on palette
        const polaroids = document.querySelectorAll('#preview-polaroids .mini-img');
        const miniColors = {
            sunset: ['#FFD6E0', '#FFECD2', '#E8D5F5'],
            ocean: ['#89CFF0', '#B8E8FC', '#CDE8E5'],
            midnight: ['#E8567F', '#F2C572', '#B8A9E8'],
            lavender: ['#B8A9E8', '#E8D5F5', '#FFD6E0'],
            garden: ['#A8D5BA', '#D4F0E7', '#FFECD2'],
        };

        const colors = miniColors[this.selections.palette] || miniColors.sunset;
        polaroids.forEach((p, i) => {
            p.style.background = colors[i] || colors[0];
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.builderExperience = new BuilderExperience();
});
