import { useState } from 'react'
import { AudioControlPanel } from './components/AudioControlPanel'
import { WaveformViewer } from './components/WaveformViewer'

function App() {
  const [waveform, setWaveform] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePing = async (pingData: any) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8000/api/audio/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pingData)
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.ui_waveform) {
        setWaveform(data.ui_waveform)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar / Settings Panel */}
      <div className="w-80 bg-gray-950 p-6 flex flex-col border-r border-gray-800 h-screen overflow-y-auto">
        <h1 className="text-3xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">EchoMap</h1>
        
        <AudioControlPanel onPing={handlePing} isLoading={isLoading} />
        
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">Live Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-sm text-gray-400 font-medium tracking-wide">
              {isLoading ? 'RECORDING' : 'IDLE'}
            </span>
          </div>
        </div>
        
        {/* Top Waveform View */}
        <div className="mb-8">
          <WaveformViewer data={waveform} />
        </div>

        {/* 3D Viewport Placeholder for Phase 4 */}
        <div className="flex-1 bg-gray-800 rounded border border-gray-700 shadow-inner flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            <p className="text-gray-500 font-medium tracking-wider">3D RECONSTRUCTION</p>
            <p className="text-gray-600 text-sm mt-2">Available in Phase 4</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
