import numpy as np
from signal_processing.analyzer import SignalAnalyzer
import math

def test_find_echoes():
    sample_rate = 48000
    # Simulate an impulse response
    ir = np.zeros(sample_rate)
    
    # Direct path at sample 100
    ir[100] = 1.0
    
    # Echo at 2 meters
    # Distance = (time_of_flight * 343) / 2
    # time_of_flight = 4 / 343 = 0.01166 seconds
    # delta_samples = 0.01166 * 48000 = 559.7
    echo_sample = 100 + 560
    ir[echo_sample] = 0.5
    
    echoes = SignalAnalyzer.find_echoes(ir, sample_rate)
    
    assert len(echoes) == 2
    assert echoes[0]["is_direct_path"] == True
    
    echo = echoes[1]
    assert not echo["is_direct_path"]
    
    # Expected distance should be close to 2.0
    expected_dist = (560 / sample_rate) * 343 / 2
    assert math.isclose(echo["distance_m"], expected_dist, rel_tol=0.01)
    
    print("test_find_echoes passed!")

if __name__ == "__main__":
    test_find_echoes()
