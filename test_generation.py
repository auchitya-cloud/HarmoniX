#!/usr/bin/env python3
import requests
import json

def test_music_generation():
    print("Testing music generation...")
    
    # Test generation endpoint
    try:
        payload = {
            "prompt": "upbeat electronic dance music with synthesizers",
            "duration": 5.0,
            "temperature": 1.0
        }
        
        response = requests.post(
            "http://localhost:8000/generate", 
            json=payload,
            timeout=300  # 5 minutes timeout for generation
        )
        
        print(f"Generation status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Generated audio duration: {data['duration']}s")
            print(f"Sample rate: {data['sample_rate']}")
            print(f"Prompt: {data['prompt']}")
            print(f"Audio data length: {len(data['audio_data'])} characters")
            print("✅ Music generation successful!")
        else:
            print(f"Error: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Generation failed: {e}")

if __name__ == "__main__":
    test_music_generation()