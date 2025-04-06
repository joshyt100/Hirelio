import React from "react";

export const SolidCircleLoader = ({ className = "w-6 h-6" }: { className?: string }) => (
  <div
    className={`border-4 border-solid border-zinc-300 dark:border-zinc-800 border-t-transparent dark:border-t-transparent rounded-full animate-spin ${className}`}
  />
);

