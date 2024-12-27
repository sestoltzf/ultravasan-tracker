// src/types/index.ts

export interface Activity {
    id: string;
    date: string;
    runner: string;
    distance: number;
    duration: string;
    notes: string;
    f24s_workout: boolean;
    status: "Published" | "Draft";
    checkpoint: string;
    media: Array<{
      url: string;
      filename: string;
      type: string;
    }>;
    videoURL: string;
    mediaType: "Image" | "Video" | "Both" | "None";
    mediaDescription: string;
    location: string;
   }
   
   export interface Checkpoint {
    id: string;
    name: string;
    type: string;
    description: string;
    activities: string[];
    status: "Not Started" | "In Progress" | "Completed";
   }
   
   export interface Comment {
    id: string;
    activityId: string; 
    comment: string;
    date: string;
    status: "Published" | "Draft";
   }