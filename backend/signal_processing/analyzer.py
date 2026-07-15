import numpy as np
import scipy.signal as signal
try:
    import noisereduce as nr
except ImportError:
    nr = None

class SignalAnalyzer:
    """
    Analyzes recorded audio signals to extract acoustic information such as
    the impulse response and Time-of-Flight (ToF) for echoes.
    """
    
    @staticmethod
    def denoise_signal(data: np.ndarray, sample_rate: int) -> np.ndarray:
        """
        Uses spectral gating to reduce stationary background noise in the signal.
        """
        if nr is None:
            return data
            
        # reduce_noise expects 1D or 2D array.
        reduced = nr.reduce_noise(y=data.flatten(), sr=sample_rate, prop_decrease=0.9)
        return reduced

    @staticmethod
    def apply_bandpass_filter(data: np.ndarray, sample_rate: int, lowcut: float, highcut: float, order: int = 5) -> np.ndarray:
        """
        Applies a Butterworth bandpass filter to the audio data.
        """
        nyquist = 0.5 * sample_rate
        low = lowcut / nyquist
        high = highcut / nyquist
        # Guard against invalid filter frequencies
        low = max(0.001, low)
        high = min(0.999, high)
        
        if low >= high:
            return data.flatten()
            
        b, a = signal.butter(order, [low, high], btype='band')
        filtered_data = signal.filtfilt(b, a, data.flatten())
        return filtered_data

    @staticmethod
    def pulse_compression(transmitted: np.ndarray, received: np.ndarray, use_envelope: bool = True) -> np.ndarray:
        """
        Extracts the impulse response using matched filtering (cross-correlation).
        """
        # Ensure 1D arrays
        tx = transmitted.flatten()
        rx = received.flatten()
        
        # Cross-correlate the received signal with the transmitted signal
        corr = signal.correlate(rx, tx, mode='full')
        
        # The peak of auto-correlation is at len(tx) - 1. We keep lags >= 0.
        lags = np.arange(-len(tx) + 1, len(rx))
        positive_lags_idx = np.where(lags >= 0)[0]
        
        impulse_response = corr[positive_lags_idx]
        
        # Extract the amplitude envelope using Hilbert transform
        # This completely removes the oscillatory carrier wave from the cross-correlation
        if use_envelope:
            analytic_signal = signal.hilbert(impulse_response)
            impulse_response = np.abs(analytic_signal)
        
        # Normalize the impulse response
        max_val = np.max(np.abs(impulse_response))
        if max_val > 0:
            impulse_response = impulse_response / max_val
            
        return impulse_response

    @staticmethod
    def find_echoes(impulse_response: np.ndarray, sample_rate: int, speed_of_sound: float = 343.0, prominence_threshold: float = 0.05, distance_threshold: float = 0.002):
        """
        Finds echoes from the impulse response and calculates their distance.
        """
        min_distance_samples = int(distance_threshold * sample_rate)
        
        # Find peaks in the impulse response envelope using topological prominence
        # This makes it immune to wide sidelobes and focuses only on distinct reflection peaks
        peaks, properties = signal.find_peaks(
            impulse_response, 
            prominence=prominence_threshold, 
            distance=max(1, min_distance_samples)
        )
        
        if len(peaks) == 0:
            return []
            
        # The first prominent peak is assumed to be the direct path (speaker -> mic)
        direct_path_sample = peaks[0]
        
        echoes = []
        for i, peak_sample in enumerate(peaks):
            # Calculate time difference relative to the direct path
            delta_samples = peak_sample - direct_path_sample
            time_of_flight = delta_samples / sample_rate
            
            # Distance calculation: round trip distance
            # distance to reflector = (time_of_flight * speed_of_sound) / 2
            distance = (time_of_flight * speed_of_sound) / 2.0
            
            amplitude = float(impulse_response[peak_sample])
            
            echoes.append({
                "id": i,
                "is_direct_path": (i == 0),
                "time_of_flight_s": float(time_of_flight),
                "distance_m": float(distance),
                "amplitude": float(amplitude)
            })
            
        return echoes
