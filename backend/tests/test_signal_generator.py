import numpy as np
from backend.signal_processing.generator import SignalGenerator

def test_linear_chirp_duration():
    fs = 48000
    duration = 0.5
    signal = SignalGenerator.generate_linear_chirp(f0=1000, f1=5000, duration=duration, fs=fs)
    
    assert len(signal) == int(fs * duration)
    assert isinstance(signal, np.ndarray)

def test_mls_length():
    fs = 48000
    order = 10
    signal = SignalGenerator.generate_mls(order=order, fs=fs)
    
    # MLS length is 2^order - 1
    expected_length = (2**order) - 1
    assert len(signal) == expected_length
    
    # Values should be -1.0 or 1.0
    unique_vals = np.unique(signal)
    assert set(unique_vals).issubset({-1.0, 1.0})
