import React,{useState} from 'react';
import {Link,} from 'react-router-dom';
import './GenMusic.css';
import AudioPlayer from 'react-audio-player';
import musicicon from './images/musicicon.png';
import audio from './audiotest/giveitaway.mp3';

export default function GenMusic(){
        const [Adesc, setAdesc]=useState('');
        const [Asvalue, setAsvalue]=useState('');
        const [Desc, setDesc]=useState('');
        const [sliderValue, setSliderValue] = useState(1);
        
        const handleDescInput =(e)=>{
            setDesc(e.target.value);
        }
        const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value, 10));}
        const handlesubmit=()=>{
            setAdesc(Desc);
            setAsvalue(sliderValue);

           
        }
    return(
        <div className='text2gen-container'>
            <div className="homebutton-container"><Link to='/Overview' className='Lhomelink'><p className='Lhomelink'>DASHBOARD</p></Link></div>

            <div className="heading1"><img src={musicicon} className='musicianiconl' alt='musicianicon'/><h1 className='gentxt1'>Text to Music Generator</h1><img src={musicicon} className='musicianiconr' alt='musicianicon'/>
            </div>
            <hr className="line"></hr>
            <div className="heading2"><h1 className='gentxt2'>Generate Your Most Inner Thoughts Into Music</h1></div>
            <div className="desc">
                <div className="txtdesc-container">
                    <h1 className='gentxt3'>Enter your Description:</h1>
                    <textarea placeholder="Enter your text here" className="big-input-box" value={Desc} onChange={handleDescInput} />
                    <div className="descbut-container"><button className='descbut' onClick={handlesubmit}>Submit</button></div>
                </div>
                <div className="slider-container">
                    <p className='adjusttime'>AdjustTime:</p>          
                    <input type='range' className='slider'min="1"max="20" value={sliderValue} onChange={handleSliderChange}></input>
                    <p className='svalue'>{sliderValue}</p>
                </div> 
                <div className="Ddisc-container">
                    <div className="subDdisc-container">
                        <p className='output1'>Your Discription: {Adesc}</p>
                        <p className='output2'>Time Duration:  {Asvalue}</p>
                    </div>

                </div>
        
            </div>
            <div className='Player'>
                <AudioPlayer src={audio} className='pplayer' autoPlay={false}controls />
                 </div>
            
        </div>
        


    );
}