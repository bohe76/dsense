import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Thinking } from './components/Thinking';
import { ProjectList } from './components/ProjectList';
import { Contact } from './components/Contact';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
(window as any).lenis = lenis;

// Header is now created outside of #app so we don't need appElement here anymore
// const appElement = document.getElementById('app'); 
const blurFilter = document.querySelector('#vertical-blur feGaussianBlur');
// Select the project grid container dynamically (after it's rendered) or check inside the loop
// Since components are rendered later, we might need to select it inside 'scroll' or wait.
// But 'scroll' events are frequent, so let's try to cache it if possible, or select efficiently.
// Given the structure, ProjectList renders into #projects-container.
// We will select it inside the scroll handler for safety, as it might be re-rendered.
// Actually, to avoid querySelector every frame, let's look it up once if null.

let projectGrid: HTMLElement | null = null;

lenis.on('scroll', (e: any) => {
  if (!projectGrid) {
    projectGrid = document.querySelector('.project-grid-3col') as HTMLElement;
  }

  if (blurFilter) {
    // Only apply blur if Filter Auto-Scroll is active
    if (!(window as any).isFilterScrolling) {
      // Clear filter when not auto-scrolling
      blurFilter.setAttribute('stdDeviation', '0 0');
      if (projectGrid) projectGrid.style.filter = 'none';
      return;
    }

    // Blur intensity based on velocity
    const velocity = Math.abs(e.velocity);
    const blurAmount = Math.min(velocity * 0.15, 5); // Reduced intensity for performance

    if (blurAmount > 0.1) {
      blurFilter.setAttribute('stdDeviation', `0 ${blurAmount}`);
      if (projectGrid) projectGrid.style.filter = "url('#vertical-blur')";
    } else {
      blurFilter.setAttribute('stdDeviation', '0 0');
      if (projectGrid) projectGrid.style.filter = 'none';
    }
  }
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Setup HTML Structure
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  // Header is now created outside of #app in the HTML structure or moved here
  // But to be safe and consistent, we'll prepend it to body or insert before #app
  // Ideally, existing index.html static structure should be used, but since we are injecting:

  // 1. Create Header Container detached from #app
  const headerContainer = document.createElement('header');
  headerContainer.id = 'header-container';
  document.body.prepend(headerContainer); // Place at the very top of body

  // 2. Fill #app with main content
  app.innerHTML = `
    <main>
      <section id="hero-container"></section>
      <section id="about-container"></section>
      <section id="thinking-container"></section>
      <section id="projects-container"></section>
      <section id="contact-container"></section>
    </main>
  `;
}

// Initialize Components
new Header('header-container');
new Hero('hero-container');
new About('about-container');
new Thinking('thinking-container'); // Added Thinking section
new ProjectList('projects-container');
new Contact('contact-container');
// new Cursor();

console.log('DSENSE App Initialized');
