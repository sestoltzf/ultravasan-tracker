import { Activity, Checkpoint, Comment } from "@/types";

interface AirtableRecord {
  id: string;
  fields: {
    Date?: string;
    Runner?: string;
    Distance?: number;
    Duration?: string;
    Notes?: string;
    F24S_Workout?: boolean;
    Status?: "Published" | "Draft" | "Not Started";
    Checkpoint?: string;
    Media?: Array<{ url: string; filename: string; type: string }>;
    VideoURL?: string;
    MediaType?: "Image" | "Video" | "Both" | "None";
    MediaDescription?: string;
    Location?: string;
    Name?: string;
    Type?: string;
    Description?: string;
    Activities?: string[];
    ActivityId?: string;
    Comment?: string;
  };
}

export const fetchActivities = async (): Promise<Activity[]> => {
  try {
    const response = await fetch("/api/activities");
    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.statusText}`);
    }
    const records: AirtableRecord[] = await response.json();

    if (!records || !Array.isArray(records)) {
      console.error("Invalid response format:", records);
      throw new Error("Unexpected response from Airtable API.");
    }

    return records.map(transformAirtableRecord);
  } catch (error) {
    console.error("Error in fetchActivities:", error);
    throw error;
  }
};

const transformAirtableRecord = (record: AirtableRecord): Activity => {
  if (!record.fields) {
    console.error("Record fields are undefined:", record);
    throw new Error("Missing fields in Airtable record.");
  }

  const fields = record.fields;

  return {
    id: record.id,
    date: fields.Date || "N/A",
    runner: fields.Runner || "Unknown",
    distance: fields.Distance || 0,
    duration: fields.Duration || "N/A",
    notes: fields.Notes || "",
    f24s_workout: fields.F24S_Workout || false,
    status: fields.Status || "Draft",
    checkpoint: fields.Checkpoint || "",
    media: fields.Media || [],
    videoURL: fields.VideoURL || "",
    mediaType: fields.MediaType || "None",
    mediaDescription: fields.MediaDescription || "",
    location: fields.Location || "",
  };
};

export const createActivity = async (activity: Partial<Activity>): Promise<Activity> => {
  try {
    const response = await fetch("/api/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        `Failed to create activity: ${errorResponse.message || response.statusText}`
      );
    }

    const record: AirtableRecord = await response.json();
    return transformAirtableRecord(record);
  } catch (error) {
    console.error("Error in createActivity:", error);
    throw error;
  }
};

export const fetchCheckpoints = async (): Promise<Checkpoint[]> => {
  try {
    const response = await fetch("/api/checkpoints");
    if (!response.ok) {
      throw new Error(`Failed to fetch checkpoints: ${response.statusText}`);
    }
    const records: AirtableRecord[] = await response.json();
    return records.map(transformCheckpointRecord);
  } catch (error) {
    console.error("Error in fetchCheckpoints:", error);
    throw error;
  }
};

export const fetchComments = async (activityId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`/api/comments?activityId=${activityId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    const records: AirtableRecord[] = await response.json();
    return records.map(transformCommentRecord);
  } catch (error) {
    console.error("Error in fetchComments:", error);
    throw error;
  }
};

const transformCheckpointRecord = (record: AirtableRecord): Checkpoint => {
  const fields = record.fields;
  return {
    id: record.id,
    name: fields.Name || "",
    type: fields.Type || "",
    description: fields.Description || "",
    activities: fields.Activities || [],
    status: fields.Status || "Not Started"
  };
};

const transformCommentRecord = (record: AirtableRecord): Comment => {
  const fields = record.fields;
  return {
    id: record.id,
    activityId: fields.ActivityId || "",
    comment: fields.Comment || "",
    date: fields.Date || "",
    status: fields.Status || "Draft"
  };
};