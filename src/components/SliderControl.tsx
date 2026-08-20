'use client';
import { cn } from '@/lib/utils';

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function SliderControl({ label, value, onChange, disabled }: SliderControlProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-mono text-steel uppercase tracking-widest">{label}</label>
        <span className={cn("inline-flex items-center px-2 py-0.5 border text-xs font-numeric font-bold bg-obsidian", value > 0 ? "border-emerald-500 text-emerald-400 telemetry-glow" : "border-carbon text-steel")}>
          -{value}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="w-full h-1 bg-carbon rounded-none appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-[10px] font-mono text-carbon">
        <span>00</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
