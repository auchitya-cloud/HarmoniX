import streamlit as st
import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt

# Function to convert MIDI note number to note name and octave
def midi_to_note(note_number):
    note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    note_name = note_names[note_number % 12]
    octave = note_number // 12 - 1  # Assuming A4 (440 Hz) as reference
    return f"{note_name}{octave}"

# Function to plot pitch over time
def plot_pitch(y, sr, title="Pitch Graph"):
    times = librosa.times_like(y)
    pitches, magnitudes = librosa.core.piptrack(y=y, sr=sr)
    pitch = np.nanmean(pitches, axis=0)

    fig, ax = plt.subplots()
    ax.set_xlabel('Time')
    ax.set_ylabel('Frequency (Hz)')
    ax.set_title(title)
    librosa.display.waveshow(y, sr=sr, ax=ax, alpha=0.5)

    if not np.isnan(pitch).all():  # Check for empty pitch array
        pitch_midi = librosa.hz_to_midi(np.nan_to_num(pitch[0]))

        # Check for zero and infinity values before plotting
        valid_pitch_indices = np.where((pitch_midi != 0) & np.isfinite(pitch_midi))
        
        # Ensure that both times and pitch_midi are 1D arrays
        times = np.atleast_1d(times)
        pitch_midi = np.atleast_1d(pitch_midi)

        ax.plot(times[valid_pitch_indices], pitch_midi[valid_pitch_indices], label='Estimated Pitch (MIDI)')
        ax.legend()

    return fig


# Streamlit app
def main():
    st.title("Pitch Graph Viewer with Streamlit")

    # List of pre-recorded audio file paths
    audio_files = ["/Users/auchitya/Desktop/musicengi/audiocraft/b14d-572a-4d26-85c1-c1b4dc1b78d0.mp3"]

    # Process each audio file
    for audio_file in audio_files:
        st.subheader(f"Processing file: {audio_file}")
        
        # Read audio file as mono
        y, sr = librosa.load(audio_file, sr=None, mono=True)

        # Plot and display the pitch graph for each audio file
        pitch_fig = plot_pitch(y, sr, title=f"Pitch Graph - {audio_file}")
        st.pyplot(pitch_fig)

    st.write("Processing complete.")

if __name__ == "__main__":
    main()
