import React, { useState } from 'react';

interface AudioControlPanelProps {
  onPing: (data: any, position: [number, number, number]) => void;
  onResetScans: () => void;
  isLoading: boolean;
}

export const AudioControlPanel: React.FC<AudioControlPanelProps> = ({ onPing, onResetScans, isLoading }) => {
  const [signalType, setSignalType] = useState('Linear Chirp');
  const [startFreq, setStartFreq] = useState(2000);
  const [endFreq, setEndFreq] = useState(10000);
  const [duration, setDuration] = useState(0.5);
  const [volume, setVolume] = useState(0.8);
  const [useDenoising, setUseDenoising] = useState(false);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [posZ, setPosZ] = useState(0);

  const handlePing = () => {
    let backendSignalType = 'linear_chirp';
    if (signalType === 'Logarithmic Chirp') backendSignalType = 'log_chirp';
    if (signalType === 'MLS (Maximum Length Sequence)') backendSignalType = 'mls';
    onPing({
      signal_type: backendSignalType,
      f0: startFreq, f1: endFreq, duration, volume,
      sample_rate: 48000, use_denoising: useDenoising
    }, [posX, posY, posZ]);
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-dim)] mb-3">{children}</div>
  );

  return (
    <div className="space-y-5">
      
      {/* Signal Configuration */}
      <div>
        <SectionLabel>Signal Configuration</SectionLabel>
        <div className="space-y-3">
          <select 
            value={signalType}
            onChange={(e) => setSignalType(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] text-[11px] text-[var(--text-primary)] px-3 py-2 rounded-md focus:outline-none focus:border-[var(--accent)] transition-colors"
          >
            <option>Linear Chirp</option>
            <option>Logarithmic Chirp</option>
            <option>MLS (Maximum Length Sequence)</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider">Start</label>
                <span className="text-[10px] text-[var(--accent)] tabular-nums">{(startFreq / 1000).toFixed(1)}k</span>
              </div>
              <input type="range" min="100" max="20000" step="10" 
                value={startFreq} onChange={(e) => setStartFreq(Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider">End</label>
                <span className="text-[10px] text-[var(--accent)] tabular-nums">{(endFreq / 1000).toFixed(1)}k</span>
              </div>
              <input type="range" min="100" max="20000" step="10" 
                value={endFreq} onChange={(e) => setEndFreq(Number(e.target.value))}
                className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider">Duration</label>
                <span className="text-[10px] text-[var(--accent)] tabular-nums">{duration.toFixed(2)}s</span>
              </div>
              <input type="range" min="0.05" max="2.0" step="0.05" 
                value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider">Volume</label>
                <span className="text-[10px] text-[var(--accent)] tabular-nums">{Math.round(volume * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" 
                value={volume} onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Processing */}
      <div className="border-t border-[var(--border)] pt-4">
        <SectionLabel>Processing</SectionLabel>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input type="checkbox" checked={useDenoising} onChange={(e) => setUseDenoising(e.target.checked)} />
          <div>
            <div className="text-[11px] font-medium text-[var(--text-primary)] group-hover:text-white transition-colors">AI Spectral Denoising</div>
            <div className="text-[9px] text-[var(--text-dim)] leading-relaxed mt-0.5">Removes stationary background noise</div>
          </div>
        </label>
      </div>

      {/* Odometry */}
      <div className="border-t border-[var(--border)] pt-4">
        <SectionLabel>Manual Odometry</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'X', value: posX, set: setPosX },
            { label: 'Y', value: posY, set: setPosY },
            { label: 'Z', value: posZ, set: setPosZ }
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="block text-[9px] text-[var(--text-dim)] uppercase tracking-wider mb-1 text-center">{label} (m)</label>
              <input 
                type="number" step="0.1"
                value={value} onChange={(e) => set(Number(e.target.value))}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] text-[11px] text-[var(--accent)] px-2 py-1.5 rounded-md focus:outline-none focus:border-[var(--accent)] text-center transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-3">
        <button
          onClick={handlePing}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-white rounded-md transition-all
            ${isLoading 
              ? 'bg-[var(--bg-elevated)] text-[var(--text-dim)] cursor-not-allowed' 
              : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-muted)] shadow-md shadow-blue-500/10 hover:shadow-blue-500/20'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              Scanning…
            </span>
          ) : 'Initialize Scan'}
        </button>

        <button
          onClick={onResetScans}
          className="w-full py-2 px-4 text-[10px] font-medium uppercase tracking-wider text-[var(--text-dim)] hover:text-[var(--text-secondary)] bg-transparent hover:bg-[var(--bg-elevated)] rounded-md transition-all border border-transparent hover:border-[var(--border)]"
        >
          Reset Map
        </button>
      </div>

    </div>
  );
};
