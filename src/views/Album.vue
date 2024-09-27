<template>
  <div class="album">

    <h1>{{ title }}</h1>
    <h2>Artist: {{ albumartist }}</h2>
    <h2>Genre: {{ albumgenre }}</h2>
    <h2>Release Date: {{ albumreleasedate }}</h2>



  
    <ul v-if="albumTracks.length">
      <li v-for="track in albumTracks" :key="track.trackId">
        <strong>{{ track.trackTitle }}</strong> by {{ track.artistId }}
        <h1>{{ track.trackDuration }}</h1>
        <audio :id="'audio_' + track.trackId" :src="track.songUrl" controls>
          Your browser does not support the audio element.
        </audio>
        <button @click="stopAudio(track.trackId)">Stop</button>
        <button @click="deleteSoundFile(track.trackId)">Delete Track File</button>
        <button @click="addTrackToFavourites(track.trackId)">Add Track to Favourites</button>


        <button @click="addTrackToPlaylist(selectedPlaylistId, track.trackId)">
          Add to Playlist
        </button>

        <div class="track-file">
          <input
            id="file"
            type="file"
            v-on:change="handleFileUpdate"
            required
          />
          <button @click="updateTrackFile(track.trackId)">Edit Track</button>
        </div>

        <label for="playlist">Select Playlist:</label>
        <select v-model="selectedPlaylistId" id="playlist">
          <option value="">Select Playlist</option>
          <option
            v-for="playlist in playlists"
            :key="playlist.playlistId"
            :value="playlist.playlistId"
          >
            {{ playlist.playlistName }}
          </option>
        </select>
        <button @click="openEditForm(track.trackId)">Edit Song</button>  
        <button @click="deleteTrack(track.trackId)">Delete Track</button>
        
      </li>

      
    </ul>

    <div>
      <form @submit.prevent="createTrack">
        <div>
          <label for="trackTitle">Track Title:</label>
          <input
            v-model="form.trackTitle"
            id="trackTitle"
            type="text"
            required
          />
        </div>

        <div>
          <label for="trackDuration">Track Duration:</label>
          <input
            v-model="form.trackDuration"
            id="trackDuration"
            type="text"
            required
          />
        </div>

        <div>
          <label for="artistId">Artist ID:</label>
          <input v-model="form.artistId" id="artistId" type="text" required />
        </div>

        <div>
          <label for="albumId">Album ID:</label>
          <input v-model="form.albumId" id="albumId" type="number"   />
        </div>

        <div>
          <label for="trackGenre">Track Genre:</label>
          <input
            v-model="form.trackGenre"
            id="trackGenre"
            type="text"
            required
          />
        </div>

        <div>
          <label for="trackReleaseDate">Track Release Date:</label>
          <input
            v-model="form.trackReleaseDate"
            id="trackReleaseDate"
            type="date"
            required
          />
        </div>

        <div>
          <label for="file">Track URL:</label>
          <input
            v-on:change="handleFileUpload"
            id="file"
            type="file"
            required
          />
        </div>

        <button type="submit">Add Track</button>

        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>
      </form>
    </div>

    <div class="update-album">
      <div>
        <h2>Update Album </h2>
        <form @submit.prevent="editAlbum">
          <div>
            <label for="albumId">Album ID:</label>
            <input v-model="albumId" type="text" />
          </div>
          <div>
            <label for="albumTitle">Title:</label>
            <input v-model="newAlbumTitle" type="text" />
          </div>
          <div>
            <label for="albumArtist">Artist:</label>
            <input v-model="newAlbumArtist" type="text" />
          </div>
          <div>
            <label for="albumGenre">Genre:</label>
            <input v-model="newAlbumGenre" type="text" />
          </div>
          <div>
            <label for="albumYear">Year:</label>
            <input v-model="newAlbumYear" type="text" />
          </div>
          <button type="submit">Update Album</button>
        </form>
        <p v-if="message">{{ message }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <div class="album-cover">
        <img :src="albumcover" alt="Album Cover" />
        <input id="file" type="file" v-on:change="handleFileUpdate" required />
        <button @click="uploadAlbumArt">Edit Album Art</button>
      </div>

      <div v-if="message" class="message">{{ message }}</div>
    </div>

    <button @click="deleteAlbum">Delete Album</button>
    <button @click="deleteImage">Delete Image</button>

    <div class="update-track"  >
      <div>
        <h2>Update track  {{ currentTrackId }} </h2>
        <form @submit.prevent="editTrack">
       
          <div>
            <label for="trackTitle">Title:</label>
            <input v-model="editFormData.newTrackTitle" type="text" />
          </div>
          <div>
            <label for="trackArtist">Artist:</label>
            <input v-model="editFormData.newTrackArtist" type="text" />
          </div>
          <div>
            <label for="trackGenre">Genre:</label>
            <input v-model="editFormData.newTrackGenre" type="text" />
          </div>
          <div>
            <label for="trackReleaseDate">Year:</label>
            <input v-model="editFormData.newTrackReleaseDate" type="text" />
          </div>
          <button type="submit">Update track</button>
          <button @click="closeEditForm">Close</button>
        </form>
        <p v-if="message">{{ message }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
 

  
    
   <div>
      <h1>Add Album to Favourites</h1>
      <button @click="addAlbumToFavourites">Add Album to Favourites</button>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from "vue";
import axios from "axios";
import { useStore } from "vuex";

const store = useStore();

export default {
  props: ["id"],

  setup(props) {
    const albumcover = ref("");
    const albumartist = ref("");
    const albumreleasedate = ref("");
    const albumgenre = ref("");
    const albumtitle = ref("");
    const albumTitle = ref("");
    const albumTracks = ref([]);
    const playlists = ref([]);
    const selectedPlaylistId = ref(null);
    const store = useStore();
    const parameterNewValue = ref("");
    const message = ref("");
    const selectedFile = ref(null);
    const newAlbumTitle = ref("");
    const newAlbumArtist = ref("");
    const newAlbumGenre = ref("");
    const newAlbumYear = ref("");
    const errorMessage = ref("");
    const newTrackTitle = ref("");
    const newTrackArtist = ref("");
    const newTrackGenre = ref("");
    const newTrackReleaseDate = ref("");
    const newTrackDuration = ref("");
    const trackId = ref("");   
    const showEditForm = ref(false);
    const currentTrackId = ref("");
    const editFormData = ref({
      newTrackTitle: "",
      newTrackArtist: "",
      newTrackGenre: "",
      newTrackReleaseDate: "",
      
    }); 

 
    const form = ref({
      trackTitle: "",
      trackDuration: "",
      artistId: "",
      albumId: props.id,
      trackGenre: "",
      trackReleaseDate: "",
      file: null,
    });

    const success = ref(null);
    const error = ref(null);
    let trackStartTime = ref({});
    const trackDuration = ref({});

    
    const addAlbumToFavourites = async () => {
      console.log("this is the album id", props.id);
      console.log("this is the user ", store);
      console.log("this is the user username", store.state.user.username);
      const id = props.id;
      const username = store.state.user.username;
      const apiUrl = `https://0dudt7wqcb.execute-api.us-east-1.amazonaws.com/dev/favourites/album?id=${id}`;
      console.log("API URL:", apiUrl);
      const data = {
        username: username,
      };
      const datatosend = {
        body: data,
      };

        const send = JSON.stringify(datatosend);
        const requestBody = JSON.stringify(send);
        console.log(requestBody);

      try {
        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: data }),
        });
        console.log("Success:", response.data);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };



    const addTrackToFavourites = async (trackId) => {
      console.log("this is the track id",trackId);
      console.log("this is the user ", store);
      console.log("this is the user username", store.state.user.username);
      const id = trackId;
      const username = store.state.user.username;
      const apiUrl = `https://0dudt7wqcb.execute-api.us-east-1.amazonaws.com/dev/favourites/track?id=${id}`;
      console.log("API URL:", apiUrl);
      const data = {
        username: username,
      };
      const datatosend = {
        body: data,
      };

        const send = JSON.stringify(datatosend);
        const requestBody = JSON.stringify(send);
        console.log(requestBody);

      try {
        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: data }),
        });
        console.log("Success:", response.data);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

   

    const openEditForm = (trackId) => {
      showEditForm.value = true;
      currentTrackId.value = trackId;
      console.log("this is the track id", trackId);
    };

    const closeEditForm = () => {
      showEditForm.value = false;
    };

    const editTrack = async () => {
      console.log("edit form data ", editFormData.value);
      const id = currentTrackId.value;
      console.log("this is the track id", id);
      const idToken = store.state.user.idToken;
      console.log("this is the id token "  , idToken);
      console.log(idToken);


      const apiUrl = `https://1glsl66zdb.execute-api.us-east-1.amazonaws.com/dev/track/update?id=${id}`;
      console.log("API URL:", apiUrl);
      // Prepare the data object only with non-null values
      const data = {
        trackTitle: editFormData.value.newTrackTitle || null,
        trackDuration: editFormData.value.newTrackDuration || null,
        artistName: editFormData.value.newTrackArtist|| null,
        trackGenre: editFormData.value.newTrackGenre || null,
        trackReleaseDate: editFormData.value.newTrackReleaseDate || null,
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

    const handleFileUpdate = (event) => {
      selectedFile.value = event.target.files[0];
      console.log(selectedFile.value);
    };

    const updateTrackFile = async (trackId) => {
      console.log("this is the track id", trackId);
      const id = trackId;
      console.log("this", selectedFile.value);
      const idToken = store.state.user.idToken;
      console.log("ID TOKEN", idToken);
      if (!selectedFile.value) {
        message.value = "No file selected";
        return;
      }

      const requestBody = {
        fileName: selectedFile.value.name,
        fileType: selectedFile.value.type,
      };

      const datatosend = {
        body: requestBody,
      };
      console.log(datatosend);

      const send = JSON.stringify(datatosend);
      console.log(send);

      const api = `https://equxxpg0t3.execute-api.us-east-1.amazonaws.com/dev/track?id=${id}`;
      console.log(api);

      const response = await fetch(api, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(send),
      });
      const responseData = await response.json();
      console.log(responseData);

      const parsedData = JSON.parse(responseData.body);
      console.log(parsedData);
      const uploadUrl = parsedData.uploadUrl;
      console.log(uploadUrl);
      uploadFileToS3(selectedFile.value, uploadUrl);
    };

    const uploadAlbumArt = async () => {
      console.log("this is the album id", props.id);
      const id = props.id;
      const idToken = store.state.user.idToken;
      console.log("ID TOKEN", idToken);
      if (!selectedFile.value) {
        message.value = "No file selected";
        return;
      }

      const requestBody = {
        fileName: selectedFile.value.name,
        fileType: selectedFile.value.type,
      };

      const datatosend = {
        body: requestBody,
      };
      console.log(datatosend);

      const send = JSON.stringify(datatosend);
      console.log(send);

      const api = `https://fhttiwn6f4.execute-api.us-east-1.amazonaws.com/dev/album?id=${id}`;
      console.log(api);

      const response = await fetch(api, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(send),
      });
      const responseData = await response.json();
      console.log(responseData);

      const parsedData = JSON.parse(responseData.body);
      console.log(parsedData);
      const uploadUrl = parsedData.uploadUrl;
      console.log(uploadUrl);
      uploadFileToS3(selectedFile.value, uploadUrl);
    };

    const handleFileUpload = (event) => {
      console.log("File uploaded");
      const file = event.target.files[0]; // Get the selected file
      if (file) {
        form.value.file = file;
        console.log("Selected file:", file);
      } else {
        console.error("No file selected");
      }
    };

    const deleteAlbum = async () => {
      console.log("this is the album id", props.id);
      const idToken = store.state.user.idToken;
      console.log(idToken);
      const id = props.id;
      const apiUrl = `https://235ar03zvg.execute-api.us-east-1.amazonaws.com/dev/album/delete?id=${id}`;
      try {
        const response = await axios.delete(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            'Authorization' : 'Bearer ' + idToken 

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


    const deleteTrack = async (trackId) => {
      console.log("this is the track id", trackId );
      const idToken = store.state.user.idToken;
      console.log("this is the id token "  , idToken);
      
      const apiUrl = `https://1glsl66zdb.execute-api.us-east-1.amazonaws.com/dev/track/delete?id=${trackId}`;
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


    const deleteSoundFile = async (trackId) => {
      console.log("this is the track id", trackId);
      const id =trackId;
      const apiUrl = `https://mgpcpwa7sb.execute-api.us-east-1.amazonaws.com/dev/track?id=${id}`;
      try {
        const response = await axios.delete(apiUrl, {
          headers: {
            "Content-Type": "application/json",
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

    





    const deleteImage = async () => {
      console.log("this is the album id", props.id);
      const id = props.id;
      const apiUrl = `https://mgpcpwa7sb.execute-api.us-east-1.amazonaws.com/dev/object?id=${id}`;
      try {
        const response = await axios.delete(apiUrl, {
          headers: {
            "Content-Type": "application/json",
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

    const editAlbum = async () => {
      console.log("this is the album id", props.id);
      const id = props.id;
      const apiUrl = `https://235ar03zvg.execute-api.us-east-1.amazonaws.com/dev/album/update?id=${id}`;

      // Prepare the data object only with non-null values
      const data = {
        albumTitle: newAlbumTitle.value || null,
        albumArtist: newAlbumArtist.value || null,
        albumGenre: newAlbumGenre.value || null,
        albumYear: newAlbumYear.value || null,
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
      const idToken = store.state.user.idToken;
      console.log(idToken);

      try {
        const response = await axios.put(apiUrl, requestBody, {
          headers: {
            "Content-Type": "application/json",
            "Authorization" : 'Bearer ' + idToken
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

    const addTrackToPlaylist = async (playlistId, trackId) => {
      if (!playlistId) {
        error.value = "Please select a playlist.";
        return;
      }

      console.log(playlistId, trackId);
      const data = {
        playlistId: playlistId,
        trackId: trackId,
      };

      const datatToSend = {
        body: JSON.stringify(data),
      };

      const send = JSON.stringify(datatToSend);

      try {
        const response = await axios.post(
          "https://dsl9v3qiml.execute-api.us-east-1.amazonaws.com/dev",
          send,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.statusCode === 200) {
          success.value = "Track added to playlist successfully!";
        } else {
          const responseBody = JSON.parse(response.data.body);
          error.value = responseBody.message || "Something went wrong!";
          console.error("Error:", error.value);
        }
      } catch (err) {
        error.value = "Network error: " + err.message;
        console.error("Network error:", err);
      }
    };

    const uploadFileToS3 = async (file, uploadUrl) => {
      console.log(file, uploadUrl);

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

    const createTrack = async () => {
      console.log(form.value);
      const idToken = store.state.user.idToken;
      console.log("this is the id token "  , idToken);
        try {
        if (!form.value.file) {
          throw new Error("No file selected");
        }

        const data = JSON.stringify({
          trackTitle: form.value.trackTitle ?? null,
          trackDuration: form.value.trackDuration ?? null,
          artistId: form.value.artistId ?? null,
          albumId: props.id ?? null,
          trackGenre: form.value.trackGenre ?? null,
          trackReleaseDate: form.value.trackReleaseDate ?? null,
          fileName: form.value.file.name ?? null,
          fileType: form.value.file.type ?? null,
        });

        const response = await fetch(
          "https://1glsl66zdb.execute-api.us-east-1.amazonaws.com/dev/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization" : "Bearer " + idToken
            },
            body: JSON.stringify({ body: data }),
          }
        );

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const responseData = await response.json();
        const parsedData = JSON.parse(responseData.body);
        const uploadUrl = parsedData.uploadUrl;

        await uploadFileToS3(form.value.file, uploadUrl);

        error.value = null;

        fetchAlbum(props.id); // Refresh the album details
      } catch (err) {
        error.value = err.message || "Something went wrong!";
        success.value = null;
        console.error("Error:", error.value);
      }
    };

    const fetchPlayLists = async () => {
      try {
        const user = store.state.user.username;
        const response = await axios.get(
          `https://px8t3ew7eb.execute-api.us-east-1.amazonaws.com/dev/?username=${user}`
        );
        console.log(response.data);
        const data = response.data;
        const parsedData = JSON.parse(data.body);
        console.log(parsedData);
        playlists.value = parsedData.playlists || [];
        console.log("playlists ", playlists.value);
        console.log("fist playlist ", playlists.value[0]);
      } catch (err) {
        error.value = err.message || "Something went wrong!";
        console.error("Error:", error.value);
      }
    };

    const fetchAlbum = async (id) => {
      try {
        const response = await fetch(
          `https://235ar03zvg.execute-api.us-east-1.amazonaws.com/dev/album/${id}`
        );
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        console.log(parsedData);

        const album = {
          artistid: parsedData.album.albumArtist,
          artistname : parsedData.album.artist_name,
          genreid: parsedData.album.albumGenre,
          genrename : parsedData.album.genreName,
          cover: parsedData.album.albumArt,
          releasedate: parsedData.album.albumYear,
          tracks: parsedData.tracks,
          coverArt: parsedData.album.albumArtUrl,
          title: parsedData.album.albumTitle,
        };
        console.log(album);

        albumartist.value = album.artistname;
        albumgenre.value = album.genrename;
        albumcover.value = album.cover;
        albumreleasedate.value = album.releasedate;
        albumtitle.value = album.title;
        albumTracks.value = album.tracks || [];
        albumcover.value = album.coverArt;
        
        console.log(albumcover.value);
        console.log(albumTracks.value);

      } catch (err) {
        error.value = err.message || "Something went wrong!";
        console.error("Error:", error.value);
      }
    };

    const stopAudio = (trackId) => {
      const audioElement = document.getElementById(`audio_${trackId}`);
      if (audioElement) {
        audioElement.pause(); // Pause the audio
        audioElement.currentTime = 0; // Reset the playback time to the beginning
        const currentTime = new Date().getTime();
        const duration =
          (currentTime - (trackStartTime.value[trackId] || 0)) / 1000;
        console.log(
          `Track ${trackId} ended at ${new Date().toISOString()}. Duration: ${duration} seconds`
        );
        if (duration > 3) {
          // Track duration threshold
          console.log("Track duration is greater than 3 seconds");
          trackStartTime.value[trackId] = 2000;
          trackDuration.value[trackId] = duration;
          recordStream(trackId);
        } else {
          console.log("Track duration is less than or equal to 3 seconds");
        }
      } else {
        console.log(`Audio element not found for track: ${trackId}`);
      }
    };

    const recordStream = async (trackId) => {
      console.log("Recording stream");
      const data = JSON.stringify({
        albumId: props.id,
        trackId: trackId,
        streamTime_timestamp: trackStartTime.value[trackId],
        streamDuration: trackDuration.value[trackId],
      });

      try {
        const response = await fetch(
          "https://t9elh81176.execute-api.us-east-1.amazonaws.com/dev",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: data,
          }
        );

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const check = await response.json();
        console.log(data);
        console.log(check);
      } catch (err) {
        console.error("Error recording stream:", err);
      }
    };

    const attachEventListeners = () => {
      nextTick(() => {
        albumTracks.value.forEach((track) => {
          const audioElement = document.getElementById(
            `audio_${track.trackId}`
          );
          if (audioElement) {
            audioElement.addEventListener("play", () => {
              console.log(
                `Track ${track.trackId} started at ${new Date().toISOString()}`
              );
              trackStartTime = new Date().getTime();
            });

            audioElement.addEventListener("pause", () => {
              console.log(
                `Track ${
                  track.trackId
                } has paused at ${new Date().toISOString()}`
              );
            });
          } else {
            console.log(`Audio element not found for track: ${track.trackId}`);
          }
        });
      });
    };

    const convertFileToBase64 = (file) => {
      console.log(file);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
      });
    };

    onMounted(() => {
      fetchAlbum(props.id);
      fetchPlayLists();
    });

    // Watch for changes to albumTracks and re-attach event listeners when updated
    watch(
      albumTracks,
      (newTracks) => {
        if (newTracks.length) {
          attachEventListeners();
        }
      },
      { immediate: true }
    );

    return {
      albumcover,
      albumartist,
      albumreleasedate,
      albumgenre,
      albumtitle,
      albumTracks,
      form,
      success,
      error,
      createTrack,
      stopAudio,
      handleFileUpload,
      convertFileToBase64,
      uploadFileToS3,
      playlists,
      selectedPlaylistId,
      fetchPlayLists,
      addTrackToPlaylist,
      editAlbum,
      parameterNewValue,
      message,
      uploadAlbumArt,
      handleFileUpdate,
      uploadAlbumArt,
      newAlbumTitle,
      newAlbumArtist,
      newAlbumGenre,
      newAlbumYear,
      errorMessage,
      deleteAlbum,
      deleteImage,
      updateTrackFile,
      editTrack,
      showEditForm,
      closeEditForm,
      openEditForm,
      currentTrackId,
      editFormData,
      newTrackTitle,
      newTrackArtist,
      newTrackGenre,
      newTrackReleaseDate,
      deleteTrack,
      deleteSoundFile,
      addAlbumToFavourites,
      addTrackToFavourites,
 
    };
  },
};
</script>
