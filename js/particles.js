/* ========================================================================
   GIFTAWEB — Floating Hearts Particle System
   Dreamy, romantic heart particles that float and respond to mouse
   ======================================================================== */

class HeartParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.isRunning = true;

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    init() {
        // Fewer particles on mobile for performance
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile
            ? Math.min(Math.floor((this.width * this.height) / 40000), 25)
            : Math.min(Math.floor((this.width * this.height) / 20000), 50);

        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        const types = ['heart', 'circle', 'petal'];
        const type = types[Math.floor(Math.random() * types.length)];

        // Romantic color palette
        const colors = [
            { r: 255, g: 143, b: 171 },  // Rose
            { r: 255, g: 179, b: 198 },  // Rose soft
            { r: 255, g: 214, b: 224 },  // Blush
            { r: 255, g: 236, b: 210 },  // Peach
            { r: 232, g: 213, b: 245 },  // Lavender
            { r: 242, g: 197, b: 114 },  // Gold soft
        ];

        const color = colors[Math.floor(Math.random() * colors.length)];

        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 8 + 3,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: -Math.random() * 0.6 - 0.1,
            opacity: Math.random() * 0.35 + 0.05,
            opacityDir: Math.random() > 0.5 ? 1 : -1,
            opacitySpeed: Math.random() * 0.004 + 0.001,
            color: color,
            type: type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.015 + 0.005,
            wobbleRadius: Math.random() * 20 + 8,
        };
    }

    bindEvents() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.resize();
                this.init();
            }, 250);
        });

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        document.addEventListener('visibilitychange', () => {
            this.isRunning = !document.hidden;
            if (this.isRunning) this.animate();
        });
    }

    drawHeart(x, y, size, color, opacity, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;

        const s = size * 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.4);
        this.ctx.bezierCurveTo(-s, -s * 0.4, -s * 1.8, s * 0.6, 0, s * 1.8);
        this.ctx.bezierCurveTo(s * 1.8, s * 0.6, s, -s * 0.4, 0, s * 0.4);
        this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        this.ctx.fill();

        this.ctx.restore();
    }

    drawCircle(x, y, size, color, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;

        // Soft glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Core
        this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 1.5})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawPetal(x, y, size, color, opacity, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;

        const s = size * 0.6;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, s, s * 2, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.7})`;
        this.ctx.fill();

        this.ctx.restore();
    }

    updateParticle(p) {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Opacity breathing
        p.opacity += p.opacityDir * p.opacitySpeed;
        if (p.opacity >= 0.4) p.opacityDir = -1;
        if (p.opacity <= 0.03) p.opacityDir = 1;

        // Wrap
        if (p.y < -30) {
            p.y = this.height + 30;
            p.x = Math.random() * this.width;
        }
        if (p.x < -30) p.x = this.width + 30;
        if (p.x > this.width + 30) p.x = -30;

        // Gentle mouse repulsion
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            const force = (150 - dist) / 150 * 0.03;
            p.x -= dx * force;
            p.y -= dy * force;
        }
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (const p of this.particles) {
            this.updateParticle(p);

            switch (p.type) {
                case 'heart':
                    this.drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
                    break;
                case 'circle':
                    this.drawCircle(p.x, p.y, p.size, p.color, p.opacity);
                    break;
                case 'petal':
                    this.drawPetal(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
                    break;
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.heartParticles = new HeartParticleSystem('particles-canvas');
});
