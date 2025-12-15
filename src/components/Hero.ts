import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FluidBackground } from './FluidBackground';

gsap.registerPlugin(ScrollTrigger);

export class Hero {
  private element: HTMLElement;
  private fluidBg: FluidBackground | null = null;

  constructor(targetId: string) {
    const target = document.getElementById(targetId);
    if (!target) throw new Error(`Target element '${targetId}' not found`);
    this.element = target;
    this.render();

    // Defer initialization slightly to ensure layout
    requestAnimationFrame(() => {
      this.initAnimations();
    });
  }

  render() {
    const wrapChars = (text: string) => {
      return text
        .split('')
        .map(
          (char) =>
            `<span class="text-mask"><span class="text-reveal inline-block">${char === ' ' ? '&nbsp;' : char}</span></span>`
        )
        .join('');
    };

    // Removed .hero-image, FluidBackground will be appended to .hero-bg
    this.element.innerHTML = `
      <div class="hero-content">
        <h2 class="hero-title">
          <span class="word-different">
             <span class="highlight-d text-mask"><span class="text-reveal">D</span></span>${wrapChars('ifferent')}
          </span>
          <br>
          <span class="word-sense">
            ${wrapChars('SENSE')}
          </span>
        </h2>
        <p class="hero-subtitle">
          Experience Design Agency
        </p>
      </div>
      <div class="hero-bg" style="opacity: 0;"></div> 
    `;
    this.element.className = 'hero';
  }

  initAnimations() {
    // 0. Initialize Fluid Background
    const bgContainer = this.element.querySelector('.hero-bg') as HTMLElement;
    if (bgContainer) {
      this.fluidBg = new FluidBackground(bgContainer);
      this.fluidBg.animate();
    }

    // High-End Cinematic Entrance
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // 1. Text Reveal (Staggered Chars/Words)
    const reveals = this.element.querySelectorAll('.text-reveal');

    tl.to(reveals, {
      y: 0,
      opacity: 1,
      duration: 1.4,
      stagger: 0.1, // Adjusted to 0.08 as requested
      delay: 0.2,
    })
      .to(
        this.element.querySelector('.hero-subtitle'),
        {
          y: 0,
          opacity: 0.8,
          duration: 1.6,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', // Reveal fully
        },
        '-=1.5'
      )
      .to( // Create customized Fade-In for Fluid Canvas
        bgContainer,
        {
          opacity: 1, // Fluid might be bright, maybe 0.8? Using 1 for full effect.
          duration: 2.5,
          ease: 'power2.out',
        },
        '-=2'
      );

    // Parallax effect on scroll
    gsap.to(this.element.querySelector('.hero-content'), {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: this.element,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}
