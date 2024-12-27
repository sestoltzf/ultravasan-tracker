import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg shadow-md p-4 bg-white ${className || ""}`}>{children}</div>
);

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`font-bold text-lg mb-2 ${className || ""}`}>{children}</div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-xl font-semibold ${className || ""}`}>{children}</div>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm text-gray-600 ${className || ""}`}>{children}</div>
);
