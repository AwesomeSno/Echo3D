import numpy as np
import scipy.signal as signal

class SignalGenerator:
    """
    Generates excitation signals for acoustic room probing.
    """
    
    @staticmethod
    def generate_linear_chirp(f0: float, f1: float, duration: float, fs: int = 48000) -> np.ndarray:
        """
        Generates a linear frequency sweep (chirp).
        
        Args:
            f0: Start frequency (Hz)
            f1: End frequency (Hz)
            duration: Duration of the chirp (seconds)
            fs: Sample rate (Hz)
        """
        t = np.linspace(0, duration, int(fs * duration), endpoint=False)
        return signal.chirp(t, f0=f0, f1=f1, t1=duration, method='linear')

    @staticmethod
    def generate_log_chirp(f0: float, f1: float, duration: float, fs: int = 48000) -> np.ndarray:
        """
        Generates a logarithmic frequency sweep (chirp).
        """
        t = np.linspace(0, duration, int(fs * duration), endpoint=False)
        return signal.chirp(t, f0=f0, f1=f1, t1=duration, method='logarithmic')

    @staticmethod
    def generate_mls(order: int, fs: int = 48000) -> np.ndarray:
        """
        Generates a Maximum Length Sequence (MLS).
        MLS is a pseudo-random binary sequence useful for impulse response estimation.
        
        Args:
            order: The order of the MLS (length will be 2^order - 1)
            fs: Sample rate (Hz)
        """
        # max_len_seq returns an array of 0s and 1s, and the state
        mls_seq, _ = signal.max_len_seq(order)
        
        # Convert [0, 1] to [-1, 1] for audio playback
        mls_audio = mls_seq * 2.0 - 1.0
        return mls_audio.astype(np.float32)
