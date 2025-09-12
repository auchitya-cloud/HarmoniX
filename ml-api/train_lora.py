"""
Script for fine-tuning MusicGen with LoRA
Usage: python train_lora.py --dataset_path ./data --output_dir ./lora_models/my_model
"""

import torch
import torchaudio
from audiocraft.models import MusicGen
from peft import LoraConfig, get_peft_model, TaskType
from transformers import Trainer, TrainingArguments
import argparse
import os
from torch.utils.data import Dataset, DataLoader
import json

class MusicDataset(Dataset):
    def __init__(self, data_dir, sample_rate=32000, duration=10):
        self.data_dir = data_dir
        self.sample_rate = sample_rate
        self.duration = duration
        self.samples = self._load_samples()
    
    def _load_samples(self):
        """Load audio files and their corresponding text prompts"""
        samples = []
        metadata_file = os.path.join(self.data_dir, "metadata.json")
        
        if os.path.exists(metadata_file):
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)
                
            for item in metadata:
                audio_path = os.path.join(self.data_dir, item['audio_file'])
                if os.path.exists(audio_path):
                    samples.append({
                        'audio_path': audio_path,
                        'prompt': item['prompt'],
                        'genre': item.get('genre', ''),
                        'mood': item.get('mood', '')
                    })
        
        return samples
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        sample = self.samples[idx]
        
        # Load audio
        waveform, sr = torchaudio.load(sample['audio_path'])
        
        # Resample if necessary
        if sr != self.sample_rate:
            resampler = torchaudio.transforms.Resample(sr, self.sample_rate)
            waveform = resampler(waveform)
        
        # Ensure correct duration
        target_length = int(self.sample_rate * self.duration)
        if waveform.shape[1] > target_length:
            waveform = waveform[:, :target_length]
        elif waveform.shape[1] < target_length:
            padding = target_length - waveform.shape[1]
            waveform = torch.nn.functional.pad(waveform, (0, padding))
        
        return {
            'audio': waveform,
            'prompt': sample['prompt'],
            'genre': sample['genre'],
            'mood': sample['mood']
        }

def setup_lora_model(base_model, lora_config):
    """Setup LoRA configuration for MusicGen"""
    # Target modules for LoRA (adjust based on MusicGen architecture)
    target_modules = [
        "self_attn.q_proj",
        "self_attn.k_proj", 
        "self_attn.v_proj",
        "self_attn.out_proj"
    ]
    
    lora_config = LoraConfig(
        task_type=TaskType.FEATURE_EXTRACTION,
        r=lora_config.get('r', 16),
        lora_alpha=lora_config.get('lora_alpha', 32),
        lora_dropout=lora_config.get('lora_dropout', 0.1),
        target_modules=target_modules,
    )
    
    return get_peft_model(base_model, lora_config)

def train_lora_model(args):
    """Main training function"""
    
    # Load base model
    print("Loading base MusicGen model...")
    base_model = MusicGen.get_pretrained('facebook/musicgen-medium')
    
    # Setup LoRA
    lora_config = {
        'r': args.lora_r,
        'lora_alpha': args.lora_alpha,
        'lora_dropout': args.lora_dropout
    }
    
    model = setup_lora_model(base_model, lora_config)
    
    # Load dataset
    print("Loading dataset...")
    dataset = MusicDataset(args.dataset_path)
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        learning_rate=args.learning_rate,
        warmup_steps=args.warmup_steps,
        logging_steps=args.logging_steps,
        save_steps=args.save_steps,
        save_total_limit=2,
        remove_unused_columns=False,
        dataloader_pin_memory=False,
    )
    
    # Custom trainer for music generation
    class MusicGenTrainer(Trainer):
        def compute_loss(self, model, inputs, return_outputs=False):
            # Implement custom loss for music generation
            # This is a simplified version - you'd need to implement
            # the actual MusicGen training loss
            outputs = model(**inputs)
            loss = outputs.loss if hasattr(outputs, 'loss') else torch.tensor(0.0)
            return (loss, outputs) if return_outputs else loss
    
    # Initialize trainer
    trainer = MusicGenTrainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
    )
    
    # Start training
    print("Starting training...")
    trainer.train()
    
    # Save the final model
    trainer.save_model()
    print(f"Model saved to {args.output_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune MusicGen with LoRA")
    parser.add_argument("--dataset_path", type=str, required=True, help="Path to training dataset")
    parser.add_argument("--output_dir", type=str, required=True, help="Output directory for trained model")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=1, help="Training batch size")
    parser.add_argument("--learning_rate", type=float, default=1e-4, help="Learning rate")
    parser.add_argument("--lora_r", type=int, default=16, help="LoRA rank")
    parser.add_argument("--lora_alpha", type=int, default=32, help="LoRA alpha")
    parser.add_argument("--lora_dropout", type=float, default=0.1, help="LoRA dropout")
    parser.add_argument("--gradient_accumulation_steps", type=int, default=4, help="Gradient accumulation steps")
    parser.add_argument("--warmup_steps", type=int, default=100, help="Warmup steps")
    parser.add_argument("--logging_steps", type=int, default=10, help="Logging steps")
    parser.add_argument("--save_steps", type=int, default=500, help="Save steps")
    
    args = parser.parse_args()
    train_lora_model(args)