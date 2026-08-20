'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from './Skeleton';

interface BarComparisonChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: { key: string; color: string; name: string }[];
  loading?: boolean;
}

export function BarComparisonChart({ data, xKey, yKeys, loading }: BarComparisonChartProps) {
  if (loading) return <Skeleton className="w-full h-[300px]" />;
  if (!data || data.length === 0) return <div className="w-full h-[300px] flex items-center justify-center text-slate-500 bg-slate-50 rounded-lg border border-slate-100">No data available</div>;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--color-carbon)" />
          <XAxis dataKey={xKey} tick={{ fill: 'var(--color-steel)', fontSize: 10, fontFamily: 'var(--font-jetbrains-mono)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--color-steel)', fontSize: 10, fontFamily: 'var(--font-jetbrains-mono)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: 'var(--color-tungsten)' }}
            contentStyle={{ backgroundColor: 'var(--color-obsidian)', borderRadius: '4px', border: '1px solid var(--color-carbon)', color: 'var(--color-eink)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '11px', color: 'var(--color-steel)' }} />
          {yKeys.map((y) => (
            <Bar key={y.key} dataKey={y.key} name={y.name} fill={y.color} radius={[0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
