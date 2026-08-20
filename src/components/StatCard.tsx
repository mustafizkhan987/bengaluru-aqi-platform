import { ReactNode } from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value?: string | number;
  unit?: string;
  badge?: ReactNode;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({ title, value, unit, badge, loading, className, style }: StatCardProps) {
  return (
    <div className={cn("bg-graphite border border-carbon p-6 rounded-2xl flex flex-col justify-between transition-colors hover:bg-tungsten snap-reveal", className)} style={style}>
      <h3 className="text-sm font-medium text-steel uppercase tracking-wider mb-4">{title}</h3>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        {loading ? (
          <Skeleton className="h-10 w-24 skeleton-shimmer" />
        ) : (
          <div className="flex items-baseline space-x-1.5">
            <span className="text-4xl text-eink font-numeric tracking-tight telemetry-glow">{value !== undefined ? value : '--'}</span>
            {unit && <span className="text-sm font-medium text-steel font-numeric">{unit}</span>}
          </div>
        )}
        {!loading && badge && <div>{badge}</div>}
      </div>
    </div>
  );
}
