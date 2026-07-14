import sounddevice as sd

class DeviceManager:
    """
    Manages the querying and selection of audio input and output devices.
    """
    @staticmethod
    def get_devices():
        """Returns a list of available audio devices."""
        return sd.query_devices()
    
    @staticmethod
    def get_default_devices():
        """Returns the default input and output device information."""
        try:
            default_input_id = sd.default.device[0]
            default_output_id = sd.default.device[1]
            
            # sounddevice default might be a tuple if both are set, or it may fallback to system defaults
            devices = sd.query_devices()
            
            input_device = devices[default_input_id] if default_input_id is not None else None
            output_device = devices[default_output_id] if default_output_id is not None else None
            
            return {
                "input": input_device,
                "output": output_device
            }
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def check_capabilities():
        """Checks if the default devices support standard sample rates."""
        rates = [44100, 48000, 96000, 192000]
        supported_rates = []
        for rate in rates:
            try:
                sd.check_input_settings(samplerate=rate)
                sd.check_output_settings(samplerate=rate)
                supported_rates.append(rate)
            except Exception:
                pass
        return supported_rates
