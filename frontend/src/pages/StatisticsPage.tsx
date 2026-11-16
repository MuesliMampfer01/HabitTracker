import { Navbar } from "../components/Navbar";

export const StatsPage = () => {
  return (
    <div
      className="min-h-screen w-full text-slate-100 px-6 pt-4 pb-10 md:px-10 md:pt-6 font-mono"
      style={{
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 40%, #080a0f 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <Navbar />
        <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center text-emerald-500/60">
          &gt; MODULE: ANALYTICS_AND_STATS // IN_DEVELOPMENT
        </div>
      </div>
    </div>
  );
};
