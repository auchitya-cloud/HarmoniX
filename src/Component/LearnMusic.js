import './LearnMusic.css';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Audiorecorder from './Audiorecorder.js';

const LearnMusic = () => {
  const labels = [-1, 0, 1, 2];
  const [dataset1, setDataset1] = useState([]);
  const [dataset2, setDataset2] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const data1 = [1, 3, 2, 5, 4, 7, 3, 6, -1, 3, -1, 6, 1, 9, 4, 5, 3, 2, 6];
    const data2 = [2, 4, 6, 8, 9, 7, 3, 5, 8, -1, -1, 9, 2, 4, 7, 5, 8, 2, 6];
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setDataset1((prevData) => [...prevData.slice(1), ...data1.slice(currentIndex, currentIndex + 2)]);
        setDataset2((prevData) => [...prevData.slice(1), ...data2.slice(currentIndex, currentIndex + 2)]);
        setCurrentIndex((prevIndex) => prevIndex + 2);
        
      }, 500);
    }

    // Cleanup function to clear the interval when the component unmounts or when the graph stops
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentIndex, isRunning]);

  const startGraph = () => {
    setIsRunning(true);
  };

  const stopGraph = () => {
    setIsRunning(false);
    setCurrentIndex(0); 
  };

  const resetGraph = () => {
    setCurrentIndex(0);
    setDataset1([]);
    setDataset2([]);
  };

  const chartData = {
    labels: labels.slice(0, Math.max(dataset1.length, dataset2.length)),
    datasets: [
      {
        label: 'Dataset 1',
        data: dataset1,
        borderColor: 'cyan',
        fill: false,
        pointRadius: (context) => {
          const index = context.dataIndex;
          return dataset1[index] === dataset2[index] ? 12 : 8;
        },
        pointBackgroundColor: (context) => {
          const index = context.dataIndex;
          return dataset1[index] === dataset2[index] ? 'lightgreen' : 'cyan';
        },
        pointBorderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Dataset 2',
        data: dataset2,
        borderColor: 'orange',
        fill: false,
        pointRadius: (context) => {
          const index = context.dataIndex;
          return dataset1[index] === dataset2[index] ? 12 : 8;
        },
        pointBackgroundColor: (context) => {
          const index = context.dataIndex;
          return dataset1[index] === dataset2[index] ? 'lightgreen' : 'orange';
        },
        pointBorderColor: 'rgba(255, 165, 0, 1)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        offset: true,
        beginAtZero: false,
        min: labels[0],
        grid: { display: false },
      },
      y: {
        beginAtZero: false,
        min: -2,
        max: 12,
        ticks: {
          stepSize: 1,
        },
        grid: { display: false },
      },
    },
    elements: {
      line: {
        tension: 0.1,
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div>
      <Audiorecorder/>
      <div className="chartM-container">
      <div className='butG-container'>
        <button className='butG' onClick={startGraph}>Start Graph</button>
        <button className='butG' onClick={stopGraph}>Stop Graph</button>
        <button className='butG' onClick={resetGraph}>Reset Graph</button>
      </div>
      <div className="chart-container">
        
        <Line className='cchart' data={chartData} options={chartOptions} />
      </div>
      </div>
     
    </div>
  );
};

export default LearnMusic;
