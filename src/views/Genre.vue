<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";

// Vuex store to get user token
const store = useStore();

// Refs for genres, error, and success messages
const genres = ref([]);
const error = ref(null);
const success = ref(null);
const genreName = ref("");
const genreid = ref(null);
const newGenreName = ref("");


// Fetch genres from the API
const fetchGenres = async () => {
  try {
    const response = await axios.get(
      "https://c29n321o87.execute-api.us-east-1.amazonaws.com/dev/genres"
    );

    const parsedData = JSON.parse(response.data.body);
    genres.value = parsedData.genres || [];
    console.log("Genres:", genres);

    success.value = "Genres fetched successfully!";
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Something went wrong!";
    console.error("Error:", error.value);
  }
};

// Create a new genre by sending a POST request
const createGenre = async () => {
  if (!genreName.value.trim()) {
    error.value = "Genre name cannot be empty!";
    return;
  }

  const idToken = store.state.user.idToken;
  console.log("idToken:", idToken);

  const apiUrl = "https://c29n321o87.execute-api.us-east-1.amazonaws.com/dev/genre/create";
  
  const data = JSON.stringify({
    genreName: genreName.value,
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
        "Authorization": "Bearer " + idToken,
      },
    });
    
    console.log("Response:", response.data);
    
    // Show success message and clear the form
    success.value = "Genre created successfully!";
    genreName.value = ""; // Clear the input

    // Fetch genres again to update the list
    fetchGenres();
  } catch (err) {
    error.value = err.response?.data?.message || "Error creating genre.";
    success.value = null;
  }
};


const deleteGenre = async (genreId) => {
      console.log("this is the genre id", genreId);
      const id = genreId;
      const idToken = store.state.user.idToken;
      console.log("idToken:", idToken);

      const apiUrl = `https://c29n321o87.execute-api.us-east-1.amazonaws.com/dev/genre/delete?id=${id}`;
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





const editGenre = async ( ) => {
  const idToken = store.state.user.idToken;
  console.log("idToken:", idToken);
  console.log("Genre ID:", genreid.value);
  const apiUrl = `https://c29n321o87.execute-api.us-east-1.amazonaws.com/dev/genre/update?id=${genreid.value}`;
  console.log("API URL:", apiUrl);
  // Prepare the data object only with non-null values
  const data = {
    genreName: newGenreName.value || null,
  };
      console.log("Data:", data);
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


// Fetch genres on component mount
onMounted(() => {
  fetchGenres();
});
</script>

<template>
  <div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <!--<ul>
      <li v-for="genre in genres" :key="genre.genreId">
        {{ genre.genreName }}
        <button @click="genreid = genre.genreId">Edit</button>
        <button @click="deleteGenre(genre.genreId)">Delete</button>

      </li>
    </ul>-->

<ul class="space-y-4">
  <li v-for="genre in genres" :key="genre.genreId" class="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
    <span class="text-gray-700 font-semibold">{{ genre.genreName }}</span>
    <div class="space-x-2">
      <button 
        @click="genreid = genre.genreId" 
        class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Edit
      </button>
      <button 
        @click="deleteGenre(genre.genreId)" 
        class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
      >
        Delete
      </button>
    </div>
  </li>
</ul>


<form @submit.prevent="createGenre" class="max-w-sm mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
  <div class="mb-4">
    <label for="genreName" class="block text-gray-600 font-medium mb-2">Genre Name:</label>
    <input
      type="text"
      id="genreName"
      v-model="genreName"
      placeholder="Enter genre name"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>
  <button 
    type="submit"
    class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
  >
    Create Genre
  </button>
</form>



     <div class="update-genre" v-if="genreid">
      <h2>Update genre</h2>
      <form @submit.prevent="editGenre">
        <div>
          <label for="genreId">Genre ID:</label>
          <input v-model="genreid" type="text" disabled />
        </div>
        <div>
          <label for="genreName">Name:</label>
          <input v-model="newGenreName" type="text" />
        </div>

        <button type="submit">Update genre</button>
      </form>
      <p v-if="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style>
/* Add some basic styles for error and success messages */
.error {
  color: red;
}

.success {
  color: green;
}
</style>
