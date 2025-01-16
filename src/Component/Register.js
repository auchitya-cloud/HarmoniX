import React,{useState} from 'react';
import './Login.css'
import emailmg from './images/email.png';
import padlock from './images/padlock.png';
import userlogo from './images/userlogo.png';
import { Link, Navigate } from 'react-router-dom';


export default function Register(){
    const[email, setEmail]=useState("");
    const[username, setUsername]=useState("");
    const[password, setPassword]=useState("");
    const[allentry, setAllentry]=useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    const submitForm=(e)=>{
        const newEntry={email:email, password:password, username:username};
        setAllentry([...allentry,newEntry]);
        setIsRegistered(true);

    }
    if (isRegistered) {
        // Redirect to the Profile component after successful registration
        return <Navigate to={`/profile?username=${username}&email=${email}`} />;
      }
    
    
    return( 
       <div className="main-container">
        <div className="left-container">
                <h1 className='brand1'>VIBRATO</h1>
            </div>
            <div className="submain-container">
            
            <div className="margin-container">

            <form action='' onSubmit={submitForm}>
            <div className="inputs">
                    <label>Username</label>
                    <input type='text' className='inpuser' placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}></input>
                    <img src={userlogo} className='img3' alt='user' ></img>
                </div>
                <div className="inputs">
                    <label>Email</label>
                    <input type='email' className='inpemail' placeholder='your email@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                    <img src={emailmg} className='img1' alt='email' ></img>
                </div>
                <div className="inputs">
                    <label>Password</label>
                    <input type='password' className='inppassword' placeholder='password' value ={password} onChange={(e)=>setPassword(e.target.value)}></input>
                    <img src={padlock} className='img2' alt='password' ></img>
                </div>
                <Link to='#'><button className='registerbtn' onClick={submitForm}>Register</button></Link>
                
            </form>
            </div>
            
            </div>
        </div>
       

    );
}