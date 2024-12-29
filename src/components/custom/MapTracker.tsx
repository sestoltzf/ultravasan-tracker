// src/components/custom/MapTracker.tsx
import React from "react";
import Image from "next/image";

const checkpoints = [
  { name: "Sälen", distance: 0, x: 15.65, y: 59.93 },
  { name: "Smågan", distance: 12, x: 22.6, y: 50.33 },
  { name: "Mångsbodarna", distance: 27, x: 32.6, y: 63.33 },
  { name: "Risberg", distance: 37, x: 41.5, y: 57.0 },
  { name: "Evertsberg", distance: 47, x: 50, y: 24.0 },
  { name: "Oxberg", distance: 62, x: 66.3, y: 37.0 },
  { name: "Hökberg", distance: 72, x: 73, y: 58.0 },
  { name: "Eldris", distance: 82, x: 75.5, y: 77.0 },
  { name: "Mora", distance: 92, x: 83.0, y: 78.0 },
];

// Beräknar positionen för en löpare baserat på deras framsteg
const getPositionOnLine = (progress: number) => {
  for (let i = 0; i < checkpoints.length - 1; i++) {
    const current = checkpoints[i];
    const next = checkpoints[i + 1];

    if (progress >= current.distance && progress <= next.distance) {
      const ratio = (progress - current.distance) / (next.distance - current.distance);
      const x = current.x + ratio * (next.x - current.x);
      const y = current.y + ratio * (next.y - current.y);
      return { x, y };
    }
  }

  return { x: checkpoints[0].x, y: checkpoints[0].y };
};

// Beräknar offset för att undvika överlapp mellan löpare
const getRunnerOffset = (
  progress: number,
  currentRunner: { id: number; progress: number },
  allRunners: { id: number; progress: number }[]
) => {
  const nearbyRunners = allRunners.filter(
    (r) => Math.abs(r.progress - progress) < 2 && r.id !== currentRunner.id
  );

  if (nearbyRunners.length === 0) return { x: 0, y: 0 };

  const shouldOffset = currentRunner.id > Math.min(...nearbyRunners.map((r) => r.id));

  return shouldOffset ? { x: -10, y: -10 } : { x: 0, y: 0 };
};

const MapTracker = ({
  runners,
}: {
  runners: { id: number; progress: number; image: string }[];
}) => {
  return (
    <div className="relative w-full" style={{ paddingBottom: "20%" }}>
      <div className="absolute inset-0">
        <Image
          src="/images/map.jpg"
          alt="Ultravasan Map"
          layout="fill"
          objectFit="contain"
          className="bg-white"
        />
        {runners.map((runner) => {
          const position = getPositionOnLine(runner.progress);
          const offset = getRunnerOffset(runner.progress, runner, runners);

          return (
            <div
              key={runner.id}
              className="absolute w-6 h-6 md:w-8 md:h-8 transition-all duration-300"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
                zIndex: offset.x === 0 ? 1 : 2,
              }}
            >
              <Image
                src={runner.image || "/images/default-runner.png"}
                alt={`Runner ${runner.id}`}
                width={70}
                height={70}
                className="rounded-full border-2 border-white shadow-lg"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapTracker;
