'use client';
import { useEffect, useState } from 'react';
import { getStations, getHistorical, getExplanation } from '@/lib/api';
import { Station, Reading, ExplanationResult } from '@/lib/types';
import { StatCard } from '@/components/StatCard';
import { AQIBadge } from '@/components/AQIBadge';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Activity, AlertTriangle } from 'lucide-react';
import { getAQIColor } from '@/lib/aqi';
import { RevealSection } from '@/components/RevealSection';

export default function Dashboard() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [latestReading, setLatestReading] = useState<Reading | null>(null);
  const [drivers, setDrivers] = useState<ExplanationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);
        const st = await getStations();
        setStations(st);
        if (st.length > 0) {
          setSelectedStation(st[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadInitial();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!selectedStation) return;
      try {
        setLoading(true);
        const data = await getHistorical(selectedStation);
        // data[0] is the most recent (simulated)
        if (data.length > 0) {
          setLatestReading(data[0]);
          // mock explanation for current state
          const explanation = await getExplanation({
            pm25: data[0].pm25,
            pm10: data[0].pm10,
            no2: data[0].no2,
            o3: data[0].o3,
            co: data[0].co
          });
          setDrivers(explanation.slice(0, 3)); // Top 3
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedStation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      <RevealSection>
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">Current Air Quality</h1>
          <p className="text-lg text-[#86868b] dark:text-[#98989d] mt-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {latestReading ? `Last updated ${formatDistanceToNow(new Date(latestReading.timestamp))} ago` : 'Loading latest data...'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#f5f5f7] dark:bg-[#1c1c1e] p-3 rounded-2xl transition-colors duration-300">
          <MapPin className="h-5 w-5 text-[#86868b] dark:text-[#98989d]" />
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="bg-[#f5f5f7] dark:bg-[#1c1c1e] border-none text-[#1d1d1f] dark:text-white font-medium focus:ring-0 cursor-pointer outline-none rounded-lg"
            disabled={loading && stations.length === 0}
          >
            {stations.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>
        </div>
      </RevealSection>

      <RevealSection delay={50}>
        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-300 mb-1">
                Demo Data Notice
              </p>
              <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                Data shown is generated from a mock data layer (src/lib/api.ts) for demonstration purposes. 
                In production, this dashboard will connect to real-time CPCB monitoring stations and live ML predictions.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection delay={100}>
        {/* Hero Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Air Quality Index (AQI)"
          value={latestReading?.aqi}
          badge={latestReading && <AQIBadge value={latestReading.aqi} />}
          loading={loading}
          className="lg:col-span-1 md:col-span-2 border-l-4"
          style={{ borderLeftColor: latestReading ? getAQIColor(latestReading.aqi) : '#e2e8f0' }}
        />
        <StatCard
          title="PM2.5 (Fine Particulate Matter)"
          value={latestReading?.pm25.toFixed(1)}
          unit="µg/m³"
          loading={loading}
        />
        <StatCard
          title="PM10 (Coarse Particulate Matter)"
          value={latestReading?.pm10.toFixed(1)}
          unit="µg/m³"
          loading={loading}
        />
        <StatCard
          title="Nitrogen Dioxide (NO₂)"
          value={latestReading?.no2.toFixed(1)}
          unit="µg/m³"
          loading={loading}
        />
        <StatCard
          title="Ozone (O₃)"
          value={latestReading?.o3.toFixed(1)}
          unit="µg/m³"
          loading={loading}
        />
        <StatCard
          title="Carbon Monoxide (CO)"
          value={latestReading?.co.toFixed(2)}
          unit="mg/m³"
          loading={loading}
        />
        </div>
      </RevealSection>

      <RevealSection delay={200}>
        {/* Drivers Panel */}
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-3xl p-6 md:p-10 transition-colors duration-300">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">What&apos;s driving air quality right now?</h2>
            <p className="text-lg text-[#86868b] dark:text-[#98989d] mt-1">
              Based on our real-time model analysis, these are the primary pollutants affecting the AQI at the selected station.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded animate-pulse w-full max-w-md"></div>
            <div className="h-6 bg-slate-200 rounded animate-pulse w-full max-w-sm"></div>
            <div className="h-6 bg-slate-200 rounded animate-pulse w-full max-w-xs"></div>
          </div>
        ) : drivers ? (
          <div className="space-y-6">
            {drivers.map((driver) => {
              const impactColor = driver.impact > 0 ? 'bg-rose-500' : 'bg-emerald-500';
              const maxImpact = Math.max(...drivers.map(d => Math.abs(d.impact)));
              const widthPct = Math.min(100, Math.max(10, (Math.abs(driver.impact) / maxImpact) * 100));

              return (
                <div key={driver.feature}>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span className="text-[#1d1d1f] dark:text-white">{driver.feature}</span>
                    <span className="text-[#86868b] dark:text-[#98989d]">{driver.impact > 0 ? '+' : ''}{driver.impact.toFixed(1)} AQI impact</span>
                  </div>
                  <div className="w-full bg-[#e5e5ea] dark:bg-white/10 rounded-full h-3">
                    <div className={`${impactColor} h-2.5 rounded-full`} style={{ width: `${widthPct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[#86868b] dark:text-[#98989d] italic">No explanation data available.</p>
        )}
        </div>
      </RevealSection>
    </div>
  );
}
