import { useState } from 'react'
import { AudioControlPanel } from './components/AudioControlPanel'
import { WaveformViewer } from './components/WaveformViewer'
import { ImpulseResponseViewer } from './components/ImpulseResponseViewer'
import { EchoList, type Echo } from './components/EchoList'
import { SpatialReconstructionViewer, type Scan } from './components/SpatialReconstructionViewer'

function App() {
  const [waveform, setWaveform] = useState<number[]>([])
  const [impulseResponse, setImpulseResponse] = useState<number[]>([])
  const [scans, setScans] = useState<Scan[]>([])
  const [nextScanId, setNextScanId] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('SYSTEM STANDBY')

  const handlePing = async (pingData: any, position: [number, number, number]) => {
    setIsLoading(true)
    setError(null)
    setStatus('ACQUIRING SIGNAL...')
    try {
      const response = await fetch('http://localhost:8000/api/audio/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pingData)
      })

      const data = await response.json()
      if (data.status === 'success') {
        const mappedEchoes = (data.echoes || []).map((e: any) => ({
          distance: e.distance_m,
          tof: e.time_of_flight_s * 1000,
          strength: e.amplitude,
          type: e.is_direct_path ? 'DIRECT' : 'REFLECTION'
        }));
        setWaveform(data.ui_waveform)
        setImpulseResponse(data.ui_impulse_response || [])
        setScans(prev => [...prev, { id: nextScanId, position, echoes: mappedEchoes }])
        setNextScanId(prev => prev + 1)
        setStatus(`COMPLETE · ${data.total_samples.toLocaleString()} SAMPLES @ ${(data.sample_rate / 1000).toFixed(0)}kHz`)
      } else {
        setError(data.detail || 'Unknown processing error')
        setStatus('CONNECTION FAILURE')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setStatus('CONNECTION FAILURE')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetScans = () => {
    setScans([])
    setNextScanId(1)
    setWaveform([])
    setImpulseResponse([])
    setError(null)
    setStatus('SYSTEM STANDBY')
  }

  const allHistoricalEchoes = scans.flatMap(scan => 
    scan.echoes.map(echo => ({ ...echo, scanId: scan.id }))
  )

  const reflectionCount = allHistoricalEchoes.filter(e => e.type === 'REFLECTION').length

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      
      {/* ─── Sidebar ─── */}
      <div className="w-[300px] min-w-[300px] bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col h-screen sticky top-0">
        
        {/* Logo Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" style={{ boxShadow: '0 0 8px rgba(59,130,246,0.5)' }}></div>
            <h1 className="text-[13px] font-semibold tracking-[0.15em] text-white uppercase">EchoMap</h1>
          </div>
          <span className="text-[9px] text-[var(--text-dim)] tracking-wider px-1.5 py-0.5 border border-[var(--border)] rounded">v2.0</span>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto p-4">
          <AudioControlPanel onPing={handlePing} onResetScans={handleResetScans} isLoading={isLoading} />
          {error && (
            <div className="mt-4 p-3 bg-[#1a0505] border border-[var(--error)]/30 rounded-md">
              <div className="text-[10px] font-semibold text-[var(--error)] uppercase tracking-wider mb-1">⚠ Error</div>
              <div className="text-[11px] text-[#ff9999] leading-relaxed">{error}</div>
            </div>
          )}
        </div>

        {/* Footer Status */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-primary)]">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              status.includes('FAILURE') ? 'bg-[var(--error)]' : 
              status.includes('STANDBY') ? 'bg-[var(--warning)]' : 
              status.includes('ACQUIRING') ? 'bg-[var(--accent)] blink' : 'bg-[var(--success)]'
            }`}></div>
            <span className={`text-[10px] tracking-wide ${
              status.includes('FAILURE') ? 'text-[var(--error)]' : 
              status.includes('STANDBY') ? 'text-[var(--text-dim)]' : 'text-[var(--text-secondary)]'
            }`}>{status}</span>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto p-6 space-y-5">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[15px] font-semibold text-white tracking-wide">Acoustic SLAM Interface</h2>
              <p className="text-[10px] text-[var(--text-dim)] tracking-wider mt-0.5">SIMULTANEOUS LOCALIZATION & MAPPING</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-[var(--text-dim)] tracking-wider">
              <span>{scans.length} SCAN{scans.length !== 1 ? 'S' : ''}</span>
              <span className="text-[var(--border)]">│</span>
              <span>{reflectionCount} REFLECTION{reflectionCount !== 1 ? 'S' : ''}</span>
            </div>
          </div>

          {/* Signal Viewers — Side-by-Side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 rounded-full bg-[var(--cyan)]"></div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-secondary)]">Raw Recording Buffer</h3>
                </div>
                <span className="text-[9px] text-[var(--text-dim)]">{waveform.length > 0 ? `${waveform.length} pts` : '—'}</span>
              </div>
              <div className="p-3">
                <WaveformViewer data={waveform} />
              </div>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 rounded-full bg-[var(--green-signal)]"></div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-secondary)]">Hilbert Envelope</h3>
                </div>
                <span className="text-[9px] text-[var(--text-dim)]">{impulseResponse.length > 0 ? `${impulseResponse.length} pts` : '—'}</span>
              </div>
              <div className="p-3">
                <ImpulseResponseViewer data={impulseResponse} />
              </div>
            </div>
          </div>

          {/* 3D Viewport */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3 rounded-full bg-[var(--purple-signal)]"></div>
                <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-secondary)]">3D Triangulation Viewport</h3>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-[var(--text-dim)]">
                <span>ORBIT · PAN · ZOOM</span>
              </div>
            </div>
            <SpatialReconstructionViewer scans={scans} />
          </div>

          {/* Data Table */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3 rounded-full bg-[var(--text-dim)]"></div>
                <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-secondary)]">Accumulated Data Log</h3>
              </div>
              <span className="text-[10px] text-[var(--accent)] font-medium">{allHistoricalEchoes.length} entries</span>
            </div>
            <div className="p-4">
              <EchoList echoes={allHistoricalEchoes} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
