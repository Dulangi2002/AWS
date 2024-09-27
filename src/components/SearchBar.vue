<template>
  <div>
    <input v-model="searchQuery" placeholder="Search..." @input="applySearch" />

    <div>
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

    <!-- Add more filters for Album, Track, etc. -->

    <ul>
      <li v-for="album in filteredAlbums" :key="album.id">
        {{ album.albumTitle }} by {{ album.albumArtist }}
        <button @click="() => $router.push({ name: 'album', params: { id: album.id } })">Explore Album</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    albums: {
      type: Array,
      required: true,
    },
    genres: {
      type: Array,
      required: true,
    },
    artists: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      selectedGenre: '',
      selectedArtist: '',
      filteredAlbums: this.albums, 
    };
  },
  methods: {
    applySearch() {
      this.filterAlbums();
    },
    applyGenreFilter() {
      this.filterAlbums();
    },
    applyArtistFilter() {
      this.filterAlbums();
    },
    filterAlbums() {
      this.filteredAlbums = this.albums.filter(album => {
        const matchesTitle = album.albumTitle.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesGenre = this.selectedGenre ? album.albumGenre === this.selectedGenre : true;
        const matchesArtist = this.selectedArtist ? album.albumArtist === this.selectedArtist : true;
        return matchesTitle && matchesGenre && matchesArtist;
      });
    },
  },
  computed: {
    // Computed property not required as we use methods to apply filters
  },
  mounted() {
    this.filteredAlbums = this.albums;
  },
};
</script>
