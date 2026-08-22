export type Station = { id: string; name: string; lat: number; lng: number };
export type Reading = { stationId: string; timestamp: string; pm25: number; pm10: number; no2: number; o3: number; co: number; so2?: number; nh3?: number; aqi: number };
export type PredictionInput = { pm25: number; pm10: number; no2: number; o3: number; co: number; so2?: number; nh3?: number };
export type PredictionResult = { aqi: number; category: string; model: string; confidence?: [number, number] };
export type ExplanationResult = { feature: string; impact: number }[];
export type SimulationInput = { base: PredictionInput; reductions: Partial<Record<keyof PredictionInput, number>> };
export type SimulationResult = { before: number; after: number; improvementPct: number };
export type ModelMetrics = { model: string; mae: number; rmse: number; r2: number };
