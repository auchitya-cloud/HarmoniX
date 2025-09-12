from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torchaudio
import io
import base64
from typing import Optional
import os
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
import numpy as np

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MusicGen LoRA API")

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

class MusicGenService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.base_model = None
        self.current_lora = None
        self.model_loading = False
        self.executor = ThreadPoolExecutor(max_workers=1)
        logger.info(f"Using device: {self.device}")
        
    async def load_base_model_async(self, model_name="facebook/musicgen-small"):
        """Load the base MusicGen model asynchronously"""
        if self.base_model is None and not self.model_loading:
            self.model_loading = True
            try:
                logger.info(f"Loading base model: {model_name}")
                # Use small model for faster loading and less memory usage
                loop = asyncio.get_event_loop()
                self.base_model = await loop.run_in_executor(
                    self.executor, 
                    self._load_model_sync, 
                    model_name
                )
                logger.info("Model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load model: {e}")
                self.base_model = None
            finally:
                self.model_loading = False
        return self.base_model
    
    def _load_model_sync(self, model_name):
        """Synchronous model loading"""
        try:
            from audiocraft.models import MusicGen
            model = MusicGen.get_pretrained(model_name)
            model.set_generation_params(
                use_sampling=True,
                top_k=250,
                duration=10
            )
            return model
        except ImportError as e:
            logger.error(f"AudioCraft not available: {e}")
            return None
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return None
    
    def load_lora_adapter(self, lora_path: str):
        """Load LoRA adapter for fine-tuned model"""
        try:
            if os.path.exists(lora_path) and lora_path != self.current_lora:
                logger.info(f"Loading LoRA adapter: {lora_path}")
                from peft import PeftModel
                self.base_model = PeftModel.from_pretrained(
                    self.base_model, 
                    lora_path
                )
                self.current_lora = lora_path
        except Exception as e:
            logger.error(f"Failed to load LoRA adapter: {e}")
    
    def generate_dummy_audio(self, duration: float = 10.0, sample_rate: int = 32000):
        """Generate a simple sine wave as fallback audio"""
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        # Generate a simple melody with multiple frequencies
        frequencies = [440, 523, 659, 784]  # A, C, E, G notes
        audio = np.zeros_like(t)
        
        for i, freq in enumerate(frequencies):
            start_time = i * duration / len(frequencies)
            end_time = (i + 1) * duration / len(frequencies)
            mask = (t >= start_time) & (t < end_time)
            audio[mask] = 0.3 * np.sin(2 * np.pi * freq * t[mask])
        
        # Convert to tensor format
        audio_tensor = torch.tensor(audio, dtype=torch.float32).unsqueeze(0)
        return audio_tensor
            
    async def generate_music_async(self, request: GenerationRequest):
        """Generate music based on text prompt"""
        try:
            model = await self.load_base_model_async()
            
            if model is None:
                logger.warning("Model not available, generating dummy audio")
                # Generate dummy audio as fallback
                audio_data = self.generate_dummy_audio(request.duration)
                note = "Model not available - generated dummy audio"
            else:
                # Load LoRA adapter if specified
                if request.lora_model:
                    self.load_lora_adapter(request.lora_model)
                
                # Set generation parameters
                model.set_generation_params(
                    use_sampling=True,
                    top_k=request.top_k,
                    top_p=request.top_p,
                    temperature=request.temperature,
                    duration=request.duration,
                )
                
                # Generate audio
                logger.info(f"Generating music for prompt: {request.prompt}")
                loop = asyncio.get_event_loop()
                audio_data = await loop.run_in_executor(
                    self.executor,
                    self._generate_sync,
                    model,
                    request.prompt
                )
                note = "Generated using MusicGen model"
            
            # Convert to audio bytes
            buffer = io.BytesIO()
            torchaudio.save(buffer, audio_data, 32000, format="wav")
            buffer.seek(0)
            
            # Encode as base64
            audio_b64 = base64.b64encode(buffer.read()).decode()
            
            return {
                "audio_data": audio_b64,
                "sample_rate": 32000,
                "duration": request.duration,
                "prompt": request.prompt,
                "note": note
            }
            
        except Exception as e:
            logger.error(f"Error generating music: {e}")
            # Fallback to dummy audio
            audio_data = self.generate_dummy_audio(request.duration)
            buffer = io.BytesIO()
            torchaudio.save(buffer, audio_data, 32000, format="wav")
            buffer.seek(0)
            audio_b64 = base64.b64encode(buffer.read()).decode()
            
            return {
                "audio_data": audio_b64,
                "sample_rate": 32000,
                "duration": request.duration,
                "prompt": request.prompt,
                "note": f"Error occurred, generated dummy audio: {str(e)}"
            }
    
    def _generate_sync(self, model, prompt):
        """Synchronous music generation"""
        with torch.no_grad():
            wav = model.generate([prompt])
        return wav[0].cpu()

# Global service instance
music_service = MusicGenService()

@app.on_event("startup")
async def startup_event():
    """Initialize the model on startup"""
    logger.info("Starting MusicGen API...")
    # Start loading the model in the background
    asyncio.create_task(music_service.load_base_model_async())

@app.get("/")
async def root():
    return {"message": "MusicGen LoRA API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "device": music_service.device,
        "model_loaded": music_service.base_model is not None,
        "model_loading": music_service.model_loading
    }

@app.post("/generate")
async def generate_music(request: GenerationRequest):
    """Generate music from text prompt"""
    try:
        result = await music_service.generate_music_async(request)
        return result
    except Exception as e:
        logger.error(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_available_models():
    """List available LoRA models"""
    lora_dir = "./lora_models"
    models = []
    
    if os.path.exists(lora_dir):
        for item in os.listdir(lora_dir):
            if os.path.isdir(os.path.join(lora_dir, item)):
                models.append(item)
    
    return {"available_models": models}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)