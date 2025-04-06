import React from "react";

interface Props {
  className?: string;
}

export const SolidCircleLoader: React.FC<Props> = ({ className = "w-6 h-6" }) => (
  <div
    className={`border-4 border-solid border-zinc-300 dark:border-zinc-800 border-t-transparent dark:border-t-transparent rounded-full animate-spin ${className}`}
  />
);

