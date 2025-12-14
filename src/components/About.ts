import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class About {
  private container: HTMLElement | null;
  private element: HTMLElement | null = null;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (this.container) {
      this.container.innerHTML = this.render();
      this.element = this.container.querySelector('#about');
      this.initAnimations();
    }
  }

  render(): string {
    // Standard Char Reveal Helper (from ProjectList)
    const wrapChars = (text: string) => {
      return text
        .split('')
        .map(
          (char) =>
            `<span class="text-mask" style="display:inline-block; overflow:hidden;"><span class="text-reveal inline-block" style="display:inline-block; opacity:0; transform:translateY(100%); will-change:transform;">${char === ' ' ? '&nbsp;' : char}</span></span>`
        )
        .join('');
    };

    // Scrub Typing Helper (for Description)
    const wrap = (text: string) => {
      return text
        .split(' ')
        .map(
          (word) =>
            `<span class="word-reveal" style="display:inline-block; opacity:0; transform:translateX(-12px); margin-right: 0.25em; will-change: transform, opacity;">${word}</span>`
        )
        .join('');
    };

    return `
      <section id="about" class="about">
        <div class="container">
            <h2 class="section-title" style="margin-bottom: 6rem;">
                <!-- Applied wrapChars for standard Char Reveal animation -->
                <span class="word-about">${wrapChars('About')}</span>
                <span class="word-us">${wrapChars('US')}</span>
            </h2>
            
            <!-- Highlight Section (Original Style & Animation) -->
            <p class="about-text about-title-indent">
              <span class="highlight" style="display:block; margin-bottom: 2rem; opacity:0; transform:translateY(30px);">
                20년 차 이상,<br>시니어 전문가 그룹이 만드는<br>최적의 비즈니스 솔루션
              </span>
            </p>

            <!-- Description Section (Scrub Typing) -->
            <div class="about-description">
                <p>
                    ${wrap('저희는 주니어 없이 각 분야 최고 수준의 20년 차 이상 전문가 4인이 상주하는 크리에이티브 그룹입니다.')}
                    <br>
                    ${wrap('기획부터 디자인, 개발, 모션그래픽, 키오스크 구축까지 프로젝트에 필요한 모든 과정을 통합적으로 수행합니다.')}
                </p>
                
                <p>
                    ${wrap('삼성전자, SKT, Big Hit 등 글로벌 대기업 프로젝트 경험과 일반 에이전시가 접근하기 어려운 메디컬/제약 분야에서 독보적인 전문성을 보유하고 있습니다.')}
                    <br>
                    ${wrap('특히, 1,000개 이상의 매장에서 실제로 사용 중인 자체 O2O 플랫폼인 "다이닝 매니저"를 운영하고 있는 노하우를 바탕으로 고도화된 비즈니스 로직을 안정적으로 구현합니다.')}
                </p>
                
                <p>
                    ${wrap('단순한 수행사가 아닌, 깊이 있는 통찰력과 기술력을 갖춘 귀사의 비즈니스 파트너로서 성공적인 결과물을 약속드립니다.')}
                </p>
            </div>
        </div>
      </section>
    `;
  }

  initAnimations() {
    if (!this.element) return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.element,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });

    // 1. Title Reveal (Char by Char - Vertical Reveal) - Standardized
    const titleChars = this.element.querySelectorAll(
      '.section-title .text-reveal'
    );
    if (titleChars.length > 0) {
      tl.to(titleChars, {
        y: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.1,
        ease: 'power4.out',
      });
    }

    // 2. Highlight Text Reveal (Fade Up -> Original Style)
    const highlight = this.element.querySelector('.highlight');
    if (highlight) {
      gsap.to(highlight, {
        scrollTrigger: {
          trigger: highlight,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      });
    }

    // 3. Description Word-by-Word Scrub Reveal
    const descParagraphs = this.element.querySelectorAll(
      '.about-description p'
    );
    descParagraphs.forEach((p) => {
      const words = p.querySelectorAll('.word-reveal');

      gsap.to(words, {
        x: 0,
        opacity: 1,
        stagger: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: p,
          start: 'top 85%',
          end: 'bottom 65%',
          scrub: 1,
        },
      });
    });
  }
}
