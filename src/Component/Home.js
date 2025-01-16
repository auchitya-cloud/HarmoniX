import {React}from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import guitar from './images/guitar6.jpg';
import genmusic from './images/genmusic.png';
import cost from './images/cost.jpg';
import playtime from './images/playtime.png';
import userfriendly from './images/userfriendly.jpg';
import logo from './images/logo.jpg';



export default function Home(){
    
 


    return(
        <div>
        
      <nav className='customnav'>
        <img src={logo} className='logo' alt="logo" />
        <h1 className='brand'>Vibrato   </h1>
        <Link className='dashboard' to='/MainDashboard'><h4>Dashboard</h4></Link>  
        <Link className='Songs' to='/Songs'><h4>Songs</h4></Link>
        <a className='MusicGenerator' href="#GenMusic"><h4>MusicGenerator</h4></a>
        <a className='MusicLearner' href='#guitarlogo'><h4>MusicLearner</h4></a>
       
        <Link className='login' to='/Login'><h4>Login</h4></Link>
      </nav>
        <div className="welcome-container ">
        <h1 className='captions'>WELCOME TO VIBRATO<br/>
        Learn music with its various tools
        </h1>
        <h2 className='captions2'>Fun and easy to learn the instruments and train your voice</h2>
          </div>
              <div>
                <h1 className='captions3'>Learn the guitar</h1>
                
            </div>

        <div className="container">
          <section id='guitarlogo'>
            <Link  to='/LearnMusic' ><img className='guitarlogo' src={guitar} alt='guitar'></img></Link></section>
            </div>
        
        <h1 className='captions3'>We also have the Music generator.It generates music and songs based on your taste and even your mood</h1>
        
        <div className="one-container">
      <section id='GenMusiclogo'>
        <Link to='https://vibrato-hebmzczcmvnrpiyeammr8c.streamlit.app/' id='GenMusic'>
            <img className='GenMusiclogo' src={genmusic} alt='genMusic' />
        </Link>
      </section>
    </div>
        <div className="row-container">          
            <div className='div'>
              <img src={cost} className='btimgs1' alt='costfriendly'></img>
              <h3 className='txt1'>Free</h3>

            </div>
            <div>
            <img src={playtime} className='btimgs2' alt='unlimitedplaytime'></img>
            <h3 className='txt2'>Unlimited Play Time</h3>
            </div>
            <div>
            <img src={userfriendly} className='btimgs3' alt='userfriendly'></img>
            <h3 className='txt3'>UserFriendly</h3>

            </div>

          
        </div>
        <div className='about-container'>
             
            </div>
         

          
         
          </div>



     

    );
}
