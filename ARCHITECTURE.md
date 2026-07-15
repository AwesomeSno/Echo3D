# Architecture

## System Architecture
EchoMap follows a highly decoupled client-server model:
- **Backend**: Python (FastAPI, Uvicorn) handling hardware I/O, signal processing, and numerical analysis.
- **Frontend**: React (TypeScript/Vite) with Tailwind CSS for the high-performance UI and 3D visualization (Three.js - planned).

## Data Flow
`Frontend UI` -> `Backend API (/api/audio/ping)` -> `Signal Generation` -> `Audio Playback` -> `Acoustic Environment` -> `Audio Recording` -> `SignalAnalyzer` -> `Matched Filtering (SciPy)` -> `Peak Detection` -> `ToF Calculation` -> `Frontend Dashboard`

## Audio Pipeline
- **Generator**: Synthesizes the requested acoustic signal (e.g., linear sine sweep from 2kHz to 10kHz over 0.5s).
- **Transducer Control**: Uses the `sounddevice` library for simultaneous playback and recording via the default system audio hardware at a fixed 48,000Hz sample rate.

## Signal Processing Pipeline (Implemented in `SignalAnalyzer`)
1. **Pulse Compression**: The recorded room audio is cross-correlated with the originally transmitted signal (matched filtering) using `scipy.signal.correlate`.
2. **Impulse Extraction**: The cross-correlation output yields the room's impulse response, where peaks represent direct paths and reflections.
3. **Peak Detection**: Local maxima are identified using `scipy.signal.find_peaks` with height and distance constraints to filter out noise.
4. **Time-of-Flight (ToF)**: The time difference between the initial transmission peak and subsequent reflection peaks is multiplied by the speed of sound (343 m/s) to calculate 1-dimensional physical distances.

## AI Pipeline
*(Planned for Phase 6)*

## 3D Reconstruction Pipeline
*(Planned for Phase 4)*

## Rendering Pipeline
*(Planned for Phase 4 - Three.js/R3F)*

## Design Decisions
- **Python Backend**: Chosen for its unparalleled ecosystem in scientific computing (NumPy, SciPy) which is critical for complex DSP (Digital Signal Processing).
- **React Frontend**: Chosen for rapid iteration of complex state-driven dashboards and robust WebGL (Three.js) integration.
- **Vite & Tailwind CSS**: Enables ultra-fast hot module reloading and premium aesthetics without massive CSS bundles.
