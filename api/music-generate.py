from http.server import BaseHTTPRequestHandler
import json
import numpy as np
import base64
import io
import wave
import urllib.parse

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Enable CORS
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        try:
            # Get request data
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            prompt = data.get('prompt', 'peaceful music')
            duration = float(data.get('duration', 10.0))
            temperature = float(data.get('temperature', 1.0))
            lora_model = data.get('lora_model')
            
            # Generate advanced AI-like audio
            audio_data = self.generate_advanced_audio(prompt, duration, temperature, lora_model)
            
            # Convert to WAV
            buffer = io.BytesIO()
            with wave.open(buffer, 'wb') as wav_file:
                wav_file.setnchannels(1)  # Mono
                wav_file.setsampwidth(2)  # 16-bit
                wav_file.setframerate(32000)
                
                # Convert float32 to int16
                audio_int16 = (audio_data * 32767).astype(np.int16)
                wav_file.writeframes(audio_int16.tobytes())
            
            buffer.seek(0)
            audio_b64 = base64.b64encode(buffer.read()).decode()
            
            response = {
                "audio_data": audio_b64,
                "sample_rate": 32000,
                "duration": duration,
                "prompt": prompt,
                "note": f"🚀 Generated using HarmoniX AI (LoRA: {lora_model or 'None'})",
                "model_type": "advanced_simulation",
                "lora_applied": lora_model is not None
            }
            
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            error_response = {
                "error": str(e),
                "message": "Music generation failed"
            }
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def generate_advanced_audio(self, prompt, duration=10.0, temperature=1.0, lora_model=None):
        """Generate advanced AI-like audio based on prompt analysis"""
        sample_rate = 32000
        samples = int(duration * sample_rate)
        
        # Analyze prompt for musical characteristics
        prompt_lower = prompt.lower()
        
        # Determine base frequency and style from prompt
        if "electronic" in prompt_lower or "edm" in prompt_lower or "techno" in prompt_lower:
            base_freq = 130.81  # C3
            style = "electronic"
        elif "classical" in prompt_lower or "piano" in prompt_lower or "orchestra" in prompt_lower:
            base_freq = 261.63  # C4
            style = "classical"
        elif "rock" in prompt_lower or "guitar" in prompt_lower:
            base_freq = 82.41   # E2
            style = "rock"
        elif "jazz" in prompt_lower:
            base_freq = 220.00  # A3
            style = "jazz"
        elif "ambient" in prompt_lower or "peaceful" in prompt_lower or "calm" in prompt_lower:
            base_freq = 174.61  # F3
            style = "ambient"
        else:
            base_freq = 261.63  # C4 default
            style = "general"
        
        # Generate time array
        t = np.linspace(0, duration, samples, False)
        audio = np.zeros(samples)
        
        # Apply LoRA-like modifications if specified
        lora_factor = 1.0
        if lora_model:
            if "jazz" in lora_model.lower():
                lora_factor = 1.2
                base_freq *= 1.1
            elif "electronic" in lora_model.lower():
                lora_factor = 0.8
                base_freq *= 0.9
            elif "classical" in lora_model.lower():
                lora_factor = 1.1
        
        # Generate complex waveform based on style and temperature
        for i in range(int(duration)):
            start_idx = i * sample_rate
            end_idx = min((i + 1) * sample_rate, samples)
            segment_t = t[start_idx:end_idx]
            
            # Create chord progression
            chord_freqs = self.get_chord_frequencies(base_freq, i, style)
            
            # Generate harmonics with temperature-based randomness
            segment_audio = np.zeros(len(segment_t))
            for freq in chord_freqs:
                # Fundamental frequency
                fundamental = np.sin(2 * np.pi * freq * segment_t) * (0.3 * lora_factor)
                
                # Add harmonics based on style
                if style == "electronic":
                    # Square wave harmonics
                    for harmonic in [2, 3, 5]:
                        fundamental += np.sin(2 * np.pi * freq * harmonic * segment_t) * (0.1 / harmonic)
                elif style == "classical":
                    # Rich harmonics
                    for harmonic in [2, 3, 4, 5]:
                        fundamental += np.sin(2 * np.pi * freq * harmonic * segment_t) * (0.15 / harmonic)
                elif style == "rock":
                    # Distorted harmonics
                    fundamental = np.tanh(fundamental * 2) * 0.4
                
                # Apply temperature-based variation
                if temperature > 1.0:
                    noise_factor = (temperature - 1.0) * 0.1
                    noise = np.random.normal(0, noise_factor, len(segment_t))
                    fundamental += noise
                
                segment_audio += fundamental
            
            # Apply envelope
            envelope = np.exp(-segment_t * 0.5) * np.sin(np.pi * segment_t / (1.0))
            segment_audio *= envelope
            
            audio[start_idx:end_idx] = segment_audio
        
        # Apply overall envelope to prevent clicks
        fade_samples = int(0.1 * sample_rate)  # 100ms fade
        audio[:fade_samples] *= np.linspace(0, 1, fade_samples)
        audio[-fade_samples:] *= np.linspace(1, 0, fade_samples)
        
        # Normalize
        audio = audio / np.max(np.abs(audio)) * 0.8
        
        return audio.astype(np.float32)
    
    def get_chord_frequencies(self, base_freq, measure, style):
        """Generate chord frequencies based on musical theory"""
        # Simple chord progressions
        if style == "jazz":
            # ii-V-I progression
            progressions = [
                [base_freq * 9/8, base_freq * 5/4, base_freq * 3/2],  # ii
                [base_freq * 5/4, base_freq * 3/2, base_freq * 15/8], # V
                [base_freq, base_freq * 5/4, base_freq * 3/2],        # I
                [base_freq * 6/5, base_freq * 3/2, base_freq * 9/5]   # vi
            ]
        elif style == "classical":
            # I-V-vi-IV progression
            progressions = [
                [base_freq, base_freq * 5/4, base_freq * 3/2],        # I
                [base_freq * 3/2, base_freq * 15/8, base_freq * 9/4], # V
                [base_freq * 6/5, base_freq * 3/2, base_freq * 9/5],  # vi
                [base_freq * 4/3, base_freq * 5/3, base_freq * 2]     # IV
            ]
        elif style == "electronic":
            # Simple bass + lead
            progressions = [
                [base_freq, base_freq * 2],
                [base_freq * 9/8, base_freq * 9/4],
                [base_freq * 5/4, base_freq * 5/2],
                [base_freq * 4/3, base_freq * 8/3]
            ]
        else:
            # Basic triad
            progressions = [
                [base_freq, base_freq * 5/4, base_freq * 3/2],
                [base_freq * 9/8, base_freq * 45/32, base_freq * 27/16],
                [base_freq * 5/4, base_freq * 25/16, base_freq * 15/8],
                [base_freq * 4/3, base_freq * 5/3, base_freq * 2]
            ]
        
        return progressions[measure % len(progressions)]