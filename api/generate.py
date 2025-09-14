from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import random
import time
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerationRequest(BaseModel):
    prompt: str
    genre: Optional[str] = "electronic"
    mood: Optional[str] = "upbeat"
    duration: Optional[int] = 30

class GenerationResponse(BaseModel):
    success: bool
    track_id: str
    title: str
    prompt: str
    genre: str
    mood: str
    duration: int
    audio_url: Optional[str] = None
    waveform_data: Optional[list] = None
    message: str

@app.get("/")
async def root():
    return {"message": "HarmoniX ML API is running!", "status": "healthy"}

@app.post("/generate", response_model=GenerationResponse)
async def generate_music(request: GenerationRequest):
    """
    Generate music based on text prompt
    Currently returns mock data - replace with actual ML model
    """
    try:
        # Simulate processing time
        await asyncio.sleep(2)
        
        # Generate mock track ID
        track_id = f"track_{int(time.time())}_{random.randint(1000, 9999)}"
        
        # Generate mock waveform data for visualization
        waveform_data = [
            random.uniform(-1, 1) for _ in range(1000)
        ]
        
        # Mock response
        response = GenerationResponse(
            success=True,
            track_id=track_id,
            title=f"AI Generated: {request.prompt[:30]}...",
            prompt=request.prompt,
            genre=request.genre,
            mood=request.mood,
            duration=request.duration,
            audio_url=f"https://example.com/audio/{track_id}.mp3",
            waveform_data=waveform_data,
            message="Track generated successfully! (Demo mode - replace with actual ML model)"
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "HarmoniX ML API",
        "version": "1.0.0"
    }

# For Vercel serverless deployment
def handler(request):
    return app(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)