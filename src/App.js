import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Component/Home.js';
import GenMusic from './Component/GenMusic.js';
import LearnMusic from './Component/LearnMusic.js';
import Login from './Component/Login.js';
import Dashboard from './Component/Dashboard/MainDashboard.js';
import Profile from './Component/Dashboard/Profile.js';
import Overview from './Component/Dashboard/Overview.js';
import Songs from './Component/Songs';
import Player from './Component/Player.js';
import Register from './Component/Register.js';
import Metronome from './Component/Dashboard/Metronome.js';


function App() {
  return (
    <Router >
      <Routes>       
        <Route path="/Vibrato" element={<Home />} />
        <Route path="/LearnMusic" element={<LearnMusic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/MainDashboard" element={<Dashboard />} />
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/GenMusic" element={<GenMusic />} />
        <Route path="/Overview" element={<Overview />} />
        <Route path='/Songs' element={<Songs/>}/>
        <Route path="/Player/:trackId" element={<Player />}/>
        <Route path="/Register" element={<Register />}/>
        <Route path="/Metronome" element={<Metronome />}/>
        

      </Routes>
    </Router>
  );
}

export default App;
