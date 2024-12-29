"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Activity } from "@/types";
import Comments from "./Comments";

interface ActivityDetailProps {
  activity: Activity;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity }) => {
  // State för att hantera admin-läge
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      {/* Huvudinfo */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">{activity.runner}</h1>
        <p className="text-gray-500 text-sm">
          {activity.type || "Aktivitet"} - {new Date(activity.date).toLocaleDateString("sv-SE")}
        </p>
      </div>

      {/* Media */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        {activity.mediaType === "Video" || activity.mediaType === "Both" ? (
          <iframe
            src={activity.videoURL.replace(
              "youtube.com/watch?v=",
              "youtube.com/embed/"
            )}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        ) : activity.media.length > 0 ? (
          <Image
            src={activity.media[0].url}
            alt={activity.mediaDescription || "Media"}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        ) : (
          <div className="bg-gray-100 flex items-center justify-center h-full">
            <p className="text-gray-400">Ingen media tillgänglig</p>
          </div>
        )}
      </div>

      {/* Media-beskrivning */}
      {activity.mediaDescription && (
        <p className="mt-4 text-gray-600">{activity.mediaDescription}</p>
      )}

      {/* Ytterligare detaljer */}
      <div className="mt-6 space-y-3 text-sm text-gray-600">
        <p>
          <strong>Datum:</strong> {new Date(activity.date).toLocaleDateString("sv-SE")}
        </p>
        <p>
          <strong>Distans:</strong> {activity.distance} km
        </p>
        <p>
          <strong>Tid:</strong> {activity.duration} min
        </p>
        <p>
          <strong>Anteckningar:</strong> {activity.notes}
        </p>
        {activity.location && (
          <p>
            <strong>Plats:</strong> {activity.location}
          </p>
        )}
        {activity.f24s_workout && (
          <p>
            <strong>Typ:</strong> F24S Träning
          </p>
        )}
      </div>

      {/* Kommentarer */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Kommentarer</h2>
        <Comments
          activityId={activity.id}
          loggedInUserId={"exampleUser123"} // Ersätt detta med korrekt logik för inloggad användare
          isAdmin={isAdmin} // Skickar adminstatus
          adminKey={process.env.NEXT_PUBLIC_ADMIN_KEY || ""} // Miljövariabel för adminlösenord
          setIsAdmin={setIsAdmin} // Skickar metoden för att ändra adminstatus
        />
      </div>
    </div>
  );
};

export default ActivityDetail;
