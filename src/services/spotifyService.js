import axios from 'axios';

class SpotifyService {
    constructor() {
        this.clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        this.redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';
        this.scopes = [
            'user-read-private',
            'user-read-email',
            'playlist-read-private',
            'playlist-read-collaborative',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-library-read',
            'user-library-modify',
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing',
            'streaming'
        ].join(' ');

        this.accessToken = localStorage.getItem('spotify_access_token');
        this.refreshToken = localStorage.getItem('spotify_refresh_token');
    }

    // Generate Spotify authorization URL
    getAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: 'code',
            redirect_uri: this.redirectUri,
            scope: this.scopes,
            show_dialog: 'true'
        });

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    // Exchange authorization code for access token
    async getAccessToken(code) {
        try {
            const response = await axios.post('/api/spotify/token', {
                code,
                redirect_uri: this.redirectUri
            });

            const {
                access_token,
                refresh_token
            } = response.data;

            this.accessToken = access_token;
            this.refreshToken = refresh_token;

            localStorage.setItem('spotify_access_token', access_token);
            localStorage.setItem('spotify_refresh_token', refresh_token);

            return {
                access_token,
                refresh_token
            };
        } catch (error) {
            console.error('Error getting Spotify access token:', error);
            throw error;
        }
    }

    // Refresh access token
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await axios.post('/api/spotify/refresh', {
                refresh_token: this.refreshToken
            });

            const {
                access_token
            } = response.data;
            this.accessToken = access_token;
            localStorage.setItem('spotify_access_token', access_token);

            return access_token;
        } catch (error) {
            console.error('Error refreshing Spotify token:', error);
            this.logout();
            throw error;
        }
    }

    // Make authenticated request to Spotify API
    async makeRequest(endpoint, options = {}) {
        if (!this.accessToken) {
            throw new Error('No access token available');
        }

        try {
            const response = await axios({
                url: `https://api.spotify.com/v1${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                ...options
            });

            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token expired, try to refresh
                try {
                    await this.refreshAccessToken();
                    // Retry the request
                    const response = await axios({
                        url: `https://api.spotify.com/v1${endpoint}`,
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        ...options
                    });
                    return response.data;
                } catch (refreshError) {
                    throw refreshError;
                }
            }
            throw error;
        }
    }

    // Get user profile
    async getUserProfile() {
        return this.makeRequest('/me');
    }

    // Get user's playlists
    async getUserPlaylists(limit = 50) {
        return this.makeRequest(`/me/playlists?limit=${limit}`);
    }

    // Create a new playlist
    async createPlaylist(name, description = '', isPublic = false) {
        const user = await this.getUserProfile();
        return this.makeRequest(`/users/${user.id}/playlists`, {
            method: 'POST',
            data: {
                name,
                description,
                public: isPublic
            }
        });
    }

    // Add tracks to playlist
    async addTracksToPlaylist(playlistId, trackUris) {
        return this.makeRequest(`/playlists/${playlistId}/tracks`, {
            method: 'POST',
            data: {
                uris: trackUris
            }
        });
    }

    // Search for tracks
    async searchTracks(query, limit = 20) {
        const encodedQuery = encodeURIComponent(query);
        return this.makeRequest(`/search?q=${encodedQuery}&type=track&limit=${limit}`);
    }

    // Get recommendations based on seed tracks
    async getRecommendations(seedTracks = [], seedGenres = [], limit = 20) {
        const params = new URLSearchParams();

        if (seedTracks.length > 0) {
            params.append('seed_tracks', seedTracks.join(','));
        }

        if (seedGenres.length > 0) {
            params.append('seed_genres', seedGenres.join(','));
        }

        params.append('limit', limit);

        return this.makeRequest(`/recommendations?${params.toString()}`);
    }

    // Get available genres
    async getAvailableGenres() {
        return this.makeRequest('/recommendations/available-genre-seeds');
    }

    // Get user's saved tracks
    async getSavedTracks(limit = 50) {
        return this.makeRequest(`/me/tracks?limit=${limit}`);
    }

    // Save track to user's library
    async saveTrack(trackId) {
        return this.makeRequest('/me/tracks', {
            method: 'PUT',
            data: {
                ids: [trackId]
            }
        });
    }

    // Get current playback state
    async getCurrentPlayback() {
        return this.makeRequest('/me/player');
    }

    // Start/Resume playback
    async startPlayback(deviceId = null, contextUri = null, uris = null) {
        const data = {};

        if (contextUri) data.context_uri = contextUri;
        if (uris) data.uris = uris;

        const endpoint = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';

        return this.makeRequest(endpoint, {
            method: 'PUT',
            data
        });
    }

    // Pause playback
    async pausePlayback() {
        return this.makeRequest('/me/player/pause', {
            method: 'PUT'
        });
    }

    // Skip to next track
    async skipToNext() {
        return this.makeRequest('/me/player/next', {
            method: 'POST'
        });
    }

    // Skip to previous track
    async skipToPrevious() {
        return this.makeRequest('/me/player/previous', {
            method: 'POST'
        });
    }

    // Set volume
    async setVolume(volumePercent) {
        return this.makeRequest(`/me/player/volume?volume_percent=${volumePercent}`, {
            method: 'PUT'
        });
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.accessToken;
    }

    // Logout
    logout() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
    }
}

export default new SpotifyService();