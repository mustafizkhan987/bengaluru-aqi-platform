'use client';
import { PredictionInput } from '@/lib/types';
import { useState } from 'react';

interface PollutantInputFormProps {
  initialValues?: Partial<PredictionInput>;
  onSubmit: (values: PredictionInput) => void;
  loading?: boolean;
}

export function PollutantInputForm({ initialValues, onSubmit, loading }: PollutantInputFormProps) {
  const [values, setValues] = useState<PredictionInput>({
    pm25: initialValues?.pm25 || 0,
    pm10: initialValues?.pm10 || 0,
    no2: initialValues?.no2 || 0,
    o3: initialValues?.o3 || 0,
    co: initialValues?.co || 0,
    so2: initialValues?.so2 || 0,
    nh3: initialValues?.nh3 || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: Math.max(0, parseFloat(value) || 0)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { id: 'pm25', label: 'PM2.5', unit: 'µg/m³', step: '0.1' },
          { id: 'pm10', label: 'PM10', unit: 'µg/m³', step: '0.1' },
          { id: 'no2', label: 'NO₂', unit: 'µg/m³', step: '0.1' },
          { id: 'o3', label: 'O₃', unit: 'µg/m³', step: '0.1' },
          { id: 'co', label: 'CO', unit: 'mg/m³', step: '0.01' },
          { id: 'so2', label: 'SO₂ (Optional)', unit: 'µg/m³', step: '0.1' },
          { id: 'nh3', label: 'NH₃ (Optional)', unit: 'µg/m³', step: '0.1' },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-[#1d1d1f] dark:text-white mb-1">
              {field.label}
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                name={field.id}
                id={field.id}
                step={field.step}
                min="0"
                required={!field.id.includes('Optional')}
                value={values[field.id as keyof PredictionInput]}
                onChange={handleChange}
                className="block w-full rounded-2xl bg-white dark:bg-white/5 border-none text-[#1d1d1f] dark:text-white pl-4 pr-16 py-3 focus:ring-2 focus:ring-blue-500 sm:text-sm outline-none transition-shadow"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-[#86868b] dark:text-[#98989d] sm:text-sm font-medium">{field.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex justify-center rounded-full border border-transparent bg-blue-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Predicting...' : 'Predict AQI'}
        </button>
      </div>
    </form>
  );
}
