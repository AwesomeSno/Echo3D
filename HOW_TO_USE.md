# User Guide

## Installation

### Prerequisites
- Node.js & npm
- Python 3.9+
- macOS (for native `sounddevice` support)

### Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```

## Launching

1. **Start the Backend**:
   Inside the `backend` directory with the virtual environment activated:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
2. **Start the Frontend**:
   Inside the `frontend` directory:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`.

## Scanning
1. In the EchoMap UI, adjust the **Signal Settings** (Frequency range and duration).
2. Click **EMIT PING**. 
3. Ensure your speakers are not muted and your microphone is allowed.
4. The system will emit a chirp and immediately process the echoes.

## Viewing Results
- The **Raw Echo Waveform** shows what the microphone captured.
- The **Impulse Response** graph shows the acoustic reflections (spikes indicate walls/objects).
- The **Detected Reflections** table lists the physical distance to nearby obstacles in meters.

## Tips for obtaining accurate scans
- Ensure a quiet environment for the best signal-to-noise ratio.
- Keep the laptop stationary while a ping is occurring.
- Use higher frequency ranges for finer resolution (shorter wavelengths).
