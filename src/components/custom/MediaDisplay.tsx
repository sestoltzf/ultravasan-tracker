// components/MediaDisplay.tsx
import React from 'react';
import Image from 'next/image';
import { Activity } from '@/types/activity';

const MediaDisplay = ({ activity }: { activity: Activity }) => {
  if (activity.mediaType === 'None') return null;

  return (
    <div className="mt-4 space-y-4">
      {activity.mediaType !== 'Video' && activity.media.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {activity.media.map((item, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden"
            >
              <Image
                src={item.url}
                alt={activity.mediaDescription || 'Activity image'}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {(activity.mediaType === 'Video' || activity.mediaType === 'Both') &&
        activity.videoURL && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <iframe
              src={activity.videoURL.replace(
                'youtube.com/watch?v=',
                'youtube.com/embed/'
              )}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        )}

      {activity.mediaDescription && (
        <p className="text-sm text-gray-500 mt-2">{activity.mediaDescription}</p>
      )}
    </div>
  );
};

export default MediaDisplay;
