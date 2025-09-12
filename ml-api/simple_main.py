from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
import numpy as np
import wave
from typing import Optional

app = FastAPI(title="MusicGen LoRA API - Simple Version")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerationRequest(BaseModel):
    prompt: str
    duration: float = 10.0
    temperature: float = 1.0
    top_k: int = 250
    top_p: float = 0.0
    lora_model: Optional[str] = None

def generate_dummy_audio(duration: float = 10.0, sample_rate: int = 32000):
    """Generate a simple sine wave as dummy audio"""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    # Generate a simple melody with multiple frequencies
    frequencies = [440, 523, 659, 784]  # A, C, E, G notes
    audio = np.zeros_like(t)
    
    for i, freq in enumerate(frequencies):
        start_time = i * duration / len(frequencies)
        end_time = (i + 1) * duration / len(frequencies)
        mask = (t >= start_time) & (t < end_time)
        audio[mask] = 0.3 * np.sin(2 * np.pi * freq * t[mask])
    
    # Convert to 16-bit PCM
    audio_int16 = (audio * 32767).astype(np.int16)
    
    # Create WAV file in memory
    buffer = io.BytesIO()
    with wave.open(buffer, 'wb') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(audio_int16.tobytes())
    
    buffer.seek(0)
    return buffer.getvalue()

@app.get("/")
async def root():
    return {"message": "MusicGen LoRA API is running (Simple Version)"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "device": "cpu",
        "model_loaded": True,
        "version": "simple"
    }

@app.post("/generate")
async def generate_music(request: GenerationRequest):
    """Generate dummy music from text prompt"""
    try:
        # Generate dummy audio
        audio_data = generate_dummy_audio(request.duration)
        
        # Encode as base64
        audio_b64 = base64.b64encode(audio_data).decode()
        
        return {
            "audio_data": audio_b64,
            "sample_rate": 32000,
            "duration": request.duration,
            "prompt": request.prompt,
            "note": "This is a dummy audio generation for testing purposes"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_available_models():
    """List available LoRA models"""
    return {
        "available_models": ["demo-model", "test-model"],
        "note": "These are dummy models for testing"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)