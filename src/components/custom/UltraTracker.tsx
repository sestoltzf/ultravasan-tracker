"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapTracker from "./MapTracker";
import ActivityLog from "./ActivityLog";

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
    { id: 1, name: "Simon", progress: 22, image: "/images/profile1.png", color: COLORS[0] },
    { id: 2, name: "Fredrik", progress: 22, image: "/images/profile2.png", color: COLORS[1] },
  ]);

  const updateRunnerProgress = (id: number, change: number) => {
    setRunners((prev) =>
      prev.map((runner) => {
        if (runner.id === id) {
          let newProgress = Math.min(Math.max(runner.progress + change, 0), 92);

          const nextCheckpoint = CHECKPOINTS.find((cp) => cp.distance >= newProgress);
          const prevCheckpoint = [...CHECKPOINTS].reverse().find((cp) => cp.distance <= newProgress);

          if (change > 0 && nextCheckpoint && nextCheckpoint.distance - newProgress <= 2) {
            newProgress = nextCheckpoint.distance;
          } else if (change < 0 && prevCheckpoint && newProgress - prevCheckpoint.distance <= 2) {
            newProgress = prevCheckpoint.distance;
          }

          return { ...runner, progress: newProgress };
        }
        return runner;
      })
    );
  };

  const getCurrentCheckpoint = (progress: number) => {
    return [...CHECKPOINTS].reverse().find((cp) => cp.distance <= progress) || CHECKPOINTS[0];
  };

  return (
    <Card className="w-screen min-h-screen border-0 rounded-none bg-white">
      <CardHeader className="border-b">
        <CardTitle>Ultravasan 90 - Progress Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Karta</TabsTrigger>
            <TabsTrigger value="activities">Logg</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <div className="relative w-full bg-white">
              <MapTracker runners={runners} />
            </div>
            <div className="p-4">
              {runners.map((runner) => (
                <div key={runner.id} className="mb-8">
                  <div className="flex items-center gap-4">
                    <img
                      src={runner.image}
                      alt={runner.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-300"
                    />
                    <div>
                      <p className="font-medium">{runner.name}</p>
                      <p className="text-sm text-gray-500">
                        {getCurrentCheckpoint(runner.progress).name} - {runner.progress.toFixed(1)} km
                      </p>
                    </div>
                  </div>

                  {/* Progress-bar med checkpoints */}
                  <div className="relative mt-4 h-4 bg-gray-200 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${(runner.progress / 92) * 100}%`,
                        backgroundColor: runner.color,
                      }}
                    />
                    {CHECKPOINTS.map((checkpoint) => (
                      <div
                        key={checkpoint.name}
                        className="absolute top-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-500"
                        style={{
                          left: `${(checkpoint.distance / 92) * 100}%`,
                          backgroundColor:
                            checkpoint.distance <= runner.progress ? runner.color : "white",
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => updateRunnerProgress(runner.id, 5)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      +5 km
                    </button>
                    <button
                      onClick={() => updateRunnerProgress(runner.id, -5)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      -5 km
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UltraTracker;
