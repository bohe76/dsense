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
  private activeCategories: string[]; // Ordered array: last-clicked first
  private allCategories: string[];
  private projectCountSpan: HTMLElement | null = null;
  private floatingCounterScrollTriggers: ScrollTrigger[] = []; // New property to store ScrollTrigger instances

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
    // Initialize active categories (empty = ALL)
    this.activeCategories = [];

    this.render();
    this.attachEvents();
    this.projectCountSpan = this.element.querySelector('.project-count');
    this.updateSectionProjectCount();
    this.setupFloatingCounterScrollTriggers(); // Initial setup for floating counter
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

    // Determine if ALL is active (no specific categories selected)
    const isAllActive = this.activeCategories.length === 0 ? '' : 'inactive';

    // Generate Filter Chips HTML
    const filterHtml = `
      <div class="category-filter-container">
        <!-- ALL Chip -->
        <div class="filter-chip ${isAllActive}" data-cat="ALL" data-initial="ALL">
          <span class="chip-text">ALL</span>
        </div>
        ${this.allCategories
        .map((cat) => {
          const isActive = this.activeCategories.includes(cat)
            ? ''
            : 'inactive'; // In "Select Mode", only selected are active.
          return `
            <div class="filter-chip ${isActive}" data-cat="${cat}" data-initial="${cat.charAt(0)}">
              <span class="chip-text">${cat}</span>
            </div>
          `;
        })
        .join('')}
      </div>
    `;

    // Sentinel for Sticky Detection
    const sentinelHtml = `<div class="filter-sentinel" style="position:absolute; top:-1px; height:1px; width:100%; visibility:hidden;"></div>`;

    this.element.innerHTML = `
      <div class="container projects">
        <div class="section-header" data-scroll data-scroll-speed="0.5">
            <h2 class="section-title">
              <span class="word-selected">${wrapChars('Selected')}</span>
              <span class="word-works">${wrapChars('WORKS')}</span>
            </h2>
            <span class="project-count">/ ${this.projects.length.toString().padStart(2, '0')}</span>
        </div>
        
        <!-- Sticky Sentinel -->
        ${sentinelHtml}
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
            if (project) {
              if (project.video_src) {
                // Only if video source exists
                this.videoModal.open(project);
              } else if (project.site_url) {
                // Site URL exists
                window.open(project.site_url, '_blank');
              }
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

    // Event listeners removed: 'is-hovered' class handling is no longer needed.
    // CSS :hover is sufficient and cleaner.
  }

  toggleCategory(category: string, chipElement: HTMLElement) {
    const allChip = this.element.querySelector('.filter-chip[data-cat="ALL"]');
    const otherChips = this.element.querySelectorAll(
      '.filter-chip:not([data-cat="ALL"])'
    );

    if (category === 'ALL') {
      // 1. Clicked ALL: Clear selection (Show All)
      this.activeCategories = [];

      // Update UI
      if (allChip) allChip.classList.remove('inactive');
      otherChips.forEach((chip) => chip.classList.add('inactive'));
    } else {
      // 2. Clicked Specific Category
      const index = this.activeCategories.indexOf(category);
      if (index !== -1) {
        // Turn OFF: Remove from array
        this.activeCategories.splice(index, 1);
        chipElement.classList.add('inactive');
      } else {
        // Turn ON: Add to FRONT of array (last-clicked = first displayed)
        this.activeCategories.unshift(category);
        chipElement.classList.remove('inactive');
      }

      // 3. Logic Check: If nothing selected, revert to ALL
      if (this.activeCategories.length === 0) {
        if (allChip) allChip.classList.remove('inactive');
      } else {
        if (allChip) allChip.classList.add('inactive');
      }
    }

    this.filterProjects();

    // Auto-Scroll to Filter Top if we are below it
    const filterContainer = this.element.querySelector(
      '.category-filter-container'
    ) as HTMLElement;
    const sentinel = this.element.querySelector(
      '.filter-sentinel'
    ) as HTMLElement;

    if (filterContainer && sentinel) {
      // Use requestAnimationFrame to let DOM update first (cards appearing/disappearing changes height)
      requestAnimationFrame(() => {
        const isMobile = window.innerWidth <= 768;
        const offsetPC = -460;
        const offsetMobile = -296;
        const targetOffset = isMobile ? offsetMobile : offsetPC;

        const lenis = (window as any).lenis;
        // Recalculate positions after DOM update
        const absoluteSentinelTop =
          window.scrollY + sentinel.getBoundingClientRect().top;
        const targetScrollY = absoluteSentinelTop - targetOffset;

        // Only scroll if we are BELOW the target position (plus disjoint margin)
        if (window.scrollY > targetScrollY + 10) {
          if (lenis) {
            (window as any).isFilterScrolling = true; // Enable motion blur
            lenis.scrollTo(targetScrollY, {
              duration: 0.6,
              easing: (t: number) => 1 - Math.pow(1 - t, 3), // Cubic.out
              immediate: false,
            });
            // Disable motion blur after animation duration
            setTimeout(() => {
              (window as any).isFilterScrolling = false;
            }, 600);
          } else {
            window.scrollTo({ top: targetScrollY, behavior: 'auto' });
          }
        }
      });
    }
  }

  private updateSectionProjectCount() {
    if (this.projectCountSpan) {
      const visibleCards = Array.from(
        this.element.querySelectorAll('.work-card')
      ) as HTMLElement[];
      const visibleCount = visibleCards.filter(
        (card) => window.getComputedStyle(card).display !== 'none'
      ).length;
      this.projectCountSpan.textContent = `/ ${visibleCount.toString().padStart(2, '0')}`;
    }
  }

  filterProjects() {
    const grid = this.element.querySelector(
      '.project-grid-3col'
    ) as HTMLElement;
    if (!grid) return;

    const cards = Array.from(
      this.element.querySelectorAll('.work-card')
    ) as HTMLElement[];

    // First pass: toggle display
    cards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');

      // If categories is empty, it means "ALL" mode -> show everything.
      // Otherwise, check if category is in the array.
      const isVisible =
        this.activeCategories.length === 0 ||
        (cardCategory && this.activeCategories.includes(cardCategory));

      if (isVisible) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // Second pass: Reorder visible cards based on activeCategories priority
    if (this.activeCategories.length > 0) {
      const visibleCards = cards.filter(
        (card) => card.style.display !== 'none'
      );

      // Sort by category priority (index in activeCategories: lower = higher priority)
      visibleCards.sort((a, b) => {
        const catA = a.getAttribute('data-category') || '';
        const catB = b.getAttribute('data-category') || '';
        const indexA = this.activeCategories.indexOf(catA);
        const indexB = this.activeCategories.indexOf(catB);
        return indexA - indexB;
      });

      // Re-append sorted cards to grid
      visibleCards.forEach((card) => grid.appendChild(card));
    }

    this.updateSectionProjectCount(); // Update the section header count after filtering
    ScrollTrigger.refresh();
    this.setupFloatingCounterScrollTriggers(); // Re-setup floating counter after filtering
  }

  // New method to set up/re-setup ScrollTriggers for the floating counter
  private setupFloatingCounterScrollTriggers() {
    // Kill existing ScrollTriggers to prevent duplicates and memory leaks
    this.floatingCounterScrollTriggers.forEach((st) => st.kill());
    this.floatingCounterScrollTriggers = []; // Clear the array

    const counter = this.element.querySelector('.project-floating-counter');
    if (!counter) return;

    // Get only currently visible cards
    const visibleCards = Array.from(
      this.element.querySelectorAll('.work-card')
    ).filter(
      (card) => window.getComputedStyle(card).display !== 'none'
    ) as HTMLElement[];

    visibleCards.forEach((card, index) => {
      const st = ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 60%',
        onEnter: () => {
          if (counter) counter.textContent = `${index + 1}`;
        },
        onEnterBack: () => {
          if (counter) counter.textContent = `${index + 1}`;
        },
      });
      this.floatingCounterScrollTriggers.push(st); // Store the instance
    });
  }

  initAnimations() {
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
          duration: 0.2,
          stagger: 0.12,
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

    // Individual Card Counter Update - REMOVED, now handled by setupFloatingCounterScrollTriggers()
    // cards.forEach((card, index) => {
    //   ScrollTrigger.create({
    //     trigger: card,
    //     start: 'top 60%',
    //     end: 'bottom 60%',
    //     onEnter: () => {
    //       if (window.getComputedStyle(card).display !== 'none') {
    //         if (counter) counter.textContent = `${index + 1}`;
    //       }
    //     },
    //     onEnterBack: () => {
    //       if (window.getComputedStyle(card).display !== 'none') {
    //         if (counter) counter.textContent = `${index + 1}`;
    //       }
    //     },
    //   });
    // });
    this.setupFloatingCounterScrollTriggers(); // Initial call to setup floating counter after other animations
  }
}
