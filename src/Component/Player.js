import React, { useEffect, useState } from 'react';
import './Player.css';
import AudioPlayer from 'react-audio-player';
import { useParams } from 'react-router-dom';

export default function Player() {
  const { trackId } = useParams();
  const [trackData, setTrackData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('token')
    const fetchTrackData = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        
        if (response.ok) {
          const data = await response.json();
          setTrackData(data);
        } else {
          console.error('Failed to fetch track data');
        }
      } catch (error) {
        console.error('Error fetching track data:', error);
      }
    };

    fetchTrackData();
  }, [trackId]);

  return (
    <div className="player">
      
      <div className="player-container">
             {trackData && (
            <>
            <img src={trackData.album.images[0].url} id='arimg' alt='imgg'/>
            <h1 id='songinfo'>{trackData.artists.map(artist => artist.name).join(', ')}-{trackData.name}</h1>
            
            <AudioPlayer
                src={trackData.preview_url} 
                autoPlay={false}
                controls/>
            </>
       
      )}
      </div>
    </div>
  );
}