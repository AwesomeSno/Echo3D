import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Sphere, Line } from '@react-three/drei';
import type { Echo } from './EchoList';

export interface Scan {
  id: number;
  position: [number, number, number];
  echoes: Echo[];
}

interface SpatialReconstructionViewerProps {
  scans: Scan[];
}

const SCAN_COLORS = ['#4ade80', '#a78bfa', '#22d3ee', '#facc15', '#fb923c', '#f472b6'];

const getScanColor = (id: number) => SCAN_COLORS[(id - 1) % SCAN_COLORS.length];

// Generate a circle of points for line rendering
const circlePoints = (radius: number, segments: number = 96): [number, number, number][] => {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
  }
  return pts;
};

const DeviceMarker = ({ color }: { color: string }) => (
  <group>
    {/* Solid center cube */}
    <mesh>
      <boxGeometry args={[0.08, 0.08, 0.08]} />
      <meshBasicMaterial color={color} />
    </mesh>
    {/* Outer wireframe */}
    <mesh>
      <boxGeometry args={[0.12, 0.12, 0.12]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
    </mesh>
  </group>
);

const RadarRings = ({ scan }: { scan: Scan }) => {
  const reflections = scan.echoes.filter(e => e.type === 'REFLECTION');
  const color = getScanColor(scan.id);

  return (
    <group position={scan.position}>
      <DeviceMarker color={color} />

      {reflections.map((echo, idx) => {
        const maxStrength = Math.max(...reflections.map(e => e.strength), 1);
        const normalizedStrength = Math.min(1, echo.strength / maxStrength);
        
        return (
          <group key={idx}>
            {/* Wireframe sphere — locus of possible locations */}
            <Sphere args={[echo.distance, 24, 12]}>
              <meshBasicMaterial 
                color={color}
                wireframe
                transparent
                opacity={0.03 + (normalizedStrength * 0.12)}
                depthWrite={false}
              />
            </Sphere>
            
            {/* Solid radar ring on XZ plane */}
            <Line
              points={circlePoints(echo.distance)}
              color={color}
              lineWidth={1.5 + normalizedStrength}
              transparent
              opacity={0.4 + normalizedStrength * 0.4}
            />
          </group>
        );
      })}
    </group>
  );
};

// Axis lines at origin
const AxisHelper = () => (
  <group>
    <Line points={[[0,0,0],[0.5,0,0]]} color="#ef4444" lineWidth={1.5} />
    <Line points={[[0,0,0],[0,0.5,0]]} color="#22c55e" lineWidth={1.5} />
    <Line points={[[0,0,0],[0,0,0.5]]} color="#3b82f6" lineWidth={1.5} />
  </group>
);

export const SpatialReconstructionViewer: React.FC<SpatialReconstructionViewerProps> = ({ scans }) => {
  return (
    <div className="w-full h-[520px] bg-[#0c0e14] relative">
      <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
        <color attach="background" args={['#0c0e14']} />
        
        <OrbitControls 
          makeDefault 
          enableDamping 
          dampingFactor={0.08}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
        />

        <AxisHelper />

        {scans.map(scan => (
          <RadarRings key={scan.id} scan={scan} />
        ))}

        <Grid 
          infiniteGrid 
          fadeDistance={25} 
          sectionColor="rgba(58, 61, 72, 0.4)" 
          cellColor="rgba(42, 45, 56, 0.3)" 
          sectionSize={1} 
          cellSize={0.25} 
        />
      </Canvas>

      {/* Overlay — top-left */}
      <div className="absolute top-3 left-3 pointer-events-none space-y-1">
        <div className="text-[10px] font-medium text-[var(--text-secondary)] bg-[#0c0e14]/80 backdrop-blur-sm px-2 py-1 rounded inline-block">
          1 unit = 1 meter
        </div>
      </div>

      {/* Overlay — top-right scan legend */}
      {scans.length > 0 && (
        <div className="absolute top-3 right-3 pointer-events-none space-y-1">
          {scans.map(scan => (
            <div key={scan.id} className="flex items-center justify-end gap-2 bg-[#0c0e14]/80 backdrop-blur-sm px-2 py-1 rounded">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getScanColor(scan.id), boxShadow: `0 0 6px ${getScanColor(scan.id)}40` }}></div>
              <span className="text-[9px] text-[var(--text-dim)] tabular-nums">
                S{scan.id} [{scan.position.map(v => v.toFixed(1)).join(', ')}]
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Axis labels */}
      <div className="absolute bottom-3 left-3 pointer-events-none flex gap-3">
        <span className="text-[8px] text-red-400/60">X</span>
        <span className="text-[8px] text-green-400/60">Y</span>
        <span className="text-[8px] text-blue-400/60">Z</span>
      </div>
    </div>
  );
};
