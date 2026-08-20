'use client';
import { useState } from 'react';
import { predictAQI, getExplanation } from '@/lib/api';
import { PredictionInput, PredictionResult, ExplanationResult } from '@/lib/types';
import { PollutantInputForm } from '@/components/PollutantInputForm';
import { SignedContributionChart } from '@/components/SignedContributionChart';
import { AQIBadge } from '@/components/AQIBadge';
import { getAQIColor } from '@/lib/aqi';
import { Activity } from 'lucide-react';

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);

  const handlePredict = async (values: PredictionInput) => {
    setLoading(true);
    try {
      const [predResult, explResult] = await Promise.all([
        predictAQI(values),
        getExplanation(values)
      ]);
      setResult(predResult);
      setExplanation(explResult);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const topContributor = explanation && explanation.length > 0 
    ? explanation.reduce((prev, current) => (Math.abs(prev.impact) > Math.abs(current.impact)) ? prev : current) 
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold font-mono text-eink tracking-tight uppercase">Telemetry Forecast</h1>
        <p className="text-lg text-steel mt-3 max-w-2xl mx-auto">
          Input atmospheric parameters to generate an AQI forecast. XAI diagnostics will break down feature attributions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-graphite border border-carbon p-6 md:p-10 rounded-2xl transition-colors duration-300">
            <h2 className="text-sm font-mono text-steel uppercase tracking-widest mb-6 border-b border-carbon pb-2">Sensor Parameters</h2>
            <PollutantInputForm onSubmit={handlePredict} loading={loading} />
          </div>

          {result && explanation && (
            <div className="bg-graphite border border-carbon p-6 md:p-10 rounded-2xl transition-colors duration-300 snap-reveal min-w-0">
              <h2 className="text-sm font-mono text-steel uppercase tracking-widest mb-6 border-b border-carbon pb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Diagnostic Readout (SHAP)
              </h2>
              <SignedContributionChart data={explanation} loading={loading} />
              
              <div className="mt-8 p-4 bg-obsidian border border-carbon rounded font-mono text-xs text-steel">
                <span className="text-emerald-400">SYS_LOG: </span>
                {topContributor ? (
                  `Primary driver identified as [${topContributor.feature.toUpperCase()}], applying a ${topContributor.impact > 0 ? '+' : ''}${topContributor.impact.toFixed(1)} delta to the baseline index.`
                ) : (
                  'Model feature contributions are currently balanced.'
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-graphite border border-carbon p-6 md:p-8 rounded-2xl transition-colors duration-300 lg:sticky lg:top-24">
            <h2 className="text-sm font-mono text-steel uppercase tracking-widest mb-6 border-b border-carbon pb-2">Prediction Output</h2>
            
            {!result && !loading && (
              <div className="text-steel font-mono text-xs text-center py-12 border border-dashed border-carbon rounded bg-obsidian/50">
                AWAITING_INPUT...
              </div>
            )}

            {loading && (
              <div className="space-y-4 skeleton-shimmer p-4 rounded-xl h-48 opacity-50"></div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                <div 
                  className="p-8 rounded bg-obsidian border border-carbon text-center relative overflow-hidden"
                >
                  {/* Subtle ambient glow behind the number based on AQI color */}
                  <div 
                    className="absolute inset-0 opacity-20 blur-2xl" 
                    style={{ backgroundColor: getAQIColor(result.aqi) }} 
                  />
                  <div className="relative z-10">
                    <div className="text-[10px] font-mono text-steel mb-2 uppercase tracking-[0.2em]">Forecast Index</div>
                    <div 
                      className="text-7xl font-numeric text-eink mb-4 telemetry-glow"
                      style={{ color: getAQIColor(result.aqi) }}
                    >
                      {result.aqi}
                    </div>
                    <AQIBadge value={result.aqi} />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-carbon font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-steel">MODEL_REF</span>
                    <span className="text-eink">{result.model.toUpperCase()}</span>
                  </div>
                  {result.confidence && (
                    <div className="flex justify-between">
                      <span className="text-steel">CONF_INTERVAL</span>
                      <span className="text-eink">
                        [{result.confidence[0]}, {result.confidence[1]}]
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
