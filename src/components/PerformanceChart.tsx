'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ModelMetrics } from '@/lib/types';

interface PerformanceChartProps {
  metrics: ModelMetrics[];
}

export function PerformanceChart({ metrics }: PerformanceChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={metrics} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--color-carbon)" />
          <XAxis dataKey="model" tick={{ fill: 'var(--color-steel)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" orientation="left" tick={{ fill: 'var(--color-steel)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'RMSE', angle: -90, position: 'insideLeft', fill: 'var(--color-steel)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-steel)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'R²', angle: 90, position: 'insideRight', fill: 'var(--color-steel)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10 }} domain={[0, 1]} />
          <Tooltip 
            cursor={{ fill: 'var(--color-tungsten)' }}
            contentStyle={{ backgroundColor: 'var(--color-obsidian)', borderRadius: '4px', border: '1px solid var(--color-carbon)', color: 'var(--color-eink)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'var(--font-jetbrains-mono)', fontSize: '11px', color: 'var(--color-steel)' }} />
          <Bar yAxisId="left" dataKey="rmse" name="RMSE (Lower is better)" fill="var(--color-aqi-unhealthy)" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="right" dataKey="r2" name="R² (Higher is better)" fill="var(--color-aqi-good)" radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
