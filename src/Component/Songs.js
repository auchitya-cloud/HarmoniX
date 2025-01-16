import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Songs.css';
import { Row, Card } from 'react-bootstrap';

const CLIENT_ID = '8d53c61a94364a0b9de6f8d3029f561b';
const CLIENT_SECRET = 'cfcca24cb391401ba90e59a1478c836d';

export default function Songs() {
  const [accessToken, setAccessToken] = useState('');
  const [searchinput, setsearchinput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  const redirectToPlayer = (trackId) => {
    // Redirect to the player component with the selected trackId
    navigate(`/player/${trackId}?token=${accessToken}`);
  };

  async function search() {
    console.log('search for ' + searchinput);

    // Make a request to the Spotify API using the access token
    const response = await fetch(`https://api.spotify.com/v1/search?q=${searchinput}&type=track`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Search results:', data);
      
      // Update to access the tracks instead of albums
      setSearchResults(data.tracks.items);
    } else {
      console.error('Failed to fetch search results');
    }
  }

  const handleinput = (e) => {
    setsearchinput(e.target.value);
  };

  return (
    <div className="searchsongs-container">
      <div className="serchertxt-container">
        <h2 id="song">Song searcher</h2>
        <Link to="/Overview" id="hButt">
          <p>Dashboard</p>
        </Link>
      </div>
      <div className="songinput-container">
        <input
          type="text"
          id="songinput"
          placeholder="Enter your Song"
          value={searchinput}
          onChange={handleinput}
          onKeyDown={(e) => e.key === 'Enter' && search()}
        />
        <button id="songbut" onClick={search}>
          Submit
        </button>
      </div>
      <div className="songs-container">
        <Row className="row row-cols-4">
          {searchResults.map((track) => (
            <Card key={track.id} className="card">
              <Card.Img src={track.album.images[0].url} alt={track.name} onClick={() => redirectToPlayer(track.id)} />
              <Card.Body>
                <Card.Title>{track.name}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </div>
    </div>
  );
}
