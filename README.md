# EchoMap

## Project Overview
EchoMap is an open-source, research-grade acoustic 3D mapping platform. It reconstructs indoor environments using only sound, acting as an acoustic equivalent of LiDAR. By emitting carefully designed audio chirps and analyzing the returning echoes via cross-correlation, EchoMap identifies the physical distance to walls and obstacles to generate an interactive 3D map.

## Installation & Quick Start
See [HOW_TO_USE.md](HOW_TO_USE.md) for detailed setup and launch instructions.

## Features
- **Acoustic Scanning**: Operates using standard built-in microphones and speakers.
- **Advanced Signal Generation**: Supports Linear Chirp, Logarithmic Chirp, and Maximum Length Sequences (MLS).
- **Core Signal Processing**: Uses matched filtering and Time-of-Flight (ToF) estimation to extract room impulse responses.
- **Modern UI**: High-performance React/Vite dashboard with real-time waveform and echo profiling visualizations.

## Architecture
See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed technical breakdown of the audio, signal processing, and rendering pipelines.

## Current State & Roadmap
See [STATE.md](STATE.md) for current implementation progress and [ROADMAP.md](ROADMAP.md) for upcoming features (including 3D Point Cloud geometry reconstruction and SLAM integration).

## Known Limitations
- Version 1 requires clear acoustic conditions (low ambient noise).
- Operates primarily using the built-in MacBook speaker and microphone.
- Distances are highly dependent on exact temperature and speed of sound.
