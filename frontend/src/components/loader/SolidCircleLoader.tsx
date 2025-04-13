// src/components/loader/CircleLoader.tsx
// Solid Circular Loader
export const SolidCircleLoader = ({ className = "w-6 h-6" }: { className?: string }) => (
  <div
    className={`border-4 border-solid border-zinc-200 dark:border-zinc-800 border-t-primary dark:border-t-primary rounded-full animate-spin ${className}`}
  />
);

