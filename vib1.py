import streamlit as st
import pyaudio
import librosa
import numpy as np
import matplotlib.pyplot as plt

# Parameters for the microphone input
sample_rate = 54100
buffer_size = 10048
channels = 1
duration = 10  # Duration of the graph in seconds

# Function to convert MIDI note number to note name and octave
def midi_to_note(note_number):
    note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    note_name = note_names[note_number % 12]
    octave = note_number // 12 - 1  # Assuming A4 (440 Hz) as reference
    return f"{note_name}{octave}"

# Function to create a real-time frequency graph
def real_time_frequency_graph():
    # Create an audio input stream
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paFloat32,
                    channels=channels,
                    rate=sample_rate,
                    input=True,
                    frames_per_buffer=buffer_size)

    # Initialize the graph
    x_data = []
    y_data = []
    fig, ax = plt.subplots()
    ax.set_xlabel('Time')
    ax.set_ylabel('Frequency (Hz)')
    ax.set_title('Real-time Frequency Graph')

    # Create an initial empty plot
    line, = ax.plot([], [])
    x_limit = duration * sample_rate / buffer_size
    ax.set_xlim(0, x_limit)

    st.write("Listening for musical notes...")

    try:
        while True:
            audio_data = stream.read(buffer_size)
            audio_data = np.frombuffer(audio_data, dtype=np.float32)

            # Perform pitch detection using librosa
            pitches, magnitudes = librosa.core.piptrack(y=audio_data, sr=sample_rate)
            pitch = np.nanmean(pitches)

            note_number = int(round(librosa.hz_to_midi(pitch)))
            note_name = midi_to_note(note_number)
            frequency = pitch

            if pitch != 0:
                x_data.append(len(x_data))
                y_data.append(frequency)
                if len(x_data) > x_limit:
                    x_data.pop(0)
                    y_data.pop(0)

                line.set_data(x_data, y_data)
                ax.relim()
                ax.autoscale_view()
                st.pyplot(fig)
                print(f"Detected note: {note_name} (MIDI note: {note_number}, frequency: {frequency:.2f} Hz)")
                plt.pause(0.01)

    except KeyboardInterrupt:
        st.write("Stopped by the user.")

    # Close the audio stream
    stream.stop_stream()
    stream.close()
    p.terminate()

# Streamlit app
def main():
    st.title("Real-time Frequency Graph with Streamlit")
    real_time_frequency_graph()

if __name__ == "__main__":
    main()
