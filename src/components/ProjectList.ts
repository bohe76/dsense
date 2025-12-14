import worksData from '../data/works.json';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WorkItem } from '../types';
import { createProjectCard } from './ProjectCard';
import { VideoModal } from './VideoModal';

export class ProjectList {
  private element: HTMLElement;
  private projects: WorkItem[];
  private videoModal: VideoModal;
  private activeCategories: Set<string>;
  private allCategories: string[];

  constructor(targetId: string) {
    const target = document.getElementById(targetId);
    if (!target) throw new Error(`Target element '${targetId}' not found`);
    this.element = target;
    this.projects = worksData as WorkItem[];
    this.videoModal = new VideoModal();

    // Extract unique categories
    this.allCategories = Array.from(
      new Set(this.projects.map((p) => p.category))
    );
    // Initialize active categories (all enabled by default)
    this.activeCategories = new Set(this.allCategories);

    this.render();
    this.attachEvents();
  }

  render() {
    // Helper to wrap text in masking structure for characters
    const wrapChars = (text: string) => {
      return text
        .split('')
        .map(
          (char) =>
            `<span class="text-mask"><span class="text-reveal inline-block">${char === ' ' ? '&nbsp;' : char}</span></span>`
        )
        .join('');
    };

    // Generate Filter Chips HTML
    const filterHtml = `
      <div class="category-filter-container">
        ${this.allCategories
          .map(
            (cat) => `
          <div class="filter-chip" data-cat="${cat}">
            ${cat}
          </div>
        `
          )
          .join('')}
      </div>
    `;

    this.element.innerHTML = `
      <div class="container projects">
        <div class="section-header" data-scroll data-scroll-speed="0.5">
            <h2 class="section-title">
              <span class="word-selected">${wrapChars('Selected')}</span>
              <span class="word-works">${wrapChars('WORKS')}</span>
            </h2>
            <span class="project-count">/ ${this.projects.length.toString().padStart(2, '0')}</span>
        </div>
        
        <!-- Category Filter -->
        ${filterHtml}
        
        <!-- 3-Column Grid -->
        <div class="project-grid-3col">
          ${this.projects
            .map((work) => {
              // Add a wrapper or inject data-category into the card for easy filtering
              // Since createProjectCard returns a string, we need to ensure the root element has the category
              // We can do this by wrapping or modifying createProjectCard.
              // Currently createProjectCard returns a div with class "work-card group".
              // We'll wrap it or better yet, simply rely on the fact createProjectCard adds data-id,
              // but for filtering performance, data-category on the card is best.
              // Let's modify the string slightly to include data-category if ProjectCard doesn't already (it uses data-cat inside for the chip).
              // Actually, ProjectCard.ts adds data-id. We will inject data-category into the card string here using replace.

              const cardHtml = createProjectCard(work, work.thumbnail);
              // Inject data-category attribute into the opening tag of the card
              return cardHtml.replace(
                'class="work-card group"',
                `class="work-card group" data-category="${work.category}"`
              );
            })
            .join('')}
        </div>
        
        <!-- Floating Mobile Counter -->
        <div class="project-floating-counter">1</div>
      </div>
    `;

    // Animate cards on scroll
    setTimeout(() => this.initAnimations(), 100);
  }

  attachEvents() {
    // 1. Grid Click (Video Modal)
    const grid = this.element.querySelector('.project-grid-3col');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const card = target.closest('.work-card');

        if (card) {
          const id = card.getAttribute('data-id');
          if (id) {
            const project = this.projects.find((p) => p.no === Number(id));
            if (project && project.video_src) {
              // Only if video source exists
              this.videoModal.open(project);
            }
          }
        }
      });
    }

    // 2. Filter Click
    const filterContainer = this.element.querySelector(
      '.category-filter-container'
    );
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const chip = (e.target as HTMLElement).closest('.filter-chip');
        if (chip) {
          const category = chip.getAttribute('data-cat');
          if (category) {
            this.toggleCategory(category, chip as HTMLElement);
          }
        }
      });
    }
  }

  toggleCategory(category: string, chipElement: HTMLElement) {
    if (this.activeCategories.has(category)) {
      // Turn OFF
      // Prevent turning off all categories if you want at least one? (Optional rule)
      // For now allow all off.
      this.activeCategories.delete(category);
      chipElement.classList.add('inactive');
    } else {
      // Turn ON
      this.activeCategories.add(category);
      chipElement.classList.remove('inactive');
    }

    this.filterProjects();
  }

  filterProjects() {
    const cards = Array.from(
      this.element.querySelectorAll('.work-card')
    ) as HTMLElement[];

    // First pass: toggle display
    cards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const isVisible = cardCategory && this.activeCategories.has(cardCategory);

      if (isVisible) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }

  initAnimations() {
    const cards = this.element.querySelectorAll('.work-card');
    const counter = this.element.querySelector('.project-floating-counter');
    const titleChars = this.element.querySelectorAll(
      '.section-title .text-reveal'
    );

    // Title Reveal
    gsap.to(titleChars, {
      y: 0,
      opacity: 1,
      duration: 1.4,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.section-header',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    // Filter Chips
    const chips = this.element.querySelectorAll('.filter-chip');
    gsap.set(chips, { opacity: 0 });

    ScrollTrigger.batch(chips, {
      start: 'top 80%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          duration: 0.24,
          stagger: 0.1,
          ease: 'none',
          overwrite: true,
        }),
      onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, overwrite: true }),
    });

    // Section/Counter Visibility
    ScrollTrigger.create({
      trigger: this.element,
      start: 'top 80%',
      end: 'bottom bottom',
      onEnter: () => counter?.classList.add('visible'),
      onLeave: () => counter?.classList.remove('visible'),
      onEnterBack: () => counter?.classList.add('visible'),
      onLeaveBack: () => counter?.classList.remove('visible'),
    });

    // Individual Card Counter Update
    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 60%',
        onEnter: () => {
          if (window.getComputedStyle(card).display !== 'none') {
            if (counter) counter.textContent = `${index + 1}`;
          }
        },
        onEnterBack: () => {
          if (window.getComputedStyle(card).display !== 'none') {
            if (counter) counter.textContent = `${index + 1}`;
          }
        },
      });
    });
  }
}
