// Test script to check if media links are being saved properly
import fetch from 'node-fetch';

async function testAddSongWithLinks() {
  try {
    // First, test that we can add a song with media links
    const songData = {
      title: "Test Song with Media Links",
      artist: "Test Artist",
      lyrics: "这是一个测试\n这是第二行",
      userId: 1, // Assuming user 1 exists
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      spotifyLink: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT"
    };

    // Add the song
    const addResponse = await fetch('http://localhost:5000/api/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(songData)
    });

    if (!addResponse.ok) {
      throw new Error(`Failed to add song: ${addResponse.status} ${addResponse.statusText}`);
    }

    const newSong = await addResponse.json();
    console.log('Song added successfully with ID:', newSong.id);
    console.log('Media links in added song:', {
      youtubeLink: newSong.youtubeLink,
      spotifyLink: newSong.spotifyLink
    });

    // Fetch the song to verify links were saved
    const getResponse = await fetch(`http://localhost:5000/api/songs/${newSong.id}`);
    if (!getResponse.ok) {
      throw new Error(`Failed to get song: ${getResponse.status} ${getResponse.statusText}`);
    }

    const fetchedSong = await getResponse.json();
    console.log('Fetched song media links:', {
      youtubeLink: fetchedSong.youtubeLink,
      spotifyLink: fetchedSong.spotifyLink
    });

    // Check if links match
    const linksMatch = 
      songData.youtubeLink === fetchedSong.youtubeLink && 
      songData.spotifyLink === fetchedSong.spotifyLink;
    
    console.log('Links match original data:', linksMatch);
    return fetchedSong;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the test
testAddSongWithLinks();