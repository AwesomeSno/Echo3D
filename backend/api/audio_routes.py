from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.audio.device_manager import DeviceManager
from backend.audio.player_recorder import PlayerRecorder
from backend.signal_processing.generator import SignalGenerator
import numpy as np

router = APIRouter()

class PingRequest(BaseModel):
    signal_type: str = "linear_chirp"  # linear_chirp, log_chirp, mls
    f0: float = 2000.0
    f1: float = 10000.0
    duration: float = 0.5
    order: int = 14
    sample_rate: int = 48000
    volume: float = 0.8

@router.get("/devices")
def get_devices():
    """Returns available audio devices and defaults."""
    devices = DeviceManager.get_devices()
    defaults = DeviceManager.get_default_devices()
    return {
        "devices": devices,
        "defaults": defaults
    }

@router.post("/ping")
def ping_environment(req: PingRequest):
    """
    Generates the requested signal, plays it, records the echo, and returns the raw data.
    """
    # 1. Generate Signal
    if req.signal_type == "linear_chirp":
        signal = SignalGenerator.generate_linear_chirp(req.f0, req.f1, req.duration, req.sample_rate)
    elif req.signal_type == "log_chirp":
        signal = SignalGenerator.generate_log_chirp(req.f0, req.f1, req.duration, req.sample_rate)
    elif req.signal_type == "mls":
        signal = SignalGenerator.generate_mls(req.order, req.sample_rate)
    else:
        raise HTTPException(status_code=400, detail="Invalid signal type")

    # Apply volume
    signal = signal * req.volume

    # 2. Play and Record
    try:
        player = PlayerRecorder(sample_rate=req.sample_rate)
        recording = player.play_and_record(signal)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio I/O Error: {str(e)}")

    # 3. Downsample or format for frontend visualization
    # We return a smaller subset of the array for UI rendering to avoid huge JSON payloads
    # This is JUST for the raw waveform UI, actual processing happens in backend
    max_ui_points = 2000
    step = max(1, len(recording) // max_ui_points)
    ui_waveform = recording[::step].flatten().tolist()
    
    return {
        "status": "success",
        "sample_rate": req.sample_rate,
        "total_samples": len(recording),
        "ui_waveform": ui_waveform
    }
