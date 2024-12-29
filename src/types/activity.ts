export interface MediaItem {
  url: string;
  filename: string;
  type: string;
}

export interface Activity {
  id: string;
  date: string;
  runner: string;
  distance: number;
  duration: string;
  notes: string;
  f24s_workout: boolean;
  status: 'Published' | 'Draft' | 'Complete'; // Lägg till "Complete" här
  media: MediaItem[];
  videoURL?: string;
  mediaType: 'Image' | 'Video' | 'Both' | 'None';
  mediaDescription?: string;
  location?: string;
  type?: string;
}
