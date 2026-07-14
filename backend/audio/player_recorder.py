import sounddevice as sd
import numpy as np

class PlayerRecorder:
    """
    Handles simultaneous playback and recording of audio signals (loopback).
    """
    def __init__(self, sample_rate: int = 48000):
        self.sample_rate = sample_rate

    def play_and_record(self, signal: np.ndarray, input_channels: int = 1) -> np.ndarray:
        """
        Plays the given signal array and simultaneously records the microphone input.
        
        Args:
            signal (np.ndarray): The 1D or 2D array representing the audio to play.
            input_channels (int): Number of input channels to record.
            
        Returns:
            np.ndarray: The recorded audio data.
        """
        # Ensure the signal is properly shaped (N frames, C channels)
        if signal.ndim == 1:
            signal = signal.reshape(-1, 1)

        # Start simultaneous play and record
        # This will block until the signal has finished playing
        recording = sd.playrec(
            signal,
            samplerate=self.sample_rate,
            channels=input_channels,
            blocking=True
        )
        return recording
