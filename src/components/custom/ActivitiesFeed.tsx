// src/components/custom/ActivitiesFeed.tsx
import React, { useEffect, useState } from 'react';
import ActivityCard from '@/components/custom/ActivityCard';
import { fetchActivities } from '@/services/airtable';
import { Activity } from '@/types';
import { Loader2 } from 'lucide-react';

const ActivitiesFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await fetchActivities();
        setActivities(data);
      } catch (err) {
        setError('Kunde inte ladda aktiviteter');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {activities.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          Inga aktiviteter att visa än
        </div>
      ) : (
        activities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))
      )}
    </div>
  );
};

export default ActivitiesFeed;