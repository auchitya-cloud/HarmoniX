import React from 'react';
import './Profile.css';
import {Link,useLocation } from 'react-router-dom';
import profile_pic from '../../Component/images/user1.png';
import Settings from '../../Component/images/settings.png';



export default function Profile(){
    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('username') || 'John Doe';
  const email = searchParams.get('email') || 'random@email.com';
    return(
        <div className="dash-container">
                
            <div className='navleft-container'>
                <div className="brand-container">
                <Link to='/' className='prof_brand_name'> <h2 className='prof_brand_name'>VIBRATO </h2></Link><br/><h3 className='prof_dash_name'>Dashboard</h3>
                    </div>
                <div className="Plist">
                    <ul>
                        <Link to ='/Overview' className='Plist1'><p>Overview</p></Link>
                    </ul>
                    <ul>
                        <Link to ='/LearnMusic' className='Plist1'><p>LearnMusic</p></Link>
                    </ul>
                    <ul>
                        <Link to ='https://vibrato-hebmzczcmvnrpiyeammr8c.streamlit.app/' className='Plist1'><p>GenerateMusic</p></Link>
                    </ul>
                    <ul>
                        <Link to ='/Songs' className='Plist1'><p>Songs</p></Link>
                    </ul>
                    <ul>
            <Link to='/Metronome' className='Plist1'><p>Metronome</p></Link>
          </ul>
                    
                </div>
             </div>
                <div className='navright-container'>
                <div className="prof-container">
                    
                   
                    <Link to ='/Profile' className='prof_pic'><img src={profile_pic} alt='profile_pic' className='prof_pic' ></img></Link>
                    <img src={Settings} alt='settings' className="dropdown-toggle3" id="dropdownMenuButton" data-toggle="dropdown"></img>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                
                                <Link className="dropdown-item" to="/Login">Logout</Link>
            
                            </div>
                    </div>

                 <div className='prof_top-container'>
                 <div className="profile-container">
                <div className="profile-pic">
                        <img src={profile_pic} alt="Profile_pic" />
                        </div>
                         <div className="profile-info">
                            <h2>{username}</h2>
                            <p>{email}</p>
                        </div>
                    
                 </div>
                    
                   
                </div>
                
           

        </div>
        </div>


    );
}