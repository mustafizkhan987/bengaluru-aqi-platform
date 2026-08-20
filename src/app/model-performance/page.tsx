import { getModelMetrics } from '@/lib/api';
import { CheckCircle2, Info } from 'lucide-react';
import { PerformanceChart } from '@/components/PerformanceChart';

export default async function ModelPerformancePage() {
  const metrics = await getModelMetrics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold font-mono text-eink tracking-tight uppercase">Model Metrics</h1>
        <p className="text-lg text-steel mt-3 max-w-2xl mx-auto">
          Review the evaluation metrics of the machine learning models tested for this project.
        </p>
      </div>

      <div className="bg-obsidian border border-carbon text-steel p-4 rounded font-mono text-xs flex gap-3 max-w-3xl mx-auto">
        <Info className="h-4 w-4 flex-shrink-0" />
        <p>
          SYS_LOG: The metrics displayed below (MAE, RMSE, R²) represent the baseline validation performance. Continuous learning algorithms will update these figures periodically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-graphite border border-carbon p-6 md:p-10 rounded-2xl transition-colors duration-300 overflow-hidden">
          <h2 className="text-sm font-mono text-steel uppercase tracking-widest mb-6 border-b border-carbon pb-2">Metrics Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse data-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th className="text-right">MAE</th>
                  <th className="text-right">RMSE</th>
                  <th className="text-right">R² Score</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => {
                  const isProd = m.model === 'XGBoost';
                  return (
                    <tr key={m.model} className={isProd ? 'bg-emerald-500/5 relative' : ''}>
                      {isProd && <td className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 p-0 border-0"></td>}
                      <td className={isProd ? 'pl-6 font-mono text-emerald-400 font-bold text-xs uppercase' : 'font-mono text-eink font-bold text-xs uppercase'}>
                        <div className="flex items-center gap-2">
                          {isProd && <CheckCircle2 className="h-4 w-4" />}
                          {m.model}
                          {isProd && <span className="text-[10px] font-semibold px-1.5 py-0.5 border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">PRODUCTION</span>}
                        </div>
                      </td>
                      <td className="text-right">{m.mae.toFixed(1)}</td>
                      <td className="text-right">{m.rmse.toFixed(1)}</td>
                      <td className="text-right text-eink">{m.r2.toFixed(3)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-graphite border border-carbon p-6 md:p-10 rounded-2xl transition-colors duration-300 min-w-0">
          <h2 className="text-sm font-mono text-steel uppercase tracking-widest mb-6 border-b border-carbon pb-2">Error vs Accuracy (RMSE / R²)</h2>
          <PerformanceChart metrics={metrics} />
        </div>
      </div>
    </div>
  );
}
