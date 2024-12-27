import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchActivities } from "@/services/airtable";
import { Activity } from "@/types";

const ActivityDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const allActivities = await fetchActivities();
        const selectedActivity = allActivities.find((act) => act.id === id);
        setActivity(selectedActivity || null);
      } catch (error) {
        console.error("Error loading activity:", error);
      }
    };

    if (id) {
      loadActivity();
    }
  }, [id]);

  if (!activity) {
    return <p>Laddar aktivitet...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{activity.runner}'s Aktivitet</h1>
      <p><strong>Datum:</strong> {new Date(activity.date).toLocaleDateString()}</p>
      <p><strong>Noteringar:</strong> {activity.notes}</p>
      <p><strong>Distans:</strong> {activity.distance} km</p>
      <p><strong>Varaktighet:</strong> {activity.duration}</p>
      <p><strong>Status:</strong> {activity.status}</p>
      {/* Lägg till bilder/video */}
      {activity.media && activity.media.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Media</h3>
          <div className="grid grid-cols-2 gap-4">
            {activity.media.map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt={item.filename}
                className="rounded shadow"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;
