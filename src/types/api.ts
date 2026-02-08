export interface ContentImages {
  artwork_portrait: string | null;
  artwork_landscape: string | null;
  screenshot_landscape: string | null;
  screenshot_portrait: string | null;
  transparent_logo: string | null;
}

export interface ContentItem {
  id: number;
  type: string;
  title: string;
  year: number;
  duration_in_seconds: number;
  synopsis: string;
  images: ContentImages;
}

export interface ApiResponse {
  collection: ContentItem[];
}
