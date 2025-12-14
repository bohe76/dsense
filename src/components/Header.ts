import { gsap } from "gsap";

export class Header {
  private element: HTMLElement;

  constructor(targetId: string) {
    const target = document.getElementById(targetId);
    if (!target) throw new Error(`Target element '${targetId}' not found`);
    this.element = target;
    this.render();
    this.initAnimations();
  }

  render() {
    this.element.innerHTML = `
      <div class="container header-inner">
        <a href="#" class="logo mix-difference">
          DSENSE
        </a>
        
        <!-- Desktop Nav -->
        <nav class="desktop-nav">
          <ul class="nav-list">
            <li><a href="#about-container" class="nav-link mix-difference">About</a></li>
            <li><a href="#thinking-container" class="nav-link mix-difference">Thinking</a></li>
            <li><a href="#projects-container" class="nav-link mix-difference">Work</a></li>
            <li><a href="#contact-container" class="nav-link mix-difference">Contact</a></li>
          </ul>
        </nav>

        <!-- Mobile Menu Button (SVG) -->
        <button class="mobile-menu-btn mix-difference" aria-label="Toggle Menu">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
             <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
             <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
           </svg>
        </button>

        <!-- Mobile Menu Overlay -->
        <div class="mobile-menu-overlay">
           <button class="mobile-menu-close" aria-label="Close Menu">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
           </button>
           <ul class="mobile-nav-list">
             <li><a href="#about-container" class="mobile-nav-link">About</a></li>
             <li><a href="#thinking-container" class="mobile-nav-link">Thinking</a></li>
             <li><a href="#projects-container" class="mobile-nav-link">Work</a></li>
             <li><a href="#contact-container" class="mobile-nav-link">Contact</a></li>
           </ul>
        </div>
      </div>
    `;
    this.element.className = "header";
  }

  initAnimations() {
    // Scroll listener
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.element.classList.add('scrolled');
      } else {
        this.element.classList.remove('scrolled');
      }
    });

    // Intro animation
    const navItems = this.element.querySelectorAll(".logo, .nav-link");
    gsap.set(navItems, { y: -20, opacity: 0 }); // Ensure hidden initially

    gsap.to(navItems, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2
    });

    // Mobile Menu Logic
    const menuBtn = this.element.querySelector('.mobile-menu-btn');
    const closeBtn = this.element.querySelector('.mobile-menu-close');
    const overlay = this.element.querySelector('.mobile-menu-overlay');
    const navList = this.element.querySelector('.mobile-nav-list') as HTMLElement;
    const mobileLinks = this.element.querySelectorAll('.mobile-nav-link');

    if (menuBtn && overlay && closeBtn && navList) {
      document.body.appendChild(overlay);

      const tl = gsap.timeline({ paused: true });
      const mask = { value: 0 };

      const updateMask = () => {
        const size = mask.value;
        // Radial gradient mask: starts at top-left (10% 10%)
        // Increased feather for smoother gradient
        const gradient = `radial-gradient(circle at 10% 10%, black ${size}%, transparent ${size + 40}%)`;
        navList.style.webkitMaskImage = gradient;
        navList.style.maskImage = gradient;
      };

      // Initial clear state
      gsap.set(navList, { opacity: 1 }); // Ensure opacity is full
      updateMask(); // Expand to 0% (hidden)

      // 1. Overlay Fade In
      tl.to(overlay, {
        display: 'flex',
        opacity: 1,
        duration: 0.1
      })
        // 2. Gradient Mask Reveal (Direct JS Control)
        .to(mask, {
          value: 150,
          duration: 3,
          ease: "power1.out",
          onUpdate: updateMask
        });

      menuBtn.addEventListener('click', () => {
        tl.restart();
      });

      const closeMenu = () => {
        // Reset immediately to start (hidden state)
        tl.progress(0).pause();
      };

      closeBtn.addEventListener('click', closeMenu);
      mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    }
  }
}
