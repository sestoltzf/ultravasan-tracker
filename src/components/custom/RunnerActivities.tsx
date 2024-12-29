"use client";

import React, { FC, useState } from "react";
import { Activity } from "@/types";
import ActivityDetail from "./ActivityDetail";

interface RunnerActivitiesProps {
  runner: string;
  activities: Activity[];
  onActivityComplete: (activityId: number) => void;
}

const RunnerActivities: FC<RunnerActivitiesProps> = ({
  runner,
  activities,
  onActivityComplete,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  // Sortera aktiviteter efter datum (senaste först)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <h3 className="text-lg font-semibold">{runner}s Aktiviteter</h3>
      <ul className="space-y-4">
        {sortedActivities.map((activity) => (
          <li
            key={activity.id}
            className="p-4 border rounded cursor-pointer hover:shadow"
            onClick={() =>
              setSelectedActivity(
                selectedActivity === activity.id ? null : activity.id
              )
            }
          >
            <p className="font-medium">
              {new Date(activity.date).toLocaleDateString("sv-SE")}: {activity.notes}
            </p>
            {selectedActivity === activity.id && (
              <div className="mt-4">
                <ActivityDetail activity={activity} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RunnerActivities;
