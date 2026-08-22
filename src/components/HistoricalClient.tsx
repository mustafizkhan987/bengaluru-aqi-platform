'use client';
import { useState, useEffect, useRef } from 'react';
import { getStations, getHistorical } from '@/lib/api';
import { Station, Reading } from '@/lib/types';
import dynamic from 'next/dynamic';
const TimeSeriesChart = dynamic(() => import('@/components/TimeSeriesChart').then(m => m.TimeSeriesChart), { ssr: false });
const BarComparisonChart = dynamic(() => import('@/components/BarComparisonChart').then(m => m.BarComparisonChart), { ssr: false });
import { Filter, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface HistoricalClientProps {
  initialStations: Station[];
  initialSelectedStation: string;
  initialHistorical: Reading[];
}

export function HistoricalClient({ initialStations, initialSelectedStation, initialHistorical }: HistoricalClientProps) {
  const [stations] = useState<Station[]>(initialStations);
  const [selectedStation, setSelectedStation] = useState<string>(initialSelectedStation);
  const [selectedPollutant, setSelectedPollutant] = useState<'aqi' | 'pm25'>('aqi');
  
  const [readings, setReadings] = useState<Reading[]>(initialHistorical);
  const [loading, setLoading] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    async function loadData() {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      try {
        setLoading(true);
        // Reverse so time goes left to right
        const data = await getHistorical(selectedStation);
        setReadings(data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedStation]);

  // Derived data for charts
  const monthlyData = readings.slice(-7).map(r => ({
    name: format(new Date(r.timestamp), 'MMM dd'),
    aqi: r.aqi,
    pm25: r.pm25
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Historical Analysis</h1>
        <p className="text-lg text-[#86868b] dark:text-[#98989d] mt-2 max-w-2xl mx-auto">
          Explore historical trends, compare stations, and analyze seasonal variations in air quality metrics.
        </p>
      </div>



      {/* Filters */}
      <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6 rounded-3xl transition-colors duration-300 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-[#86868b] dark:text-[#98989d] mr-2">
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filters:</span>
        </div>
        
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="bg-white dark:bg-[#2c2c2e] border-none text-[#1d1d1f] dark:text-white rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          disabled={loading && stations.length === 0}
        >
          {stations.map(st => (
            <option key={st.id} value={st.id}>{st.name}</option>
          ))}
        </select>

        <select
          value={selectedPollutant}
          onChange={(e) => setSelectedPollutant(e.target.value as 'aqi' | 'pm25')}
          className="bg-white dark:bg-[#2c2c2e] border-none text-[#1d1d1f] dark:text-white rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        >
          <option value="aqi">AQI</option>
          <option value="pm25">PM2.5</option>
        </select>
        
        {/* Mock Year/Month filters for UI compliance */}
        <select className="bg-white dark:bg-[#2c2c2e] border-none text-[#1d1d1f] dark:text-white rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
          <option>2023</option>
          <option>2022</option>
          <option>2021</option>
        </select>

        <select className="bg-white dark:bg-[#2c2c2e] border-none text-[#1d1d1f] dark:text-white rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
          <option>All Months</option>
          <option>January</option>
          <option>February</option>
          <option>March</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6 md:p-10 rounded-3xl transition-colors duration-300 min-w-0">
          <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-8 tracking-tight">
            {selectedPollutant === 'aqi' ? 'AQI' : 'PM2.5'} Over Time
          </h3>
          <TimeSeriesChart 
            data={readings} 
            xKey="timestamp" 
            formatXAsDate={true}
            yKeys={[{ 
              key: selectedPollutant, 
              color: selectedPollutant === 'aqi' ? '#10b981' : '#f59e0b', 
              name: selectedPollutant.toUpperCase() 
            }]} 
            loading={loading} 
          />
        </div>

        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6 md:p-10 rounded-3xl transition-colors duration-300 min-w-0">
          <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-8 tracking-tight">PM10 Over Time</h3>
          <TimeSeriesChart 
            data={readings} 
            xKey="timestamp" 
            formatXAsDate={true}
            yKeys={[{ key: 'pm10', color: '#6366f1', name: 'PM10' }]} 
            loading={loading} 
          />
        </div>

        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6 md:p-10 rounded-3xl transition-colors duration-300 lg:col-span-2 min-w-0">
          <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-8 tracking-tight">Recent Averages (Last 7 Days)</h3>
          <BarComparisonChart 
            data={monthlyData} 
            xKey="name" 
            yKeys={[
              { key: 'aqi', color: '#10b981', name: 'AQI' },
              { key: 'pm25', color: '#f59e0b', name: 'PM2.5' }
            ]} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
}
