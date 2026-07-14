import React, { useState } from 'react';

interface AudioControlPanelProps {
  onPing: (data: any) => void;
  isLoading: boolean;
}

export const AudioControlPanel: React.FC<AudioControlPanelProps> = ({ onPing, isLoading }) => {
  const [signalType, setSignalType] = useState('linear_chirp');
  const [f0, setF0] = useState(2000);
  const [f1, setF1] = useState(10000);
  const [duration, setDuration] = useState(0.5);
  const [volume, setVolume] = useState(0.8);

  const handlePing = () => {
    onPing({
      signal_type: signalType,
      f0,
      f1,
      duration,
      volume
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-sm">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Signal Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Signal Type</label>
          <select 
            value={signalType} 
            onChange={(e) => setSignalType(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="linear_chirp">Linear Chirp</option>
            <option value="log_chirp">Logarithmic Chirp</option>
            <option value="mls">MLS (Maximum Length Sequence)</option>
          </select>
        </div>

        {(signalType === 'linear_chirp' || signalType === 'log_chirp') && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Start Frequency: {f0} Hz</label>
              <input type="range" min="100" max="22000" step="100" value={f0} onChange={(e) => setF0(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">End Frequency: {f1} Hz</label>
              <input type="range" min="100" max="22000" step="100" value={f1} onChange={(e) => setF1(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Duration: {duration} s</label>
              <input type="range" min="0.05" max="2.0" step="0.05" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Volume: {Math.round(volume * 100)}%</label>
          <input type="range" min="0.1" max="1.0" step="0.1" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>

        <button 
          onClick={handlePing} 
          disabled={isLoading}
          className={`w-full py-3 rounded font-bold text-gray-900 transition-colors ${
            isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-cyan-400 hover:bg-cyan-300'
          }`}
        >
          {isLoading ? 'Pinging...' : 'Test Ping'}
        </button>
      </div>
    </div>
  );
};
