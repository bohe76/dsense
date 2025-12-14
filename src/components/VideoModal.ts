import { WorkItem } from '../types';

export class VideoModal {
    private tempContainer: HTMLDivElement;
    private overlay: HTMLDivElement | null = null;
    private videoElement: HTMLVideoElement | null = null;

    constructor() {
        this.tempContainer = document.createElement('div');
        this.createModalStructure();
        this.attachEvents();
    }

    private createModalStructure() {
        // Hidden by default, appended to body only when opened
        this.tempContainer.innerHTML = `
      <div id="video-modal-overlay" style="
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100vw; 
        height: 100vh; 
        background-color: rgba(0, 0, 0, 0.9); 
        z-index: 9999; 
        display: none; 
        align-items: center; 
        justify-content: center; 
        opacity: 0;
        transition: opacity 0.3s ease;
      ">
        <video id="modal-video-player" controls autoplay style="
          max-width: 90%; 
          max-height: 90%; 
          width: auto; 
          height: auto; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          outline: none;
        "></video>
        
        <button id="modal-close-btn" style="
          position: absolute; 
          top: 30px; 
          right: 30px; 
          background: none; 
          border: 2px solid rgba(255, 255, 255, 0.3); 
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white; 
          cursor: pointer;
          z-index: 10000;
          padding: 0;
          transition: all 0.3s;
        ">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
        </button>
      </div>
    `;

        // We don't append to body yet, we just store the structure
        // But to find elements, we need a root.
        document.body.appendChild(this.tempContainer);

        this.overlay = this.tempContainer.querySelector('#video-modal-overlay');
        this.videoElement = this.tempContainer.querySelector('#modal-video-player');

        // Initially hidden
        if (this.overlay) this.overlay.style.display = 'none';
    }

    private attachEvents() {
        if (!this.overlay) return;

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Close on button click
        const closeBtn = this.overlay.querySelector('#modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay && this.overlay.style.display === 'flex') {
                this.close();
            }
        });
    }

    public open(project: WorkItem) {
        if (!this.overlay || !this.videoElement || !project.video_src) return;

        if (project.video_width && project.video_height) {
            this.videoElement.style.aspectRatio = `${project.video_width} / ${project.video_height}`;
        } else {
            this.videoElement.style.aspectRatio = 'auto';
        }

        this.videoElement.src = project.video_src;
        this.overlay.style.display = 'flex';

        // Forced reflow for transition
        requestAnimationFrame(() => {
            if (this.overlay) this.overlay.style.opacity = '1';
        });
    }

    public close() {
        if (!this.overlay || !this.videoElement) return;

        this.overlay.style.opacity = '0';

        // Wait for transition end
        setTimeout(() => {
            if (this.overlay) this.overlay.style.display = 'none';
            if (this.videoElement) {
                this.videoElement.pause();
                this.videoElement.src = ""; // Stop buffering
                this.videoElement.style.aspectRatio = 'auto'; // Reset aspect ratio
            }
        }, 300);
    }
}
