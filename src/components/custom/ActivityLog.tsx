"use client";

import React, { useEffect, useState } from "react";
import { fetchActivities } from "@/services/airtable";
import { Activity } from "@/types";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const ActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompletedActivities = async () => {
      try {
        setLoading(true);
        const fetchedActivities = await fetchActivities();
        console.log("Fetched activities:", fetchedActivities);
        setActivities(fetchedActivities);
      } catch (err) {
        console.error("Error loading activities:", err);
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };

    loadCompletedActivities();
  }, []);

  if (loading) {
    return <p>Loading activities...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!activities.length) {
    return <p>No activities found. Start logging your progress!</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-scroll">
        {activities.map((activity) => (
          <div key={activity.id} className="mb-4">
            <h3 className="font-bold">{activity.runner}</h3>
            <p>{activity.date || "No date available"} - {activity.notes}</p>
            <p>Distance: {activity.distance} km | Duration: {activity.duration}</p>
            <p>Status: {activity.status}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
