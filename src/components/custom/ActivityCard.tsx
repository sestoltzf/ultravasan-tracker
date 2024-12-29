// components/ActivityCard.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "@/types/activity";
import MediaDisplay from "./MediaDisplay";
import { useRouter } from "next/navigation";

const ActivityCard = ({ activity }: { activity: Activity }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/activity/${activity.id}`);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              {activity.runner}
              {activity.location && (
                <span className="text-sm text-gray-500">@ {activity.location}</span>
              )}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(activity.date).toLocaleDateString()} - {activity.duration} min
            </p>
          </div>
          {activity.f24s_workout && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
              F24S
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{activity.notes}</p>
        <MediaDisplay activity={activity} />
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Distance: {activity.distance} km
          </div>
          <button
            onClick={handleViewDetails}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
          >
            Se mer
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
