import gradio as gr
import torch
import numpy as np
import io
import base64
import wave
from lightweight_main import MusicGenService

# Initialize the service
music_service = MusicGenService()

def generate_music_interface(prompt, duration, temperature, lora_model):
    """Gradio interface for music generation"""
    try:
        # Create a mock request object
        class MockRequest:
            def __init__(self, prompt, duration, temperature, lora_model):
                self.prompt = prompt
                self.duration = duration
                self.temperature = temperature
                self.lora_model = lora_model if lora_model != "None" else None
        
        request = MockRequest(prompt, duration, temperature, lora_model)
        
        # Generate music (this will be async in real implementation)
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(music_service.generate_music_async(request))
        
        # Decode base64 audio
        audio_data = base64.b64decode(result["audio_data"])
        
        # Save to temporary file for Gradio
        with open("temp_audio.wav", "wb") as f:
            f.write(audio_data)
        
        return "temp_audio.wav", result["note"]
        
    except Exception as e:
        return None, f"Error: {str(e)}"

# Create Gradio interface
with gr.Blocks(title="HarmoniX - AI Music Generator") as demo:
    gr.Markdown("# 🎵 HarmoniX - AI Music Generator")
    gr.Markdown("Generate music using AI with MusicGen and LoRA fine-tuning")
    
    with gr.Row():
        with gr.Column():
            prompt = gr.Textbox(
                label="Music Prompt",
                placeholder="e.g., upbeat electronic dance music with synthesizers",
                lines=3
            )
            duration = gr.Slider(5, 30, value=10, label="Duration (seconds)")
            temperature = gr.Slider(0.1, 2.0, value=1.0, label="Creativity")
            lora_model = gr.Dropdown(
                ["None", "jazz-lora", "electronic-lora", "classical-lora"],
                value="None",
                label="LoRA Model"
            )
            generate_btn = gr.Button("🎵 Generate Music", variant="primary")
        
        with gr.Column():
            audio_output = gr.Audio(label="Generated Music")
            status_output = gr.Textbox(label="Status", lines=2)
    
    generate_btn.click(
        generate_music_interface,
        inputs=[prompt, duration, temperature, lora_model],
        outputs=[audio_output, status_output]
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)