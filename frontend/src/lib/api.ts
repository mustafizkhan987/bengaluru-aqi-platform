import { Station, Reading, PredictionInput, PredictionResult, ExplanationResult, SimulationInput, SimulationResult, ModelMetrics } from './types';
import { subDays, formatISO } from 'date-fns';

/**
 * ============================================================================
 * BACKEND INTEGRATION NOTES (READ BEFORE SWAPPING WITH REAL API)
 * ============================================================================
 * 
 * 1. Synchronous vs Asynchronous (Polling):
 *    This mock assumes the ML backend returns predictions instantly. In reality,
 *    running an XGBoost/SHAP model might take several seconds, requiring a 
 *    polling architecture (e.g., POST to start job -> poll GET for status) 
 *    or WebSockets, rather than a simple async fetch.
 * 
 * 2. SHAP Payload Structure:
 *    The `ExplanationResult` type expects `{ feature: string; impact: number }[]`. 
 *    Python SHAP libraries usually output raw arrays or complex JSON objects. 
 *    You will likely need a data-wrangling step here to map the raw Python SHAP 
 *    output to this frontend structure.
 * 
 * 3. Feature Naming:
 *    Ensure the Python backend aligns feature keys exactly with what the frontend
 *    expects (e.g., 'pm25' vs 'PM2.5'), or handle the translation in these functions.
 * ============================================================================
 */

const MOCK_STATIONS: Station[] = [
  { id: 'S001', name: 'BTM Layout', lat: 12.9165, lng: 77.6101 },
  { id: 'S002', name: 'Jayanagar', lat: 12.9299, lng: 77.5824 },
  { id: 'S003', name: 'Silk Board', lat: 12.9172, lng: 77.6228 },
  { id: 'S004', name: 'Peenya', lat: 13.0329, lng: 77.5274 },
];

export async function getStations(): Promise<Station[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_STATIONS;
}

export async function getHistorical(stationId?: string): Promise<Reading[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const readings: Reading[] = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = subDays(now, 30 - i);
    readings.push({
      stationId: stationId || 'S001',
      timestamp: formatISO(date),
      pm25: Math.random() * 80 + 20,
      pm10: Math.random() * 120 + 40,
      no2: Math.random() * 50 + 10,
      o3: Math.random() * 40 + 5,
      co: Math.random() * 2 + 0.5,
      so2: Math.random() * 20 + 2,
      nh3: Math.random() * 10 + 1,
      aqi: Math.floor(Math.random() * 200 + 50)
    });
  }
  return readings;
}

export async function predictAQI(inputs: PredictionInput): Promise<PredictionResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Fake calculation based on inputs
  let aqi = 0;
  aqi += (inputs.pm25 || 0) * 1.5;
  aqi += (inputs.pm10 || 0) * 0.8;
  aqi += (inputs.no2 || 0) * 0.5;
  aqi = Math.min(500, Math.max(0, Math.round(aqi + 20))); // Add baseline

  let category = 'Good';
  if (aqi > 50) category = 'Satisfactory';
  if (aqi > 100) category = 'Moderate';
  if (aqi > 200) category = 'Poor';
  if (aqi > 300) category = 'Very Poor';
  if (aqi > 400) category = 'Severe';

  return {
    aqi,
    category,
    model: 'XGBoost Regressor',
    confidence: [Math.max(0, aqi - 15), Math.min(500, aqi + 15)]
  };
}

export async function getExplanation(inputs: PredictionInput): Promise<ExplanationResult> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Fake explanations based roughly on inputs
  return [
    { feature: 'PM2.5', impact: (inputs.pm25 || 0) * 1.1 },
    { feature: 'PM10', impact: (inputs.pm10 || 0) * 0.6 },
    { feature: 'NO₂', impact: (inputs.no2 || 0) * 0.4 },
    { feature: 'O₃', impact: (inputs.o3 || 0) * 0.2 },
    { feature: 'Wind Speed', impact: -12 },
    { feature: 'Temperature', impact: 5 }
  ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
}

export async function simulateIntervention(inputs: SimulationInput): Promise<{ result: SimulationResult, scenarios: Array<{ name: string, description: string, baseAqi: number, newAqi: number, adjustments: Record<string, number> }> }> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const baseResult = await predictAQI(inputs.base);
  
  // Calculate specific reduction
  const reducedInputs = { ...inputs.base };
  for (const [key, pct] of Object.entries(inputs.reductions)) {
    const k = key as keyof PredictionInput;
    if (reducedInputs[k] !== undefined) {
      reducedInputs[k] = reducedInputs[k] * (1 - (pct as number) / 100);
    }
  }
  
  const afterResult = await predictAQI(reducedInputs);
  
  const scenarios = [
    { name: 'Current', description: 'No interventions applied', baseAqi: baseResult.aqi, newAqi: baseResult.aqi, adjustments: {} as Record<string, number> },
    { name: 'Reduce Vehicle Emissions', description: '20% cut in PM2.5 and NO2', baseAqi: baseResult.aqi, newAqi: Math.max(0, Math.round(baseResult.aqi * 0.85)), adjustments: { pm25: 20, no2: 20 } },
    { name: 'Reduce Dust', description: '30% cut in PM10', baseAqi: baseResult.aqi, newAqi: Math.max(0, Math.round(baseResult.aqi * 0.92)), adjustments: { pm10: 30 } },
    { name: 'Combined Intervention', description: 'Aggressive 30% cut across PM2.5, PM10, and NO2', baseAqi: baseResult.aqi, newAqi: Math.max(0, Math.round(baseResult.aqi * 0.70)), adjustments: { pm25: 30, pm10: 30, no2: 30 } }
  ];

  return {
    result: {
      before: baseResult.aqi,
      after: afterResult.aqi,
      improvementPct: Math.round(((baseResult.aqi - afterResult.aqi) / Math.max(1, baseResult.aqi)) * 100)
    },
    scenarios
  };
}

export async function getModelMetrics(): Promise<ModelMetrics[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    { model: 'Linear Regression', mae: 24.5, rmse: 31.2, r2: 0.68 },
    { model: 'Random Forest', mae: 15.2, rmse: 19.8, r2: 0.85 },
    { model: 'XGBoost', mae: 12.1, rmse: 16.4, r2: 0.91 }
  ];
}
