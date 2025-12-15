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

const blurFilter = document.querySelector('#vertical-blur feGaussianBlur');
lenis.on('scroll', (e: any) => {
  if (blurFilter) {
    // Only apply blur if Filter Auto-Scroll is active
    if (!(window as any).isFilterScrolling) {
      blurFilter.setAttribute('stdDeviation', '0 0');
      return;
    }

    // Blur intensity based on velocity
    const velocity = Math.abs(e.velocity);
    const blurAmount = Math.min(velocity * 0.15, 10); // Clamp max blur
    blurFilter.setAttribute('stdDeviation', `0 ${blurAmount}`);
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
  app.innerHTML = `
    <header id="header-container"></header>
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
