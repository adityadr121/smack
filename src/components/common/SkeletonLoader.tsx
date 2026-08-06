import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`bg-slate-800/80 animate-pulse rounded-lg ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
};

export const PatientCardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-3 w-48" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};

export const KPICardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-2 w-24" />
      </div>
      <Skeleton className="w-10 h-10 rounded-xl" />
    </div>
  );
};
