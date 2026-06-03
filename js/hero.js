/* ========================================================================
   GIFTAWEB — Hero Section: Parallax & Mouse Tracking
   Makes decorative elements react to mouse movement
   ======================================================================== */

class HeroController {
    constructor() {
        this.heroSection = document.getElementById('hero');
        this.decorations = document.getElementById('hero-decorations');
        this.phoneFrame = document.getElementById('phone-frame');
        this.parallaxItems = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.isMobile = window.innerWidth < 1024;

        if (!this.heroSection) return;

        this.init();
    }

    init() {
        // Collect all parallax items
        const items = document.querySelectorAll('[data-parallax]');
        items.forEach(item => {
            this.parallaxItems.push({
                el: item,
                intensity: parseFloat(item.dataset.parallax) || 0.03,
                currentX: 0,
                currentY: 0,
            });
        });

        if (!this.isMobile) {
            this.bindMouse();
            this.animate();
        }
    }

    bindMouse() {
        this.heroSection.addEventListener('mousemove', (e) => {
            const rect = this.heroSection.getBoundingClientRect();
            // Normalize to -1 to 1
            this.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            this.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        });

        this.heroSection.addEventListener('mouseleave', () => {
            this.targetX = 0;
            this.targetY = 0;
        });
    }

    animate() {
        // Smooth interpolation
        this.mouseX += (this.targetX - this.mouseX) * 0.08;
        this.mouseY += (this.targetY - this.mouseY) * 0.08;

        // Apply parallax to items via CSS custom properties
        for (const item of this.parallaxItems) {
            const moveX = this.mouseX * item.intensity * 300;
            const moveY = this.mouseY * item.intensity * 300;

            // Lerp
            item.currentX += (moveX - item.currentX) * 0.1;
            item.currentY += (moveY - item.currentY) * 0.1;

            item.el.style.setProperty('--parallax-x', item.currentX + 'px');
            item.el.style.setProperty('--parallax-y', item.currentY + 'px');
        }

        // Phone 3D tilt
        if (this.phoneFrame) {
            const tiltX = this.mouseY * -8;
            const tiltY = this.mouseX * 8;
            this.phoneFrame.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.heroController = new HeroController();
});
