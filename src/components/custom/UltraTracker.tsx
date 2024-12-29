"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MapTracker from "./MapTracker";
import { fetchActivities } from "@/services/airtable";
import { Activity } from "@/types";
import ActivityDetail from "./ActivityDetail";

const COLORS = ["#497f6f", "#e19272"];

const CHECKPOINTS = [
  { name: "Sälen", distance: 0, type: "START" },
  { name: "Smågan", distance: 12, type: "GYM" },
  { name: "Mångsbodarna", distance: 27, type: "RUNNING" },
  { name: "Risberg", distance: 37, type: "GYM" },
  { name: "Evertsberg", distance: 47, type: "PODCAST" },
  { name: "Oxberg", distance: 62, type: "GYM" },
  { name: "Hökberg", distance: 72, type: "RUNNING" },
  { name: "Eldris", distance: 82, type: "GYM" },
  { name: "Mora", distance: 92, type: "FINISH" },
];

const UltraTracker = () => {
  const [runners, setRunners] = useState([
    { id: 1, name: "Simon", progress: 0, image: "/images/profile1.png", color: COLORS[0] },
    { id: 2, name: "Fredrik", progress: 0, image: "/images/profile2.png", color: COLORS[1] },
  ]);

  const [eventLog, setEventLog] = useState<{ id: string; activity: Activity }[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [showMoreComplete, setShowMoreComplete] = useState(false);
  const [showMoreIncomplete, setShowMoreIncomplete] = useState(false);

  const updateRunnerProgressBasedOnActivities = (fetchedActivities: Activity[]) => {
    const updatedRunners = [...runners];
    const newEventLog: { id: string; activity: Activity }[] = [];

    fetchedActivities.forEach((activity) => {
      const runnerIndex = updatedRunners.findIndex((r) => r.name === activity.runner);
      if (runnerIndex !== -1) {
        if (activity.status === "Complete") {
          updatedRunners[runnerIndex].progress += 5; // Add progress for completed activities
        }
        newEventLog.push({ id: activity.id, activity });
      }
    });

    setRunners(updatedRunners);
    setEventLog(newEventLog);
  };

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const fetchedActivities = await fetchActivities();
        updateRunnerProgressBasedOnActivities(fetchedActivities);
      } catch (error) {
        console.error("Error loading activities:", error);
      }
    };

    loadActivities();
  }, []);

  return (
    <Card className="w-screen min-h-screen border-0 rounded-none bg-white">
      <CardHeader className="border-b">
        <CardTitle>Ultravasan 90 - Progress Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map */}
        <div className="relative w-full bg-white">
          <MapTracker runners={runners} />
        </div>

        <div className="p-4 space-y-6">
          {runners.map((runner) => (
            <div key={runner.id} className="mb-8">
              <div className="flex items-center gap-4">
                <img
                  src={runner.image}
                  alt={runner.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                />
                <div>
                  <p className="font-medium">{runner.name}</p>
                  <p className="text-sm text-gray-500">
                    {CHECKPOINTS.find((cp) => cp.distance >= runner.progress)?.name || "Mora"} - {" "}
                    {runner.progress.toFixed(1)} km
                  </p>
                </div>
              </div>

              <div className="relative mt-4 h-4 bg-gray-200 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${(runner.progress / 92) * 100}%`,
                    backgroundColor: runner.color,
                  }}
                />
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-semibold">Händelser</h2>

                <div className="mt-4">
                  <h3 className="text-md font-medium text-green-600">Klara händelser</h3>
                  {eventLog
                    .filter(
                      (log) =>
                        log.activity.runner === runner.name &&
                        log.activity.status === "Complete"
                    )
                    .slice(0, showMoreComplete ? undefined : 3)
                    .map((log) => (
                      <div key={log.id} className="mt-2">
                        <p
                          className="text-sm text-blue-500 underline cursor-pointer hover:text-blue-700"
                          onClick={() =>
                            setExpandedEventId((prev) => (prev === log.id ? null : log.id))
                          }
                        >
                          {new Date(log.activity.date).toLocaleDateString("sv-SE")}: {log.activity.notes}
                        </p>
                        {expandedEventId === log.id && (
                          <div className="mt-4">
                            <ActivityDetail activity={log.activity} />
                          </div>
                        )}
                      </div>
                    ))}
                  {eventLog.filter(
                    (log) =>
                      log.activity.runner === runner.name &&
                      log.activity.status === "Complete"
                  ).length > 3 && (
                    <button
                      onClick={() => setShowMoreComplete((prev) => !prev)}
                      className="text-sm text-blue-500 mt-2 underline"
                    >
                      {showMoreComplete ? "Visa färre" : "Visa fler"}
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-medium text-red-600">Ej klara händelser</h3>
                  {eventLog
                    .filter(
                      (log) =>
                        log.activity.runner === runner.name &&
                        log.activity.status !== "Complete"
                    )
                    .slice(0, showMoreIncomplete ? undefined : 3)
                    .map((log) => (
                      <div key={log.id} className="mt-2">
                        <p
                          className="text-sm text-blue-500 underline cursor-pointer hover:text-blue-700"
                          onClick={() =>
                            setExpandedEventId((prev) => (prev === log.id ? null : log.id))
                          }
                        >
                          {new Date(log.activity.date).toLocaleDateString("sv-SE")}: {log.activity.notes}
                        </p>
                        {expandedEventId === log.id && (
                          <div className="mt-4">
                            <ActivityDetail activity={log.activity} />
                          </div>
                        )}
                      </div>
                    ))}
                  {eventLog.filter(
                    (log) =>
                      log.activity.runner === runner.name &&
                      log.activity.status !== "Complete"
                  ).length > 3 && (
                    <button
                      onClick={() => setShowMoreIncomplete((prev) => !prev)}
                      className="text-sm text-blue-500 mt-2 underline"
                    >
                      {showMoreIncomplete ? "Visa färre" : "Visa fler"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UltraTracker;
