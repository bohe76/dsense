import { WorkItem } from '../types';

export const createProjectCard = (
  work: WorkItem,
  imagePath: string
): string => {
  const isVideo = work.media_type === 'video';

  // Dynamic category coloring logic can be handled here or in CSS via data-cat
  // CSS handles it via data-cat selector for clean separation

  return `
    <div class="work-card group" data-id="${work.no}">
      <div class="work-image-wrapper">
         <img src="${imagePath}" alt="${work.project_name}" class="work-image" loading="lazy">
         <div class="work-overlay"></div>
         ${isVideo
      ? `
           <div class="work-play-btn">
             <svg viewBox="0 0 24 24" fill="currentColor">
               <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
             </svg>
           </div>
         `
      : work.site_url
        ? `
           <a href="${work.site_url}" target="_blank" rel="noopener noreferrer" class="work-play-btn" title="Visit Website">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;">
               <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5L19.5 4.5M19.5 4.5H8.25M19.5 4.5V15.75" />
             </svg>
           </a>
         `
        : ''
    }
      </div>
      
      <div class="work-info">
          <div class="work-header-row">
              <span class="work-client">${work.client}</span>
          </div>
          
          <h4 class="work-title">${work.project_name}</h4>
          
          <ul class="work-feature-list">
              ${work.key_features ? work.key_features.map((feature) => `<li class="work-feature-item">${feature}</li>`).join('') : ''}
          </ul>

          <div class="work-meta-chips">
              <span class="work-category-chip" data-cat="${work.category}">${work.category}</span>
              ${work.tech_stack
      .slice(0, 4)
      .map((s) => `<span class="work-tag-chip">${s}</span>`)
      .join('')}
          </div>
      </div>
    </div>
  `;
};
