// src/components/job/JobApplicationsSkeleton.tsx
import React from 'react';
import { Card } from '@/components/ui/card';

// A single skeleton card mimicking the JobCard layout
const SkeletonCard: React.FC = () => (
  <Card className="animate-pulse">
    <div className="p-4 space-y-4">
      {/* Placeholder for company name */}
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      {/* Placeholder for position */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      {/* Placeholder for location/date */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      {/* Placeholder for status badge and icons */}
      <div className="flex space-x-2 mt-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </Card>
);

interface JobApplicationsSkeletonProps {
  count?: number;
}

// Skeleton loader grid, defaults to 6 placeholder cards
const JobApplicationsSkeleton: React.FC<JobApplicationsSkeletonProps> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <SkeletonCard key={idx} />
    ))}
  </div>
);

export default JobApplicationsSkeleton;

