"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "@/types";
import { fetchActivities } from "@/services/airtable";
import ActivityDetail from "@/components/custom/ActivityDetail";

const ActivityPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Vänta på att `params` blir upplöst
    params.then((resolvedParams) => {
      const { id } = resolvedParams;
      if (!id) {
        console.error("ID saknas i URL");
        router.push("/"); // Skicka användaren tillbaka till startsidan
      } else {
        setId(id);
      }
    });
  }, [params, router]);

  useEffect(() => {
    if (!id) return;

    const loadActivity = async () => {
      try {
        const activities = await fetchActivities();
        const matchedActivity = activities.find((act) => act.id === id);
        if (matchedActivity) {
          setActivity(matchedActivity);
        } else {
          console.error("Aktivitet med ID hittades inte:", id);
        }
      } catch (error) {
        console.error("Fel vid inläsning av aktivitet:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [id]);

  if (loading) {
    return <p>Laddar aktivitet...</p>;
  }

  if (!activity) {
    return (
      <div className="p-4">
        <p>Aktiviteten kunde inte hittas.</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tillbaka
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <ActivityDetail activity={activity} />
    </div>
  );
};

export default ActivityPage;
