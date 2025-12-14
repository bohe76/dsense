export interface WorkItem {
  no: number;
  category: string;
  project_name: string;
  client: string;
  tech_stack: string[];
  key_features: string[];
  media_type: string | null;
  thumbnail: string;
  video_src?: string | null;
  video_width?: number;
  video_height?: number;
}
