import React, { useState, useRef } from 'react';
import './Audiorecorder.css';

export default function Audiorecorder() {
  const audioChunk = useRef([]);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const mediaRecorderRef = useRef(null);

  const startRec = async () => {
    // Clear the previous audio chunks
    audioChunk.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunk.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunk.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordings((prevRecs) => [...prevRecs, audioUrl]);
      setCurrentRecording(audioUrl); // Set the current recording URL
    };

    mediaRecorder.start();
  };

  const stopRec = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunk.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunk.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordings((prevRecs) => [...prevRecs, audioUrl]);
        setCurrentRecording(audioUrl); // Set the current recording URL
      };

      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className='recaudio'>
      <button className='btnrecc' onClick={startRec}>Start</button>
      <button className='btnrecc' onClick={stopRec}>Stop</button>
      {currentRecording && (
        <div>
          <audio controls src={currentRecording} />
        </div>
      )}
    </div>
  );
}
