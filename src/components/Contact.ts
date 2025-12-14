import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class Contact {
  private element: HTMLElement;

  constructor(targetId: string) {
    const target = document.getElementById(targetId);
    if (!target) throw new Error(`Target element '${targetId}' not found`);
    this.element = target;
    this.render();
    this.initAnimations();
  }

  render() {
    const wrapChars = (text: string) => {
      return text
        .split('')
        .map(
          (char) =>
            `<span class="text-mask"><span class="text-reveal inline-block" style="color: #ffffff;">${char === ' ' ? '&nbsp;' : char}</span></span>`
        )
        .join('');
    };

    const wrapEmailChars = (text: string) => {
      return text
        .split('')
        .map(
          (char) =>
            `<span class="email-char inline-block" style="display:inline-block;">${char}</span>`
        )
        .join('');
    };

    this.element.innerHTML = `
      <div class="container contact-content" style="color: #ffffff;">
        <h2 class="section-title" style="margin-bottom: 4rem; color: #ffffff;">
            <span class="word-start" style="color: #ffffff;">${wrapChars('Start')}</span>
            <span class="word-together" style="color: #ffffff;">${wrapChars('TOGETHER')}</span>
        </h2>
        <div class="relative z-10" style="margin-top: 2rem; color: #ffffff;">
            <h3 class="contact-label" style="color: #ffffff;">Ready to start a project?</h3>
            <a href="mailto:hello@dsense.co.kr" class="contact-email" style="color: #ffffff;">
                ${wrapEmailChars('hello@dsense.co.kr')}
            </a>
        </div>
      </div>
    `;
    this.element.className = 'contact';

    // Force Apply Dark Theme Styles via JS to guarantee visibility
    this.element.style.backgroundColor = '#2C2C2C';
    this.element.style.color = '#ffffff';
    this.element.style.minHeight = '80vh';
    this.element.style.display = 'flex';
    this.element.style.alignItems = 'center';
    this.element.style.padding = '8rem 0';
  }

  initAnimations() {
    const titleChars = this.element.querySelectorAll(
      '.section-title .text-reveal'
    );
    const otherContent = this.element.querySelectorAll('h3, .social-links');
    const emailChars = this.element.querySelectorAll('.email-char');

    // 1. Establish Initial State (Visible by default in CSS, but we hide it via JS for animation)
    // This ensures if JS fails, text remains visible. But if JS runs, we hide it to animate.
    gsap.set(emailChars, { opacity: 0 });

    // 2. Main Timeline (Title & Other Content)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.element,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(titleChars, {
      y: 0,
      opacity: 1,
      duration: 1.4,
      stagger: 0.1,
      ease: 'power4.out',
    }).from(
      otherContent,
      {
        y: 20,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      },
      '-=0.5'
    );

    // 3. Email Animation (Robust Random Logic)
    ScrollTrigger.create({
      trigger: this.element,
      start: 'top 40%',
      onEnter: () => {
        // Ensure fresh random values every time
        // Using fromTo guarantees start/end states, preventing visibility bugs
        gsap.fromTo(
          emailChars,
          {
            x: 0,
            y: () => gsap.utils.random(-30, 30),
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: () => gsap.utils.random(0.6, 0.8),
            ease: 'power1.out',
            stagger: {
              each: 0.05,
              from: 'random',
            },
            overwrite: true,
          }
        );
      },
      onLeaveBack: () => {
        // Instantly hide when leaving to prepare for next entry
        gsap.set(emailChars, { opacity: 0 });
      },
    });
  }
}
