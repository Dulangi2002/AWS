<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const store = useStore();

const artists = ref([]);
const error = ref(null);
const success = ref(null);
const artistId = ref(null); 
const newArtistName = ref('');
const newGenre = ref('');
const newBandComposition = ref('');
const artistName = ref("");
const genre = ref("");
const bandComposition = ref("");

// Fetch artists from the API
const fetchArtists = async () => {
  try {
    const response = await axios.get(
      "https://1mzr2y36vb.execute-api.us-east-1.amazonaws.com/dev"
    );

    const parsedData = JSON.parse(response.data.body);
    artists.value = parsedData.artists || []; // Use 'artists' instead of 'users'
    
    success.value = "Artists fetched successfully!";
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Something went wrong!";
    console.error("Error:", error.value);
  }
};

const editArtist = async () => {
  const idToken = store.state.user.idToken;
  console.log("idToken:", idToken);
  const apiUrl = `https://1mzr2y36vb.execute-api.us-east-1.amazonaws.com/dev/artist/update?id=${artistId.value}`;

  // Prepare the data object only with non-null values
  const data = {
    artist_name: newArtistName.value || null,
    genre: newGenre.value || null,
    band_composition: newBandComposition.value || null,
  };

      console.log("Data:", data);

      // Remove keys with null values
      Object.keys(data).forEach(
        (key) => data[key] === null && delete data[key]
      );

      const datatosend = {
        body: data,
      };

      const send = JSON.stringify(datatosend);
      const requestBody = JSON.stringify(send);

      console.log("Request Body:", requestBody);


  try {
    const response = await axios.put(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + idToken
      },
    });
    console.log("Success:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};



const createArtist = async () => {
  const idToken = store.state.user.idToken;
  console.log("idToken:", idToken);
  const apiUrl = "https://1mzr2y36vb.execute-api.us-east-1.amazonaws.com/dev/artist/create";

  const data = JSON.stringify({
    artist_name: artistName.value,
    genre: genre.value,
    band_composition: bandComposition.value,
  });

  const datatopost = {
  body: data,
};

const send = JSON.stringify(datatopost);    


console.log("Data:", data);
console.log("send:", send);

  try {
    const response = await axios.post(apiUrl, send, {
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + idToken
      },
    });
    console.log("Response:", response.data);


    // Clear the form
    //artistName.value = "";
    ///genre.value = "";
    //bandComposition.value = "";
  } catch (error) {
    error.value =
      error.response?.data?.message || "Error creating artist.";
    success.value = null;
  }
};

const deleteArtist = async (artist_id) => {
      console.log("this is the artist id", artist_id);
      const id = artist_id;
      const idToken = store.state.user.idToken;
      console.log("idToken:", idToken);

      const apiUrl = `https://1mzr2y36vb.execute-api.us-east-1.amazonaws.com/dev/artist/delete?id=${id}`;
      try {
        const response = await axios.delete(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + idToken
          },
        });
        console.log("Success:", response.data);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };





// Call fetchArtists on component mount
onMounted(fetchArtists);
</script>

<template>
  <div>
  <!-- <ul>
      <li v-for="artist in artists" :key="artist.artist_id">
        {{ artist.artist_name }} - {{ artist.genre }} - {{ artist.band_composition }}
        <button @click="artistId = artist.artist_id">Edit</button>
        <button @click="deleteArtist(artist.artist_id)">Delete</button>
      </li>
    </ul>-->

    <ul class="space-y-4">
  <li v-for="artist in artists" :key="artist.artist_id" class="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
    <div>
      <span class="font-semibold text-gray-700">{{ artist.artist_name }}</span>
      <span class="text-gray-500"> - {{ artist.genre }} - </span>
      <span class="text-gray-500">{{ artist.band_composition }}</span>
    </div>
    <div class="space-x-2">
      <button 
        @click="artistId = artist.artist_id" 
        class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Edit
      </button>
      <button 
        @click="deleteArtist(artist.artist_id)" 
        class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
      >
        Delete
      </button>
    </div>
  </li>
</ul>

    <p v-if="error">{{ error }}</p>

    <div class="update-artist" v-if="artistId">
      <h2>Update Artist</h2>
      <form @submit.prevent="editArtist">
        <div>
          <label for="artist_id">Artist ID:</label>
          <input v-model="artistId" type="text" disabled />
        </div>
        <div>
          <label for="artist_name">Name:</label>
          <input v-model="newArtistName" type="text" />
        </div>
        <div>
          <label for="genre">Genre:</label>
          <input v-model="newGenre" type="text" />
        </div>
        <div>
          <label for="band_composition">Band Composition:</label>
          <input v-model="newBandComposition" type="text" />
        </div>
        <button type="submit">Update Artist</button>
      </form>
      <p v-if="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>



<div class="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
  <h1 class="text-2xl font-bold mb-6 text-gray-700">Create New Artist</h1>
  <form @submit.prevent="createArtist">
    <div class="mb-4">
      <label for="artist_name" class="block text-gray-600 font-medium mb-2">Artist Name:</label>
      <input 
        v-model="artistName" 
        type="text" 
        required 
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div class="mb-4">
      <label for="genre" class="block text-gray-600 font-medium mb-2">Genre:</label>
      <input 
        v-model="genre" 
        type="text" 
        required 
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div class="mb-6">
      <label for="band_composition" class="block text-gray-600 font-medium mb-2">Band Composition:</label>
      <input 
        v-model="bandComposition" 
        type="text" 
        required 
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <button 
      type="submit" 
      class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
    >
      Create Artist
    </button>
  </form>

  <p v-if="successMessage" class="text-green-600 font-medium mt-4">{{ successMessage }}</p>
  <p v-if="errorMessage" class="text-red-600 font-medium mt-4">{{ errorMessage }}</p>
</div>



  </div>
</template>
