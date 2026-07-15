from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from audio.device_manager import DeviceManager
from audio.player_recorder import PlayerRecorder
from signal_processing.generator import SignalGenerator
from signal_processing.analyzer import SignalAnalyzer
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
    use_denoising: bool = False

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

    # 3. Process the recording to extract echoes
    # Optional Phase 6: Spectral Gating Denoising
    if req.use_denoising:
        recording = SignalAnalyzer.denoise_signal(recording, req.sample_rate)

    # Filter the recording to match the chirp bandwidth (if chirp)
    if req.signal_type in ["linear_chirp", "log_chirp"]:
        f_min = min(req.f0, req.f1) - 500  # Give a bit of headroom
        f_max = max(req.f0, req.f1) + 500
        recording = SignalAnalyzer.apply_bandpass_filter(recording, req.sample_rate, max(20, f_min), min(req.sample_rate/2 - 1, f_max))

    # Normalize recording to avoid float overflow in cross-correlation
    rec_max = np.max(np.abs(recording))
    if rec_max > 0:
        norm_recording = recording / rec_max
    else:
        norm_recording = recording

    impulse_response = SignalAnalyzer.pulse_compression(signal, norm_recording, use_envelope=True)
    
    # Configure threshold based on signal type and denoising state
    # If denoised, we can use a slightly higher threshold to ignore remaining artifacts
    threshold = 0.12 if req.use_denoising else 0.08
    echoes = SignalAnalyzer.find_echoes(
        impulse_response, 
        sample_rate=req.sample_rate, 
        prominence_threshold=threshold,
        distance_threshold=0.002 # 2ms
    )

    # 4. Downsample or format for frontend visualization
    # We return a smaller subset of the array for UI rendering to avoid huge JSON payloads
    max_ui_points = 2000
    
    # Downsample raw waveform
    step_wave = max(1, len(recording) // max_ui_points)
    ui_waveform = recording[::step_wave].flatten().tolist()
    
    # Downsample impulse response (focus on the first part where echoes are)
    # 0.2 seconds is usually enough to capture echoes (up to ~34 meters round trip)
    max_ir_samples = int(0.2 * req.sample_rate) 
    ir_truncated = impulse_response[:max_ir_samples]
    step_ir = max(1, len(ir_truncated) // max_ui_points)
    ui_impulse_response = ir_truncated[::step_ir].flatten().tolist()
    
    return {
        "status": "success",
        "sample_rate": req.sample_rate,
        "total_samples": len(recording),
        "ui_waveform": ui_waveform,
        "ui_impulse_response": ui_impulse_response,
        "echoes": echoes
    }
