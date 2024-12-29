// src/types/index.ts

export interface Activity {
    id: string;
    date: string;
    runner: string;
    distance: number;
    duration: string;
    notes: string;
    f24s_workout: boolean;
    status: "Published" | "Draft" | "Complete";
    media: Array<{
      url: string;
      filename: string;
      type: string;
    }>;
    videoURL: string;
    mediaType: "Image" | "Video" | "Both" | "None";
    mediaDescription: string;
    location: string;
    type?: string;
   }
   
   export interface Checkpoint {
    id: string;
    name: string;
    type: string;
    description: string;
    activities: string[];
    status: "Not Started" | "In Progress" | "Complete";
   }
   
   export interface Comment {
    id: string;
    activityId: string; 
    comment: string;
    date: string;
    status: "Published" | "Draft" | "Complete";
   }