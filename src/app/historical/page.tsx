import { getStations, getHistorical } from '@/lib/api';
import { HistoricalClient } from '@/components/HistoricalClient';
import { Reading } from '@/lib/types';

export default async function HistoricalAnalysis() {
  const stations = await getStations();
  const initialStation = stations.length > 0 ? stations[0] : null;
  let initialHistorical: Reading[] = [];
  
  if (initialStation) {
    try {
      const data = await getHistorical(initialStation.id);
      initialHistorical = data.reverse();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <HistoricalClient 
      initialStations={stations} 
      initialSelectedStation={initialStation?.id || ''} 
      initialHistorical={initialHistorical}
    />
  );
}
