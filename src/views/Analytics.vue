<template>
  <div>
    <h1>Analytics</h1>
    
    <!-- Display an error message if there's an error -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Display albums, top-streamed tracks, and top-streamed albums if fetched successfully -->
    <div v-if="analytics">
      <h2>Albums</h2>
      <ul>
        <li v-for="album in analytics.albums" :key="album.albumId">
          Album ID: {{ album.albumId }}, Stream Count: {{ album.stream_count }}
        </li>
      </ul>

      <h2>Top Streamed Tracks</h2>
      <ul>
        <li v-for="track in analytics.topStreamedTracks" :key="track.trackId">
          Track ID: {{ track.trackId }}, Stream Count: {{ track.stream_count }}
        </li>
      </ul>

      <h2>Top Streamed Albums</h2>
      <ul>
        <li v-for="album in analytics.topStreamAlbums" :key="album.albumId">
          Album ID: {{ album.albumId }}, Stream Count: {{ album.stream_count }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const analytics = ref(null);  // Store the fetched analytics data
const error = ref(null);      // Store any error messages

const store = useStore();
const router = useRouter();

const fetchAnalytics = async () => {
  console.log(store.state.user.idToken)
  const idToken = store.state.user.idToken;
  try {
    const response = await fetch(
      "https://hc7qahqh3a.execute-api.us-east-1.amazonaws.com/dev",
      {
        method: "GET",
        headers: {
          "Authorization" : "Bearer " + idToken,
        },
      }
    );
    if (!response.ok) {
      error.value = "Failed to fetch analytics data";
      console.error("Error:", error.value);
      return;
    }
    const data = await response.json();  // Get the response body
    console.log("Analytics data:", data);
  } catch (err) {
    error.value = err.message ;
    console.error("Error:", error.value);
  }
};

onMounted(() => {
  fetchAnalytics();
});
</script>

<style>
.error {
  color: red;
}
</style>
