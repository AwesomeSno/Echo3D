# API Reference

## Backend API

### `POST /api/audio/ping`
Emits an acoustic signal, records the room's response, and analyzes the audio to find echoes and distances.

**Request Body (JSON)**:
```json
{
  "signal_type": "Linear Chirp",
  "start_frequency": 2000,
  "end_frequency": 10000,
  "duration": 0.5,
  "volume": 0.8,
  "sample_rate": 48000
}
```

**Response (JSON)**:
```json
{
  "status": "success",
  "total_samples": 24000,
  "sample_rate": 48000,
  "ui_waveform": [...],
  "ui_impulse_response": [...],
  "echoes": [
    {
      "distance": 0.0,
      "tof": 0.0,
      "strength": 1.0,
      "type": "DIRECT"
    },
    {
      "distance": 1.25,
      "tof": 3.65,
      "strength": 0.4,
      "type": "REFLECTION"
    }
  ]
}
```

## Frontend Components
- `AudioControlPanel`: Controls signal generation parameters.
- `WaveformViewer`: Renders the raw recorded audio data to a canvas.
- `ImpulseResponseViewer`: Renders the matched filter output (peaks) to a canvas.
- `EchoList`: Displays a tabular list of detected physical reflections and their calculated distances.
