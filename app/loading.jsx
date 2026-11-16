import { Code2, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030014] select-none">
      <div className="absolute w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-[#8245ec]/25 to-[#00f2fe]/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full px-6 z-10">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-purple-500/40 animate-spin" style={{ animationDuration: '8s' }} />
          <div
            className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-t-purple-400 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          />
          <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#1b103e] to-[#0a0624] border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Code2 className="w-7 h-7 sm:w-8 sm:h-8 text-purple-300 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-bounce" />
          <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-wide bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
            &lt; Iqbal Musyaffa /&gt;
          </h2>
        </div>

        <p className="text-xs text-gray-400 font-medium tracking-wide mb-6">
          Memuat halaman...
        </p>

        <div className="w-48 bg-[#120a2e] rounded-full h-1.5 border border-purple-500/30 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-[#8245ec] via-[#a855f7] to-[#00f2fe] rounded-full w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
