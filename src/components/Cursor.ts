import { gsap } from "gsap";

export class Cursor {
    private cursor: HTMLElement;
    private follower: HTMLElement;

    constructor() {
        this.cursor = document.createElement('div');
        this.follower = document.createElement('div');

        this.cursor.className = 'cursor-dot';
        this.follower.className = 'cursor-follower';

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.follower);

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            gsap.to(this.cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });

            gsap.to(this.follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5
            });
        });

        // Hover effects
        const links = document.querySelectorAll('a, button, .project-card');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(this.cursor, { scale: 0 });
                gsap.to(this.follower, { scale: 2, backgroundColor: 'rgba(255,255,255,0.2)' });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(this.cursor, { scale: 1 });
                gsap.to(this.follower, { scale: 1, backgroundColor: 'transparent' });
            });
        });
    }
}
