"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Activity } from "@/types"; // Importera typen

// Lägg till typdefiniering för props
const ActivityLog = ({ activities }: { activities: Activity[] }) => {
  console.log("Händelser som skickas till ActivityLog:", activities); // Log för felsökning

  return (
    <Card>
      <CardHeader>
        <CardTitle>Händelselogg</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="mb-4">
              <h3 className="font-bold">{activity.runner}</h3>
              <p>{activity.date} - {activity.notes}</p>
              <p>Status: {activity.status}</p>
            </div>
          ))
        ) : (
          <p>Inga händelser att visa.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;