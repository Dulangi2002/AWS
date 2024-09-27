<script setup>
import { ref, onMounted, reactive } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();


const albums = ref([]);
const artists = ref([]);
const genres = ref([]);
const tracks = ref([]);
const playlists = ref([]);
const searchQuery = ref('');
const selectedGenre = ref('');
const selectedArtist = ref('');
const filteredAlbums = ref([]);
const filteredArtists = ref([]);
const filteredTracks = ref([]);
const filteredPlaylists = ref([]);
const error = ref(null);
const success = ref(null);
const username = ref("");
const newemail = ref("");
const oldpassword = ref("");
const newpassword = ref("");
const accessToken = ref("");
const role = ref("");


const fetchAlbums = async () => {
  try {
    const response = await axios.get('https://2cxjj1j302.execute-api.us-east-1.amazonaws.com/dev');
    const data = response.data;
    const parsedData = JSON.parse(data.body);
    console.log('Parsed Data:', parsedData);
    albums.value = parsedData.albums || [];

    filterAlbums(); 
  } catch (err) {
    error.value = err.message || 'Something went wrong!';
    console.error('Error:', error.value);
  }
};

const fetchArtistsAndGenres = async () => {
  try {
    const response = await fetch('https://9dquycw6o7.execute-api.us-east-1.amazonaws.com/dev');
    if (!response.ok) throw new Error('Something went wrong!');
    const data = await response.json();
    const parsedData = JSON.parse(data.body);
    artists.value = parsedData.artists || [];
    genres.value = parsedData.genres || [];
    filerArtists();
  } catch (err) {
    error.value = err.message || 'Something went wrong!';
    console.error('Error:', error.value);
  }
};

const fetchTracks = async() =>{
   try {
      const response =await axios.get('https://e5777brgh0.execute-api.us-east-1.amazonaws.com/dev');
      console.log('Response:', response.data);
      const parsedData = JSON.parse(response.data.body);
      tracks.value = parsedData.tracks || [];
      filterTracks();

   } catch (err) {
    error.value = err.message || 'Something went wrong!';
    console.error('Error:', error.value);
    }
};

const fetchFavouritePlaylists = async() => {
  try {
    const user = store.state.user.username;
    console.log("this is the user", user)
    const response = await axios.get(`https://px8t3ew7eb.execute-api.us-east-1.amazonaws.com/dev/?username=${user}`);
    console.log(response.data);
    const parsedData = JSON.parse(response.data.body);
    console.log("this isthe parsed data" , parsedData)

    playlists.value = parsedData.playlists || [];
    console.log("this is the playlists", playlists.value)
    
    filterPlaylists();
  } catch (err) {
    error.value = err.message || 'Something went wrong!';
    console.error('Error:', error.value);
  }
};

const applySearch = () => {
  filterAlbums();
  filterTracks();
  filerArtists();
  filterPlaylists();
};

const applyGenreFilter = () => {
  filterAlbums();
  filterTracks();
  filerArtists();
  filterPlaylists();
};

const applyArtistFilter = () => {
  filterAlbums();
};

const filterAlbums = () => {
 
  filteredAlbums.value = albums.value.filter(album => {
    const matchesTitle = album.albumTitle.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesGenre = selectedGenre.value ? album.albumGenre === selectedGenre.value : true;
const matchesArtist = selectedArtist.value 
    ? album.albumArtist.toLowerCase().trim() === selectedArtist.value.toLowerCase().trim() 
    : true;
    console.log(selectedArtist.value);
    return matchesTitle && matchesGenre && matchesArtist;
  });
};



const filterTracks = () => {
  filteredTracks.value = tracks.value.filter(track => {
    const matchesTitle = track.trackTitle.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesGenre = selectedGenre.value ? track.trackGenre === selectedGenre.value : true;
    return matchesTitle && matchesGenre;
  });
};


const filerArtists = () => {
  filteredArtists.value = artists.value.filter(artist => {
    const matchesName = artist.artist_name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesGenre = selectedGenre.value ? artist.artist_genre === selectedGenre.value : true;
    return matchesName && matchesGenre;
  });
};

const filterPlaylists = () => {
  filteredPlaylists.value = playlists.value.filter(playlist => {
    const matchesName = playlist.playlistName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesGenre = selectedGenre.value ? playlist.playlistGenre === selectedGenre.value : true;
    return matchesName && matchesGenre;
  });
};


const editUser = async () => {
  try {
    console.log('Store:', store.state.user);
    const user = store.state.user;
    const requestBody = JSON.stringify({
      role: user.role,
      username: user.username,
      newemail: newemail.value,
      oldpassword: oldpassword.value,
      newpassword: newpassword.value,
      accessToken: user.accessToken,
    });

    const datatopost = {
      body: requestBody
    };

    const send = JSON.stringify(datatopost);
    console.log('Send:', send);
    const response = await axios.post('https://izp0ry34ik.execute-api.us-east-1.amazonaws.com/dev', 
    send, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.data.statusCode === 200) {
      success.value = "User updated successfully!";
    } else {
      const data = JSON.parse(response.data.body);
      error.value = data.message || 'Something went wrong!';
      console.error('Error:', error.value);
      console.error('Response:', data);
    }


  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Something went wrong!';
    console.error('Error:', error.value);
  }
};


onMounted(() => {
  fetchAlbums();
  fetchArtistsAndGenres();
  fetchTracks();
  fetchFavouritePlaylists();
});
</script>

<template>
  <div>
    <h1>Albums , Artists , Songs , playlists</h1>


    <div v-if="error">
      <p>{{ error }}</p>
    </div>


    <div>
      <input v-model="searchQuery" placeholder="Search..." @input="applySearch" />

    <!--<div>
        <label for="genreSelect">Select Genre: </label>
        <select v-model="selectedGenre" id="genreSelect" @change="applyGenreFilter">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre.genreId" :value="genre.genreId">
            {{ genre.genreName }}
          </option>
        </select>
      </div>

      <div>
        <label for="artistSelect">Select Artist: </label>
        <select v-model="selectedArtist" id="artistSelect" @change="applyArtistFilter">
          <option value="">All Artists</option>
          <option v-for="artist in artists" :key="artist.artist_id" :value="artist.artist_id">
            {{ artist.artist_name }}
          </option>
        </select>
      </div>

      <ul>
        <li v-for="album in filteredAlbums" :key="album.id">
          {{ album.albumTitle }} by {{ album.albumArtist }}
          <button @click="() => $router.push({ name: 'album', params: { id: album.id } })">Explore Album</button>
        </li>
      </ul>
     

      <div>
      <ul>
        <li v-for="track in filteredTracks" :key="track.trackId">
          {{ track.trackTitle }} by {{ track.trackArtist }}
          <button @click="() => $router.push({ name: 'track', params: { id: track.trackId } })">Explore Track</button>
        </li>
      </ul>
      </div>


            <div>
      <ul>
        <li v-for="artist in filteredArtists" :key="artist.artist_id">
          {{ artist.artist_name }}
          <button @click="() => $router.push({ name: 'artist', params: { id: artist.artist_id } })">Explore artist</button>
        </li>
      </ul>
      </div>

            <div>
      <ul>
        <li v-for="playlist in filteredPlaylists" :key="playlist.playlistId">
          {{ playlist.playlistName }}
          <button @click="() => $router.push({ name: 'playlist', params: { id: playlist.playlistId } })">Explore playlist</button>
        </li>
      </ul>
      </div>-->




    </div>


    <div class="update-user">
    <h1>Update User Details</h1>

    <div class="update-form">
      <h2>Update Email or Password</h2>

      <!-- Input fields for email update -->
      <div class="inputBox">
        <input type="email" v-model="newemail" placeholder="New Email (Optional)" />
        <i>Email</i>
      </div>

      <!-- Input fields for password update -->
      <div class="inputBox">
        <input type="password" v-model="oldpassword" placeholder="Old Password (Optional)" />
        <i>Old Password</i>
      </div>

      <div class="inputBox">
        <input type="password" v-model="newpassword" placeholder="New Password (Optional)" />
        <i>New Password</i>
      </div>

  


      <!-- Submit button -->
      <div class="inputBox">
        <input type="submit" value="Update" @click="editUser" />
      </div>
    </div>
  </div>
  </div>
</template>

<style>
.error {
  color: red;
}

.success {
  color: green;
}


.email-form {
  margin-top: 10px;
}
</style>
