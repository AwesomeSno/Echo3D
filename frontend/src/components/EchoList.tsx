import React from 'react';

export interface Echo {
  distance: number;
  tof: number;
  strength: number;
  type: string;
  scanId?: number;
}

interface EchoListProps {
  echoes: Echo[];
}

export const EchoList: React.FC<EchoListProps> = ({ echoes }) => {
  if (echoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-[var(--text-dim)]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-30">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <div className="text-[10px] uppercase tracking-[0.2em]">No targets acquired</div>
        <div className="text-[9px] mt-1 opacity-60">Run a scan to populate this table</div>
      </div>
    );
  }

  const sortedEchoes = [...echoes].sort((a, b) => {
    if (a.scanId && b.scanId && a.scanId !== b.scanId) return b.scanId - a.scanId;
    return a.distance - b.distance;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider border-b border-[var(--border)]">
            <th className="pb-2.5 font-medium w-14 pl-1">Scan</th>
            <th className="pb-2.5 font-medium w-10">#</th>
            <th className="pb-2.5 font-medium w-20">Type</th>
            <th className="pb-2.5 font-medium">Distance</th>
            <th className="pb-2.5 font-medium">TOF</th>
            <th className="pb-2.5 font-medium w-40">Amplitude</th>
          </tr>
        </thead>
        <tbody>
          {sortedEchoes.map((echo, idx) => (
            <tr key={idx} className="border-b border-[var(--border)]/30 hover:bg-[var(--bg-elevated)] transition-colors group">
              <td className="py-2 pl-1">
                <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-primary)] px-1.5 py-0.5 rounded">
                  {echo.scanId ? `S${echo.scanId}` : '—'}
                </span>
              </td>
              <td className="py-2 text-[var(--text-dim)] tabular-nums">{idx}</td>
              <td className="py-2">
                {echo.type === 'DIRECT' ? (
                  <span className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded">TX→RX</span>
                ) : (
                  <span className="text-[10px] font-medium text-[var(--green-signal)] bg-[var(--green-signal)]/10 px-1.5 py-0.5 rounded">RFL</span>
                )}
              </td>
              <td className="py-2 text-[var(--text-primary)] tabular-nums">
                {echo.distance === 0 ? '—' : `${echo.distance.toFixed(3)} m`}
              </td>
              <td className="py-2 text-[var(--text-primary)] tabular-nums">
                {echo.tof.toFixed(2)} ms
              </td>
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-secondary)] w-8 tabular-nums text-[10px]">{echo.strength.toFixed(2)}</span>
                  <div className="flex-1 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${echo.type === 'DIRECT' ? 'bg-[var(--accent)]' : 'bg-[var(--green-signal)]'}`} 
                      style={{ width: `${Math.min(100, echo.strength * 100)}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
