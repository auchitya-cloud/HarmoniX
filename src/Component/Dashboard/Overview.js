import React, { useEffect, useRef } from 'react';
import './Overview.css';
import { Link } from 'react-router-dom';
import profile_pic from '../../Component/images/user1.png';
import Settings from '../../Component/images/settings.png';
import Chart from 'chart.js/auto';

export default function Overview() {
  const pieChartRef = useRef();  // Ref for the pie chart
  const BarchartRef = useRef();  // Ref for the bar chart

  useEffect(() => {
    // Sample data for the pie chart
    const pieData = {
      labels: ['Music Generator', 'Music Learner', 'Songs'],
      datasets: [{
        data: [30, 40, 30],
        backgroundColor: ['rgba(255,99,132,0.7)', 'rgba(54,162,235,0.7)', 'rgba(255,206,86,0.7)'],
      }],
    };

    const ctx = pieChartRef.current.getContext('2d');

    if (pieChartRef.current.chart) {
      pieChartRef.current.chart.destroy();
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const newChart = new Chart(ctx, {
      type: 'pie',
      data: pieData,
    });

    pieChartRef.current.chart = newChart;
  }, []);

  useEffect(() => {
    // Sample usage time data (replace with your actual data)
    const usageData = {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'App Usage Time (hours)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        data: [2, 3, 1.5, 4, 2.5, 4, 7],
      }],
    };

    const ctx = BarchartRef.current.getContext('2d');

    if (BarchartRef.current.chart) {
      BarchartRef.current.chart.destroy();
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const newChart = new Chart(ctx, {
      type: 'bar',
      data: usageData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    BarchartRef.current.chart = newChart;
  }, []);

  return (
    <div className="dash-container">
      <div className="navtop-container"></div>

      <div className='navleft-container'>
        <div className="brand-container">
        <Link to='/' className='prof_brand_name'><h2 className='prof_brand_name'>VIBRATO </h2></Link><br /><h3 className='prof_dash_name'>Dashboard</h3>
        </div>
        <div className="Plist">
          <ul>
            <Link to='/Overview' className='Plist1'><p>Overview</p></Link>
          </ul>
          <ul>
            <Link to='/LearnMusic' className='Plist1'><p>LearnMusic</p></Link>
          </ul>
          <ul>
            <Link to='https://vibrato-hebmzczcmvnrpiyeammr8c.streamlit.app/' className='Plist1'><p>GenerateMusic</p></Link>
          </ul>
          <ul>
            <Link to='/Songs' className='Plist1'><p>Songs</p></Link>
          </ul>
          <ul>
            <Link to='/Metronome' className='Plist1'><p>Metronome</p></Link>
          </ul>
          
        </div>
      </div>

      <div className='navright-container'>
        <div className="prof-container">
          
          <Link to='/Profile' className='prof_pic'><img src={profile_pic} alt='profile_pic' className='prof_pic' ></img></Link>
          <img src={Settings} alt='settings' className="dropdown-toggle3" id="dropdownMenuButton" data-toggle="dropdown"></img>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
           
            <Link className="dropdown-item" to="/Login">Logout</Link>
          </div>
        </div>
          <div className="graph-container">
            <div className='appuover'><h2>App Usage Overview</h2></div>
          
            <div className="chartpie-container">
            <canvas ref={pieChartRef} className='chartno' ></canvas>
          </div>
          <div className="chartbar-container">
            <canvas ref={BarchartRef} className='chartyes' ></canvas>
          </div>
        </div>
      </div>
        
    </div>
    
  );
}
