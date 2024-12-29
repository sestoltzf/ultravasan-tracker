"use client";
import { useEffect } from 'react';
import UltraTracker from '@/components/custom/UltraTracker';

export default function Home() {
  useEffect(() => {
    // Test Activities endpoint
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        console.log('Activities:', data);
      })
      .catch(err => console.error('Activities Error:', err));

    // Test Checkpoints endpoint
    fetch('/api/checkpoints')
      .then(res => res.json())
      .then(data => {
        console.log('Checkpoints:', data);
      })
      .catch(err => console.error('Checkpoints Error:', err));

    // Test Comments endpoint
    fetch('/api/comments')
      .then(res => res.json())
      .then(data => {
        console.log('Comments:', data);
      })
      .catch(err => console.error('Comments Error:', err));
  }, []);

  return <UltraTracker />;
}