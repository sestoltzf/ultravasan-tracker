import { Activity } from "@/types";

// Definition av Airtable-records
interface AirtableRecord {
  id: string;
  fields: {
    Date?: string;
    Runner?: string;
    Distance?: number;
    Duration?: string;
    Notes?: string;
    F24S_Workout?: boolean;
    Status?: "Published" | "Draft" | "Complete";
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

// Funktion för att hämta aktiviteter från Airtable
export const fetchActivities = async (): Promise<Activity[]> => {
  try {
    const response = await fetch("/api/activities");
    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.statusText}`);
    }
    const records: AirtableRecord[] = await response.json();

    if (!records || !Array.isArray(records)) {
      console.error("Invalid response format:", records); // Felsökningslog
      throw new Error("Unexpected response from Airtable API.");
    }

    return records.map(transformAirtableRecord);
  } catch (error) {
    console.error("Error in fetchActivities:", error); // Felsökningslog
    throw error;
  }
};

// Funktion för att hämta en aktivitet baserat på ID
export const fetchActivityById = async (id: string): Promise<Activity | null> => {
  try {
    const response = await fetch(`/api/activities/${id}`);
    if (!response.ok) {
      console.error(`Failed to fetch activity with ID ${id}:`, response.statusText);
      return null;
    }
    const record: AirtableRecord = await response.json();

    if (!record || !record.fields) {
      console.error(`Invalid response for activity with ID ${id}:`, record);
      return null;
    }

    return transformAirtableRecord(record);
  } catch (error) {
    console.error(`Error fetching activity with ID ${id}:`, error);
    return null;
  }
};

// Konverterar Airtable-records till `Activity`-objekt
const transformAirtableRecord = (record: AirtableRecord): Activity => {
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
    media: fields.Media || [],
    videoURL: fields.VideoURL || "",
    mediaType: fields.MediaType || "None",
    mediaDescription: fields.MediaDescription || "",
    location: fields.Location || "",
  };
};

// Funktion för att beräkna löpares progression baserat på aktiviteter
export const getRunnerProgressFromActivities = async (): Promise<
  { runner: string; progress: number }[]
> => {
  try {
    const activities = await fetchActivities();
    const runnersProgress = activities.reduce<{ [runner: string]: number }>((acc, activity) => {
      if ((activity.status === "Published" || activity.status === "Complete") && activity.runner) {
        acc[activity.runner] = (acc[activity.runner] || 0) + activity.distance;
      }
      return acc;
    }, {});

    return Object.entries(runnersProgress).map(([runner, progress]) => ({
      runner,
      progress,
    }));
  } catch (error) {
    console.error("Error calculating runner progress:", error);
    throw error;
  }
};
