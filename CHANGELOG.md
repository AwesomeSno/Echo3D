# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- **Added**: Phase 4: 3D Spatial Geometry Reconstruction
- **Added**: Three.js, React-Three-Fiber, and React-Three-Drei dependencies.
- **Added**: `SpatialReconstructionViewer.tsx` to visualize acoustic echoes as concentric radar rings in a 3D viewport based on Time-of-Flight distances.
- **Changed**: Rebuilt the entire React UI to a strict, data-dense industrial aesthetic (Phase 3.5).
- **Added**: Full Python/Vite integration via dual development servers.

## [0.2.0-alpha] - 2026-07-14
### Added
- Fully functional Vite + React frontend with TypeScript.
- Premium UI with glassmorphism, dynamic gradients, and animated components using Tailwind CSS.
- Audio I/O backend using `sounddevice` and FastAPI.
- `SignalAnalyzer` module for processing acoustic echoes using `scipy.signal` matched filtering.
- API route `POST /api/audio/ping` to emit chirps, record room audio, and extract echo distances based on Time-of-Flight (ToF).

## [0.1.0-alpha] - 2026-07-14
### Added
- Initial project scaffolding.
- Documentation files (README, STATE, CHANGELOG, HOW_TO_USE, ARCHITECTURE, API, ROADMAP).
- Backend and frontend directory structure.
