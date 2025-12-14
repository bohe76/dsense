import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export class Thinking {
    private container: HTMLElement | null;
    private element: HTMLElement | null = null;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId);
        if (this.container) {
            this.container.innerHTML = this.render();
            // Find the specific section element
            this.element = this.container.querySelector('#thinking');
            this.initAnimations();
        }
    }

    render(): string {
        // Helper to wrap characters for Title Reveal (Original)
        const wrapChars = (text: string) => {
            return text.split('').map(char =>
                `<span class="text-mask" style="display:inline-block; overflow:hidden;"><span class="text-reveal inline-block" style="display:inline-block; opacity:0; transform:translateY(100%); will-change:transform;">${char === ' ' ? '&nbsp;' : char}</span></span>`
            ).join('');
        };

        // Helper to wrap words for Description Scrub Typing (New)
        const wrap = (text: string) => {
            return text.split(' ').map(word =>
                `<span class="word-reveal" style="display:inline-block; opacity:0; transform:translateX(-12px); margin-left: 0.25em; will-change: transform, opacity;">${word}</span>`
            ).join('');
        };

        return `
      <section id="thinking" class="thinking-section">
        <div class="container">
            <h2 class="section-title" style="margin-bottom: 6rem;">
                <span class="word-start" style="color:#fff;">${wrapChars('Our')}</span>
                <span class="word-together" style="color:#fff; margin-left: 1.5rem;">${wrapChars('Thinking')}</span>
            </h2>
            
            <!-- Highlight Section (Original Style & Animation) -->
            <p class="about-text" style="text-align: right; color:#fff;">
              <span class="highlight" style="display:block; margin-bottom: 2rem; opacity:0; transform:translateY(30px);">
                다양한 시각, 다양한 생각,<br>다양한 경험이 모여<br>인사이트를 만듭니다.
              </span>
            </p>

            <!-- Description Section (New Scrub Typing Animation - Right Aligned) -->
            <!-- Using margin-left for word spacing because of right alignment? No, spacing is visual. -->
            <div class="about-description right-aligned" style="color: #aaa;">
                <p>
                    ${wrap("하나의 생각, 하나의 회사에서 나오는 결과물은 한계가 존재합니다.")}
                </p>
                
                <p>
                    ${wrap("새로운 것은 다양한 시각과 풍부한 경험에서 나온다고 우리는 믿습니다.")}
                    <br>
                    ${wrap("고정관념을 탈피하고 다양함을 수용하며,")}
                    <br>
                    ${wrap("남들이 시도하지 않은 새로운 것을 추구하는 행동에는 담대함과 용기가 필요합니다.")}
                </p>
                
                <p>
                    ${wrap("분야를 넘나드는 경험과 통찰,")}
                    <br>
                    ${wrap("비즈니스와 크리에이티브의 균형을 통해 브랜드를 바르게 해석하고 표현합니다.")}
                </p>
                
                <p>
                    ${wrap("우리는 UI/UX, 웹, 모바일, 영상, 프린트, 패키지, 그래픽, 일러스트 등 다양한 분야에서 뛰어난 활동을 하고있는 디렉터들이 함께 모여 더 큰 가치와 시너지를 만들어 가고 있습니다.")}
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
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });

        // 1. Title Reveal (Char by Char - Vertical Reveal)
        const titleChars = this.element.querySelectorAll(".section-title .text-reveal");
        tl.to(titleChars, {
            y: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.05,
            ease: "power4.out"
        });

        // 2. Highlight Text Reveal (Fade Up)
        const highlight = this.element.querySelector(".highlight");
        if (highlight) {
            gsap.to(highlight, {
                scrollTrigger: {
                    trigger: highlight,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out"
            });
        }

        // 3. Description Word-by-Word Scrub Reveal
        const descParagraphs = this.element.querySelectorAll('.about-description p');
        descParagraphs.forEach((p) => {
            const words = p.querySelectorAll('.word-reveal');

            gsap.to(words, {
                x: 0,
                opacity: 1,
                stagger: 0.5,
                ease: "none",
                scrollTrigger: {
                    trigger: p,
                    start: "top 85%",
                    end: "bottom 65%",
                    scrub: 1,
                }
            });
        });
    }
}
