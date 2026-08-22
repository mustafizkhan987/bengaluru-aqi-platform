'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from './Skeleton';
import { format } from 'date-fns';

interface TimeSeriesChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: { key: string; color: string; name: string }[];
  loading?: boolean;
  formatXAsDate?: boolean;
}

export function TimeSeriesChart({ data, xKey, yKeys, loading, formatXAsDate }: TimeSeriesChartProps) {
  if (loading) return <Skeleton className="w-full h-[300px]" />;
  if (!data || data.length === 0) return <div className="w-full h-[300px] flex items-center justify-center text-[#86868b] dark:text-[#98989d] light:text-[#6e6e73] bg-[#f5f5f7] dark:bg-[#1c1c1e] light:bg-[#f5f5f7] rounded-lg border border-[#e5e5ea] dark:border-white/10 light:border-[#e5e5ea]">No data available</div>;

  const tickFormatter = (value: unknown): string => {
    if (formatXAsDate && typeof value === 'string') {
      try {
        return format(new Date(value), 'MMM dd');
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--color-carbon)" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fill: 'var(--color-steel)', fontSize: 10, fontFamily: 'var(--font-jetbrains-mono)' }} 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={tickFormatter}
            minTickGap={30}
          />
          <YAxis tick={{ fill: 'var(--color-steel)', fontSize: 10, fontFamily: 'var(--font-jetbrains-mono)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-obsidian)', borderRadius: '4px', border: '1px solid var(--color-carbon)', color: 'var(--color-eink)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '12px' }}
            labelFormatter={(label) => (formatXAsDate && typeof label === 'string') ? format(new Date(label), 'MMM dd, yyyy') : label}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '11px', color: 'var(--color-steel)' }} />
          {yKeys.map((y) => (
            <Line key={y.key} type="stepAfter" dataKey={y.key} name={y.name} stroke={y.color} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--color-obsidian)', stroke: y.color, strokeWidth: 2 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
