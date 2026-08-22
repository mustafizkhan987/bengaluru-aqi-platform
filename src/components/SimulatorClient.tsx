'use client';
import { useState, useEffect, useDeferredValue, useRef } from 'react';
import { simulateIntervention, predictAQI } from '@/lib/api';
import { PredictionInput, SimulationResult } from '@/lib/types';
import { SliderControl } from '@/components/SliderControl';
import { AQIBadge } from '@/components/AQIBadge';
import { AlertTriangle, ArrowRight, Settings2, Activity } from 'lucide-react';
import { getAQIColor } from '@/lib/aqi';

interface SimulatorClientProps {
  initialBaseAqi: number;
  initialSimResult: any; // Using any for brevity here, type is complex
}

export function SimulatorClient({ initialBaseAqi, initialSimResult }: SimulatorClientProps) {
  const [loading, setLoading] = useState(false);
  
  const [baseInput] = useState<PredictionInput>({
    pm25: 120,
    pm10: 180,
    no2: 60,
    o3: 35,
    co: 1.2
  });
  
  const [baseAqi] = useState<number>(initialBaseAqi);
  
  const [reductions, setReductions] = useState({
    pm25: 0,
    pm10: 0,
    no2: 0,
  });

  const [simResult, setSimResult] = useState<{ result: SimulationResult, scenarios: Array<{ name: string, description: string, baseAqi: number, newAqi: number, adjustments: Record<string, number> }> } | null>(initialSimResult);

  const deferredReductions = useDeferredValue(reductions);

  const isInitialMount = useRef(true);

  useEffect(() => {
    async function runSim() {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      setLoading(true);
      try {
        const res = await simulateIntervention({
          base: baseInput,
          reductions: {
            pm25: deferredReductions.pm25,
            pm10: deferredReductions.pm10,
            no2: deferredReductions.no2
          }
        });
        setSimResult(res);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    runSim();
  }, [deferredReductions, baseInput]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold font-mono text-eink tracking-tight uppercase">Simulation Matrix</h1>
        <p className="text-lg text-steel mt-3 max-w-2xl mx-auto">
          Manipulate emission variables in real-time to model targeted reduction policies and their impact on the AQI baseline.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-lg max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-300 mb-1">
              Demo Simulation Notice
            </p>
            <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
              Intervention simulations use mock data for demonstration. Production version will use validated atmospheric models 
              and real policy impact coefficients from the research team.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-obsidian border border-amber-500/30 p-4 rounded text-amber-500/80 font-mono text-xs flex gap-3 max-w-4xl mx-auto">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <p>
          SYS_WARNING: Output represents theoretical model limits. Intervention scenarios do not guarantee physical atmospheric convergence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-graphite border border-carbon p-8 rounded-2xl transition-colors duration-300">
            <h2 className="text-sm font-mono text-steel uppercase tracking-widest mb-8 border-b border-carbon pb-2 flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Reduction Targets
            </h2>
            
            <div className="space-y-10 mb-4">
              <SliderControl 
                label="PM2.5 DELTA" 
                value={reductions.pm25} 
                onChange={(v) => setReductions(prev => ({ ...prev, pm25: v }))} 
                disabled={loading}
              />
              <SliderControl 
                label="PM10 DELTA" 
                value={reductions.pm10} 
                onChange={(v) => setReductions(prev => ({ ...prev, pm10: v }))}
                disabled={loading} 
              />
              <SliderControl 
                label="NO₂ DELTA" 
                value={reductions.no2} 
                onChange={(v) => setReductions(prev => ({ ...prev, no2: v }))}
                disabled={loading} 
              />
            </div>

            </div>
          </div>

        {/* Results Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-graphite border border-carbon p-6 md:p-10 rounded-2xl transition-colors duration-300">
            <h2 className="text-sm font-mono text-steel uppercase tracking-widest mb-8 border-b border-carbon pb-2">Simulation State</h2>
            
            {!simResult ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-carbon rounded bg-obsidian">
                <div className="text-5xl font-numeric text-steel mb-4">{baseAqi}</div>
                <div className="text-xs font-mono text-steel uppercase tracking-widest">Baseline AQI</div>
              </div>
            ) : (
              <div className="snap-reveal">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-8 p-8 bg-obsidian rounded border border-carbon relative overflow-hidden">
                  
                  {/* Left: Before */}
                  <div className="text-center flex-1 relative z-10">
                    <div className="text-[10px] font-mono text-steel mb-2 uppercase tracking-[0.2em]">Initial State</div>
                    <div 
                      className="text-6xl font-numeric mb-3 telemetry-glow"
                      style={{ color: getAQIColor(simResult.result.before) }}
                    >
                      {simResult.result.before}
                    </div>
                    <AQIBadge value={simResult.result.before} />
                  </div>
                  
                  <div className="hidden sm:block text-carbon relative z-10">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                  
                  {/* Right: After */}
                  <div className="text-center flex-1 relative z-10">
                    <div className="absolute inset-0 opacity-10 blur-xl" style={{ backgroundColor: getAQIColor(simResult.result.after) }} />
                    <div className="text-[10px] font-mono text-steel mb-2 uppercase tracking-[0.2em] relative z-10">Simulated State</div>
                    <div 
                      className="text-6xl font-numeric mb-3 telemetry-glow relative z-10"
                      style={{ color: getAQIColor(simResult.result.after) }}
                    >
                      {simResult.result.after}
                    </div>
                    <AQIBadge value={simResult.result.after} />
                  </div>
                </div>

                <div className="border border-emerald-500/20 bg-emerald-500/5 rounded p-4 text-center">
                  <span className="text-steel font-mono text-xs uppercase tracking-widest">Delta Calculation: </span>
                  <span className="text-emerald-400 font-numeric font-bold text-sm tracking-widest">-{simResult.result.improvementPct}% TOTAL AQI</span>
                </div>
              </div>
            )}
          </div>

          {/* Scenarios Comparison */}
          {simResult && (
            <div className="bg-graphite border border-carbon p-6 md:p-10 rounded-2xl transition-colors snap-reveal delay-100">
              <h2 className="text-sm font-mono text-steel uppercase tracking-widest mb-6 border-b border-carbon pb-2">Policy Intervention Log</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse data-table">
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th>Adjustments</th>
                      <th className="text-right">Projected Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simResult.scenarios.map((scenario, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="font-mono text-eink font-bold text-xs uppercase">{scenario.name}</div>
                          <div className="text-xs text-steel mt-1 font-sans">{scenario.description}</div>
                        </td>
                        <td>
                          {Object.keys(scenario.adjustments).length === 0 ? (
                            <span className="text-steel italic text-xs font-mono">NULL</span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(scenario.adjustments).map(([key, val]) => (
                                <span key={key} className="inline-flex items-center px-1.5 py-0.5 border border-carbon text-[10px] font-mono text-steel uppercase">
                                  {key}: -{val}%
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <AQIBadge value={scenario.newAqi} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Custom user scenario */}
                    <tr className="bg-emerald-500/5 relative">
                      {/* Left border highlight */}
                      <td className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 p-0 border-0"></td>
                      
                      <td className="pl-6">
                        <div className="font-mono text-emerald-400 font-bold text-xs uppercase">ACTIVE_SIMULATION</div>
                        <div className="text-xs text-steel mt-1 font-sans">Current slider configuration</div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(reductions).map(([key, val]) => val > 0 ? (
                            <span key={key} className="inline-flex items-center px-1.5 py-0.5 border border-emerald-500/50 bg-emerald-500/10 text-[10px] font-mono text-emerald-400 uppercase">
                              {key}: -{val}%
                            </span>
                          ) : null)}
                          {Object.values(reductions).every(v => v === 0) && (
                             <span className="text-steel italic text-xs font-mono">NULL</span>
                          )}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <AQIBadge value={simResult.result.after} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
