<script setup>
import { ref, onMounted, reactive } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import { useStore } from "vuex";

const store = useStore();


const form = reactive({
  albumTitle: 'check',
  albumArtist: 'The Beatles',
  albumGenre: 'Pop',
  albumYear: '2023',
  file :null
});

const albums = ref([]);
const artists = ref([]);
const genres = ref([]);
const searchQuery = ref('');
const selectedGenre = ref('');
const selectedArtist = ref('');
const filteredAlbums = ref([]);
const error = ref(null);
const success = ref(null);


const uploadFileToS3 = async (file, uploadUrl) => {
      console.log(file , uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
};





const fetchAlbums = async () => {
  try {
    const response = await fetch('https://2cxjj1j302.execute-api.us-east-1.amazonaws.com/dev');
    if (!response.ok) throw new Error('Something went wrong!');
    const data = await response.json();
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
    console.log('Artists:', artists.value);
    console.log('Genres:', genres.value);
  } catch (err) {
    error.value = err.message || 'Something went wrong!';
    console.error('Error:', error.value);
  }
};

const createAlbum = async () => {
  
  try {
     if (!form.file) {
          throw new Error("No file selected");
        }
    console.log(form.file.name);
    const requestBody = JSON.stringify({
      albumTitle: form.albumTitle,
      albumArtist: form.albumArtist,
      albumGenre: form.albumGenre,
      albumYear: form.albumYear,
      fileName : form.file.name ,
      fileType : form.file.type
    });


    const datatopost  = {
          body:requestBody
    };

    const idToken  = store.state.user.idToken;
    console.log('idToken:', idToken);
    
    const response = await fetch('https://h6tr0cw381.execute-api.us-east-1.amazonaws.com/dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + idToken 
      },
      body: JSON.stringify(datatopost)
    });

    if (!response.ok) throw new Error('Something went wrong!');
    const responseData = await response.json();
    console.log(responseData)
    const parsedData = JSON.parse(responseData.body);
    const uploadUrl = parsedData.uploadUrl;
    await uploadFileToS3(form.file, uploadUrl);
    console.log('downloadUrl:', parsedData.downloadUrl);


    error.value = null;
    
    // Reset form fields
    Object.assign(form, {
      albumTitle: '',
      albumArtist: '',
      albumGenre: '',
      albumYear: '',
      file: null
    });
    
    await fetchAlbums(); // Refresh the album list
  } catch (err) {
    error.value = err.message || 'Something went wrong!';
    success.value = null;
    console.error('Error:', error.value);
  }
};

 const handleFileUpload = (event) => {
      console.log("File uploaded");
      const file = event.target.files[0]; // Get the selected file
      if (file) {
        form.file = file;
        console.log("Selected file:", file);
  
      } else {
        console.error("No file selected");
      }
    };

const applySearch = () => {
  filterAlbums();
};

const applyGenreFilter = () => {
  filterAlbums();
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


onMounted(() => {
  fetchAlbums();
  fetchArtistsAndGenres();

});
</script>

<template>
  <div>
<div class="bg-black text-white p-6 max-w-lg mx-auto rounded-lg shadow-lg mt-20">
  <h1 class="text-3xl font-bold mb-6 text-center">Add an Album</h1>
  <form @submit.prevent="createAlbum" class="space-y-4">
    <div>
      <label for="albumTitle" class="block font-medium mb-2">Album Title:</label>
      <input
        v-model="form.albumTitle"
        id="albumTitle"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label for="albumArtist" class="block font-medium mb-2">Artist Name:</label>
      <input
        v-model="form.albumArtist"
        id="albumArtist"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label for="albumGenre" class="block font-medium mb-2">Genre:</label>
      <input
        v-model="form.albumGenre"
        id="albumGenre"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label for="albumYear" class="block font-medium mb-2">Year:</label>
      <input
        v-model="form.albumYear"
        id="albumYear"
        type="number"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label for="file" class="block font-medium mb-2">Album Art File:</label>
      <input
        v-on:change="handleFileUpload"
        id="file"
        type="file"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <button
      type="submit"
      class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
    >
      Add Album
    </button>

    <div v-if="error" class="mt-4 text-red-500 font-medium">{{ error }}</div>
    <div v-if="success" class="mt-4 text-green-500 font-medium">{{ success }}</div>
  </form>
</div>


    <div v-if="error">
      <p>{{ error }}</p>
    </div>


    <div class="bg-red-200 ">
 <!-- Search Input 
  <input
    v-model="searchQuery"
    placeholder="Search..."
    @input="applySearch"
    class="w-full px-4 py-2 rounded-lg border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-10"
  />
      <div>
        <label for="genreSelect">Select Genre: </label>
        <select v-model="selectedGenre" id="genreSelect" @change="applyGenreFilter">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre.genreId" :value="genre.genreName">
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
          {{ album.albumTitle }} by {{ album.albumArtist }} , Genre: {{ album.albumGenre }}, Year: {{ album.albumYear }}
          <button @click="() => $router.push({ name: 'album', params: { id: album.id } })">Explore Album</button>
          <button @click="editAlbum(album.id)">Delete Album</button> 
          <button @click="deleteAlbum(album.id)">Delete Album</button>  
        </li>
      </ul>
-->

<div class="bg-red-200 p-6 rounded-lg shadow-lg max-w-2xl mx-auto space-y-4">
  <!-- Search Input -->
  <input
    v-model="searchQuery"
    placeholder="Search..."
    @input="applySearch"
    class="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />

  <!-- Genre Filter -->
  <div class="flex items-center space-x-3">
    <label for="genreSelect" class="font-semibold text-gray-700">Select Genre: </label>
    <select
      v-model="selectedGenre"
      id="genreSelect"
      @change="applyGenreFilter"
      class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">All Genres</option>
      <option v-for="genre in genres" :key="genre.genreId" :value="genre.genreName">
        {{ genre.genreName }}
      </option>
    </select>
  </div>

  <!-- Artist Filter -->
  <div class="flex items-center space-x-3">
    <label for="artistSelect" class="font-semibold text-gray-700">Select Artist: </label>
    <select
      v-model="selectedArtist"
      id="artistSelect"
      @change="applyArtistFilter"
      class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">All Artists</option>
      <option v-for="artist in artists" :key="artist.artist_id" :value="artist.artist_name">
        {{ artist.artist_name }}
      </option>
    </select>
  </div>

  <!-- Album List -->
  <ul class="space-y-3">
    <li
      v-for="album in filteredAlbums"
      :key="album.id"
      class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
    >
      <span class="text-gray-800">
        {{ album.albumTitle }} by {{ album.albumArtist }} , Genre: {{ album.albumGenre }}, Year: {{ album.albumYear }}
      </span>
      <div class="space-x-2">
        <button
          @click="() => $router.push({ name: 'album', params: { id: album.id } })"
          class="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Explore Album
        </button>
        <button
          @click="editAlbum(album.id)"
          class="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
        >
          Edit Album
        </button>
        <button
          @click="deleteAlbum(album.id)"
          class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Delete Album
        </button>
      </div>
    </li>
  </ul>
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
</style>
