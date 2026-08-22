import { getStations, getHistorical, getExplanation } from '@/lib/api';
import { DashboardClient } from '@/components/DashboardClient';
import { Reading, ExplanationResult } from '@/lib/types';

export default async function Dashboard() {
  const stations = await getStations();
  const initialStation = stations.length > 0 ? stations[0] : null;
  let initialHistorical: Reading[] = [];
  let initialDrivers: ExplanationResult | null = null;
  
  if (initialStation) {
    try {
      const data = await getHistorical(initialStation.id);
      initialHistorical = data;
      if (data.length > 0) {
        const explanation = await getExplanation({
          pm25: data[0].pm25,
          pm10: data[0].pm10,
          no2: data[0].no2,
          o3: data[0].o3,
          co: data[0].co
        });
        initialDrivers = explanation.slice(0, 3);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardClient 
      initialStations={stations} 
      initialSelectedStation={initialStation?.id || ''} 
      initialHistorical={initialHistorical}
      initialDrivers={initialDrivers}
    />
  );
}
