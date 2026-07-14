# Architecture

## System Architecture
EchoMap follows a client-server model:
- **Backend**: Python (FastAPI) handling hardware I/O, signal processing, and AI.
- **Frontend**: React (TypeScript/Vite) for the UI and 3D visualization (Three.js).

## Data Flow
Frontend UI -> Backend API -> Audio Playback -> Acoustic Environment -> Audio Recording -> Signal Processing -> Geometry Reconstruction -> Frontend 3D Viewer

## Audio Pipeline
(To be detailed)

## Signal Processing Pipeline
(To be detailed)

## AI Pipeline
(To be detailed)

## 3D Reconstruction Pipeline
(To be detailed)

## Rendering Pipeline
(To be detailed)

## Folder Structure
(See README.md)

## Dependency Graph
(To be detailed)

## Design Decisions
- Selected Python for backend due to robust scientific computing libraries (SciPy, NumPy) and AI (PyTorch).
- Selected React/Three.js for frontend for a rich, interactive 3D desktop-like UI.
