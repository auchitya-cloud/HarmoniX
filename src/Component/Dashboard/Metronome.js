import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profile_pic from '../../Component/images/user1.png';
import click from '../audiotest/click.mp3';
import Settings from '../../Component/images/settings.png';
import './Metronome.css';

export default function Metronome() {
  const [Tempo, setTempo] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [BeatCount, setBeatCount] = useState(0);

  const handleTempoChange = (event) => {
    const newTempo = parseInt(event.target.value, 10);
    setTempo(newTempo);
  };

  const handletemposub = () => {
    setTempo((prevTempo) => Math.max(prevTempo - 1, 1));
  };

  const handletempoadd = () => {
    setTempo((prevTempo) => prevTempo + 1);
  };

  const startStopMetronome = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  useEffect(() => {
    let intervalId;

    const playTick = () => {
      const audio = new Audio(click);
      setBeatCount((prevBeatCount) => (prevBeatCount + 1) % 4);
      audio.play();
    };

    if (isPlaying) {
      intervalId = setInterval(() => {
        playTick();
      }, (60 / Tempo) * 1000);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, Tempo]);

  return (
    <div className="dash-container">
      <div className="navleft-container">
        <div className="brand-container">
          <Link to="/" className="prof_brand_name">
            <h2 className="prof_brand_name">VIBRATO </h2>
          </Link>
          <br />
          <h3 className="prof_dash_name">Dashboard</h3>
        </div>
        <div className="Plist">
          <ul>
            <Link to="/Overview" className="Plist1">
              <p>Overview</p>
            </Link>
          </ul>
          <ul>
            <Link to="/LearnMusic" className="Plist1">
              <p>LearnMusic</p>
            </Link>
          </ul>
          <ul>
            <Link
              to="https://vibrato-hebmzczcmvnrpiyeammr8c.streamlit.app/"
              className="Plist1"
            >
              <p>GenerateMusic</p>
            </Link>
          </ul>
          <ul>
            <Link to="/Songs" className="Plist1">
              <p>Songs</p>
            </Link>
          </ul>
          <ul>
            <Link to="/Metronome" className="Plist1">
              <p>Metronome</p>
            </Link>
          </ul>
        </div>
      </div>
      <div className="navright-container">
        <div className="prof-container">
          <Link to="/Profile" className="prof_pic">
            <img
              src={profile_pic}
              alt="profile_pic"
              className="prof_pic"
            ></img>
          </Link>
          <img
            src={Settings}
            alt="settings"
            className="dropdown-toggle3"
            id="dropdownMenuButton"
            data-toggle="dropdown"
          ></img>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            
            <Link className="dropdown-item" to="/Login">
              Logout
            </Link>
          </div>
        </div>
        <div className="Metronome-container">
          <div className="metronome">
            <div className="bpm-display">
              <span className="tempo">{Tempo}</span>
              <span className="bpm">BPM</span>
            </div>
            <div className="temposettings">
              <div className="increasetempo" onClick={handletemposub}>
                -
              </div>
              <input
                type="range"
                min="1"
                max="280"
                step="1"
                className="slider"
                value={Tempo}
                onChange={handleTempoChange}
              />
              <div className="decreasetempo" onClick={handletempoadd}>
                +
              </div>
            </div>
            <div
              className="startstop"
              onClick={startStopMetronome}
            >
              {isPlaying ? 'Stop' : 'Start'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
