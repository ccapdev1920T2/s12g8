<template>
  <div class="only_lyric_page" id="music-player">
    <img id="album-art" :src="currentSong.coverImage" />
    <div id="top-bar">
      <div id="about-song">
        <span class="song-name">Now Playing: {{ currentSong.title }}</span>
        <span class="artist-name">&nbsp;&nbsp;&nbsp;&nbsp;by {{ currentSong.artist }}</span>
      </div>
    </div>

    <div id="lyrics">
      <h2 class="song-name"></h2>
      <h4 class="artist-name"></h4>
      <div id="lyrics-content">
        <div class="text" v-for="(line, index) in currentSong.lyrics" :key="index">{{ line }}</div>
      </div>
    </div>

    <audio
      id="audioFile"
      :src="currentSong.url"
      preload="true"
      ref="audio"
      @timeupdate="currentTime = $event.target.currentTime"
    ></audio>

    <div id="player">
      <div id="bar">
        <div id="current-time">{{ formatSeconds(time) }}</div>
        <div
          id="progress-bar"
          @mousedown="startMoveProgress"
          @mousemove.prevent="moveProgressBar($event)"
        >
          <div id="progress" :style="{width: progressBarWidth + '%'}">
            <i
              id="progressButton"
              class="fa fa-circle"
              @mousedown="startMoveProgress"
              @mousemove.prevent="moveProgressBar($event)"
            ></i>
          </div>
        </div>
        <div id="total-time">{{ formatSeconds(currentSong.duration) }}</div>
      </div>

      <div id="menu">
        <button id="searchButton" @click="$emit('toggle')">
          <i class="fa fa-search"></i>
        </button>
        <button id="repeat" :style="repeatColor" @click="toggleRepeat">
          <i class="fa fa-repeat"></i>
        </button>
        <button id="prev" @click="prevSong">
          <i class="fa fa-step-backward"></i>
        </button>
        <button id="play" @click="playSong">
          <i :class="!play ? 'fa fa-play' : 'fa fa-pause'"></i>
        </button>
        <button id="next" @click="nextSong">
          <i class="fa fa-step-forward"></i>
        </button>
        <button id="shuffle" :style="shuffleColor" @click="toggleShuffle">
          <i class="fa fa-random"></i>
        </button>
        <button id="playlistButton" @click="togglePlaylist">
          <i class="fa fa-list"></i>
        </button>
      </div>
    </div>

    <div id="playlist" :style="{ transform: playlistTransform }">
      <div id="label">
        <h1 v-if="!editPlaylist">
          {{ playlistName }}&nbsp;&nbsp;&nbsp;&nbsp;
          <i
            id="edit"
            @click="toggleNameEdit(true)"
            class="fa fa-edit"
          ></i>
        </h1>
        <h1 v-if="editPlaylist">
          <input type="text" v-model="playlistName" />&nbsp;&nbsp;&nbsp;&nbsp;
          <i
            id="edit"
            v-if="editPlaylist"
            @click="toggleNameEdit(false); savePlaylistName();"
            class="fa fa-edit"
          ></i>
        </h1>
        <input
          id="search"
          type="text"
          :placeholder="placeholderString"
          v-model="searchString"
          @keyup="searchText"
        />
      </div>
      <div id="show-box">
        <div id="show-list">
          <div class="float-song-card" v-for="(song, index) in filteredPlaylist" :key="index">
            <img
              class="album-art"
              @click="loadAndPlaySong(song)"
              style=" display: block"
              :src="song.coverImage"
            />
            <i id="remove" class="fa fa-trash" @click="removeFromList(song)"></i>
            <h2 class="song" @click="loadAndPlaySong(song)">{{ song.title }}</h2>
            <h4 class="artist" @click="loadAndPlaySong(song)">{{ song.artist }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SongService from "../services/SongService";

export default {
  name: "musicplayercomponent",
  data() {
    return {
      playlist: [],
      filteredPlaylist: [],
      databasePlaylistName: "",
      playlistName: "",
      index: 0,
      currentSong: {},
      time: 0,
      play: 0,
      songRepeat: 0,
      songRepeatColor: "grey",
      songShuffle: 0,
      songShuffleColor: "grey",
      mute: 0,
      previousTime: 0,
      progressBarWidth: 0,
      moveProgress: false,
      currentTime: 0,
      displayPlaylist: 0,
      playlistTransform: "translateX(100%)",
      placeholderString: "\uF002 Search from all songs",
      editPlaylist: false,
      searchString: ""
    };
  },
  async created() {
    await SongService.retrievePlaylist(this.$store.getters.userInfo)
      .then(res => {
        if (res.status == 200) {
          this.playlist = res.data.result.songs;
          this.playlistName = res.data.result.playlistName;
          this.databasePlaylistName = res.data.result.playlistName;
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.currentSong = this.playlist[0];
    this.filteredPlaylist = this.playlist;
  },
  computed: {
    repeatColor() {
      return {
        color: this.songRepeatColor
      };
    },
    shuffleColor() {
      return {
        color: this.songShuffleColor
      };
    },
    retrieveAlbumArt() {
      return this.currentSong.coverImage;
    }
  },
  methods: {
    toggleNameEdit(truth) {
      this.editPlaylist = truth;
    },

    savePlaylistName() {
      if (this.databasePlaylistName != this.playlistName)
        SongService.updatePlaylistName(
          this.$store.getters.userInfo,
          this.playlistName
        ).catch(err => {
          console.log(err);
        });
    },

    reset() {
      this.time = 0;
      this.$refs.audio.currentTime = 0;
    },

    loadSong() {
      this.$refs.audio.src = this.currentSong.url;
      console.log(this.currentSong.title + " loaded.");
    },

    loadAndPlaySong(song) {
      this.currentSong = song;
      this.index = this.playlist.indexOf(song);
      this.reset();
      this.previousTime = 0;
      this.$refs.audio.src = song.url;
      this.play = 0;
      this.$refs.audio.pause();
      this.playSong();
      console.log(this.currentSong.title + " loaded.");
    },

    prevSong() {
      this.reset();
      this.previousTime = 0;
      if (this.songShuffle == 1) {
        this.index = parseInt(Math.random() * 10) % this.playlist.length;
      } else {
        this.index = (this.index - 1) % this.playlist.length;
      }
      this.currentSong = this.playlist[this.index];
      this.loadSong();

      this.play = 0;
      this.$refs.audio.pause();
      this.playSong();
    },

    nextSong() {
      this.reset();
      this.previousTime = 0;
      if (this.songShuffle == 1) {
        // while(this.index = )
        this.index =
          parseInt(Math.random() * this.playlist.length) % this.playlist.length;
        console.log(this.index);
      } else {
        this.index = (this.index + 1) % this.playlist.length;
      }
      this.currentSong = this.playlist[this.index];
      this.loadSong();

      this.play = 0;
      this.$refs.audio.pause();
      this.playSong();
    },

    async playSong() {
      if (this.play == 0) {
        this.play = 1;
        var promise = this.$refs.audio
          .play()
          .then()
          .catch(e => {
            throw e;
          });
        if (promise !== undefined) {
          promise
            .then(() => {})
            .catch(error => {
              this.$refs.audio.play().catch(error => {
                throw error;
              });
              throw error;
            });
        }
      } else {
        this.play = 0;
        this.$refs.audio.pause();
      }
    },

    toggleRepeat() {
      if (this.songRepeat == 0) {
        this.songRepeatColor = "white";
        this.songRepeat = 1;
      } else {
        this.songRepeatColor = "grey";
        this.songRepeat = 0;
      }
    },

    toggleShuffle() {
      if (this.songShuffle == 0) {
        this.songShuffleColor = "white";
        this.songShuffle = 1;
      } else {
        this.songShuffleColor = "grey";
        this.songShuffle = 0;
      }
    },

    startMoveProgress() {
      this.moveProgress = true;
    },

    moveProgressBar: function(event) {
      if (this.moveProgress) {
        var width = "70%";
        var percent = (parseInt(event.offsetX / 11) / parseInt(width)) * 100;
        if (parseInt(percent) <= 100) {
          this.progressBarWidth = percent;
          this.time = this.$refs.audio.duration * (percent.toPrecision() / 100);
          this.$refs.audio.currentTime = this.time;
        } else {
          this.stopMoveProgress();
        }
      }
    },

    stopMoveProgress() {
      this.moveProgress = false;
    },

    togglePlaylist() {
      if (this.displayPlaylist == 0) {
        this.playlistTransform = "translateX(0)";
        this.displayPlaylist = 1;
      } else {
        this.playlistTransform = "translateX(100%)";
        this.displayPlaylist = 0;
      }
    },

    formatSeconds(seconds) {
      var date = new Date(1970, 0, 1);
      date.setSeconds(seconds);
      return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    },

    async removeFromList(song) {
      await SongService.deleteFromPlaylist(this.$store.getters.userInfo, song)
        .then(() => {
          this.playlist = this.playlist.filter(item => {
            return item.url !== song.url;
          });
          this.searchText();
          if(playlist.length == 0) {
            this.currentSong = {};
            this.$emit('toggle');
          }
          if(this.currentSong.url == song.url){
            this.nextSong();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    searchText() {
      if (this.searchString === "") {
        this.filteredPlaylist = this.playlist;
      } else {
        this.filteredPlaylist = this.playlist.filter(song => {
          return song.title.toLowerCase().includes(this.searchString.toLowerCase()) ||
            song.artist.toLowerCase().includes(this.searchString.toLowerCase());
        });
      }
    }
  },
  watch: {
    currentTime: async function() {
      await new Promise(r => setTimeout(r, 1000));
      //for the end of the song
      if (this.time >= this.currentSong.duration) {
        this.play = 0;

        if (this.songRepeat == 1) {
          this.reset();
          this.playSong();
          return;
        } else {
          this.nextSong();
        }
        return;
      }

      //upadate time on the progress bar
      if (this.currentSong.duration != this.previousTime) {
        this.previousTime = this.$refs.audio.currentTime;
        this.time = this.$refs.audio.currentTime;
        var percent = (this.time / this.$refs.audio.duration) * 100;
        this.progressBarWidth = percent;
      } else {
        this.time = parseFloat(this.$refs.audio.currentTime);
        if (this.time > 0.1) this.time = this.time - 0.1;
        if (this.play == 1) {
          this.$refs.audio.pause();
          if (this.$refs.audio.readyState == 4) {
            this.$refs.audio.play().catch(e => {
              console.log(e);
            });
          }
        }
      }
    }
  },
  mounted: function() {
    window.addEventListener("mouseup", this.stopMoveProgress);
  },
  destroyed: function() {
    window.removeEventListener("mouseup", this.stopMoveProgress);
  }
};
</script>

<style scoped>
.show {
  display: block !important;
}

#show-list {
  font-size: medium;
}

.state_img img {
  display: none;
}

.playbox {
  position: relative;
  z-index: 6;
  color: rgba(225, 225, 225, 0.8);
}

.play_footer {
  width: 1170px;
  height: 65px;
  position: fixed;
  bottom: 0;
}

.play_footer > a {
  float: left;
  margin-right: 20px;
}

.play_footer > a i {
  font-size: 24px;
  color: rgba(225, 225, 225, 0.8);
}

.play_footer > a i.icon-zanting {
  font-size: 30px;
  margin-top: 5px;
}

.player_progress {
  height: 8px;
  width: 634px;
  cursor: pointer;
  background: rgba(225, 225, 225, 0.8);
  color: rgba(225, 225, 225, 0.8);
  margin-top: 10px;
  position: relative;
}

.player_music {
  margin-left: 30px;
}

.player_progress__load {
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
}

.player_progress__play {
  height: 2px;
  width: 100px;
  background: rgba(255, 255, 255, 0.7);
  position: absolute;
  left: 0;
  top: 0;
}

.player_progress__dot {
  width: 10px;
  height: 10px;
  background: #fff;
  position: absolute;
  right: -10px;
  top: -4px;
  border-radius: 100%;
}

.music_info .player_music__info span {
  margin-right: 5px;
}

.author_img:after {
  content: "";
  width: 201px;
  height: 180px;
  /* background: url(../img/album_cover_player.png) no-repeat; */
  position: absolute;
  right: 28px;
  /* top: 0; */
}

.author_img {
  position: relative;
}

.box_right p {
  line-height: 2;
}

.song_info__lyric {
  height: 300px;
  margin-top: 30px;
  overflow: hidden;
}

.player_voice {
  height: 8px;
  position: relative;
  /* background: red; */
  margin-top: 15px;
  margin-left: 10px;
}

.player_voice_load {
  width: 80px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
}

.player_voice__play {
  height: 2px;
  width: 40px;
  background: rgba(255, 255, 255, 0.7);
  position: absolute;
  left: 0;
  top: 0;
}

.player_voice_box {
  margin-left: 20px;
}

.player_voice_box a i {
  font-size: 24px;
  color: rgba(225, 225, 225, 0.8);
}

.player_voice__dot {
  width: 10px;
  height: 10px;
  background: #fff;
  position: absolute;
  right: -4px;
  top: -4px;
  border-radius: 100%;
}

.play_btn a i {
  font-size: 24px;
  color: rgba(225, 225, 225, 0.8);
}

.play_btn a i.icon-pinglun {
  font-size: 22px;
}

.play_btn a i.icon-xiazai {
  font-size: 30px;
}

.play_btn a {
  margin: 0 5px;
}

.box_right span {
  margin-left: 10px;
}

.select {
  color: #35b577;
}

.type_select {
  width: 74px;
  height: 21px;
  line-height: 21px;
  display: inline-block;
  border: 2px solid #fff;
  border-radius: 20px;
  padding: 2px;
}

.type_select .txt {
  width: 46px;
  text-align: center;
  color: #fff;
}

.type_select .dot {
  display: inline-block;
  width: 21px;
  height: 21px;
  background: #fff;
  border-radius: 100%;
}

.only_lyric_page {
  height: 391px;
  overflow: hidden;
  margin-top: 0px;
  font-size: 22px;
  /* color: #fff; */
  text-align: center;
  line-height: 2.5;
}

.box_right .author_img {
  display: block;
  width: 186px;
  height: 186px;
  border-radius: 100%;
  overflow: hidden;
  margin-left: 52px;
  animation: circle 20s infinite linear;
}
.author_img.animation {
  animation: circle 20s infinite linear;
}
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

#music-player {
  width: 100%;
  height: 680px;
  background: (--bg-color);
}

#album-art {
  position: absolute;
  z-index: 4;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(244, 206, 255);
  opacity: 0.15;
  width: 750px;
  height: 680px;
}

#top-bar {
  position: relative;
  top: 20px;
  height: 70px;
  color: white;
  width: 90%;
  padding: 0 0 0 5%;
  z-index: 50;
  text-align: center;
}
#top-bar > * {
  display: inline-block;
}

#about-song {
  height: 35px;
  width: 80%;
  line-height: 1vh;
  font-size: 70%;
  /* float: left; */
  display: inline-block;
}

#about-song span.song-name {
  font-size: 32px;
}

#about-song span.artist-name {
  font-size: 22px;
}

#edit {
  cursor: pointer;
}

#remove {
  position: absolute;
  font-size: 25px;
  color: white;
  top: 0px;
  right: 0px;
}

.artist-name {
  color: #ffffff79;
}
@media only screen and (max-width: 340px) {
  #top-bar > button {
    font-size: 15px;
  }
  #top-bar > #about-song * {
    font-size: 120%;
    line-height: 0;
  }
  #menu > button {
    font-size: 5vw !important;
    padding: 4px 6px !important;
  }
  #progress-bar {
    width: 50% !important;
  }
}

#lyrics {
  width: 100%;
  height: 60vh;
  color: (--lyrics-color);
  text-align: center;
  overflow-y: scroll;
  font-size: 2vh;
  scrollbar-width: 5px thin;
  scrollbar-color: darkgrey rgba(0, 0, 0, 0);
  scrollbar-shadow-color: rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 60;
}

#lyrics-content {
  margin: 0;
  padding-top: 20vh;
  padding-bottom: 20vh;
  transition: ease 0.1s all;
}

#lyrics-content div.text {
  font-size: 40px;
}
#lyrics h2 {
  opacity: 0.25;
}
#lyrics .current {
  opacity: 1;
  font-size: 250%;
  transform: translateY(25%);
}
#lyrics .current + h2 {
  opacity: 0.5;
  font-size: 180%;
}
#player {
  background: rgba(114, 114, 114, 0.5); /* Green background with 30% opacity */
  position: fixed;
  bottom: 0;
  height: 25vh;
  width: 100%;
  z-index: 50;
}
#bar {
  position: relative;
  text-align: center;
  width: 100%;
  padding-top: 25px;
}
#current-time,
#total-time {
  transform: translateY(-23%);
  padding: 0 2%;
  font-size: 3vh;
}
@media only screen and (min-height: 500px) {
  #current-time,
  #total-time {
    font-size: 2.25vh !important;
  }
}
#current-time,
#progress-bar,
#total-time {
  margin-top: 20px;
  color: white;
  display: inline-block;
}
#progress-bar {
  position: relative;
  text-align: center;
  height: 0.25em;
  width: 70%;
  border: 1px solid #222;
  background: #333;
  border-radius: 20px;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transform: translateY(-160%);
}
#progress {
  height: 100%;
  width: 0%;
  background: red;
  border-radius: 20px;
  text-align: right;
  transition: ease all;
}
#progress > i {
  position: absolute;
  transform: translate(-50%, -35%);
}
#menu {
  position: relative;
  text-align: center;
  width: 100%;
  overflow: hidden;
}
#menu > button {
  padding: 10px 14px;
  border-radius: 50%;
  border: none;
  margin: 0 5px;
  background: inherit;
  color: white;
  font-size: 20px;
  text-align: center;
  opacity: 0.75;
  cursor: pointer;
}
#menu > button > i {
  padding: 5px 3px 5px 5px;
}
#menu > button#play {
  opacity: 1;
  border: 2px solid white;
}
#menu > button:focus {
  outline: none;
}
#playlist {
  position: fixed;
  top: 7vh;
  left: 0;
  height: 68vh;
  width: 100%;
  z-index: 60;
  color: (--lyrics-color);
  background-color: #7f5a8399;
  background-image: linear-gradient(315deg, #7f5a8399 0%, #0d324d99 74%);
  transition: cubic-bezier(0.175, 0.885, 0.32, 1.275) 1s all;
  transform: translateX(100%);
}
#show-box {
  position: absolute;
  top: 80%;
  left: 50%;
  height: 38vh;
  width: 70%;
  padding: 4vh;
  transform: translate(-50%, -70%);
  overflow-y: scroll;
  scrollbar-width: 5px thin;
  scrollbar-color: darkgrey rgba(0, 0, 0, 0);
  scrollbar-shadow-color: rgba(0, 0, 0, 0.3);
}
#show-list {
  position: relative;
  transition: ease-in-out 0.5s all;
  height: 100%;
}
#show-list .float-song-card {
  position: relative;
  display: inline-block;
  height: 130px;
  width: 110px;
  padding: 20px 10px;
  background: #00000089;
  text-align: center;
  font-size: 70%;
  border-radius: 8px;
  margin: 4px 10px;
  overflow: hidden;
  cursor: pointer;
}
.float-song-card > .album-art {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: auto;
  opacity: 0.75;
  transition: ease-in-out 0.5s all;
}
.float-song-card:hover > .album-art {
  transform: translateX(-50%) scale(1.2, 1.2);
  opacity: 1;
}
.float-song-card > h2,
.float-song-card > h4 {
  text-shadow: 1px 1px black;
  color: white;
  position: relative;
  z-index: 49;
  margin: 2px 0;
}
#playlist > #label {
  color: white;
  width: 100%;
  text-align: center;
  font-size: 80%;
}
#playlist > #label > h1 {
  line-height: 0;
  margin: 6vh 0 2.5vh;
}
#playlist > #label > h1 > input {
  text-align: center;
  width: 250px;
  line-height: 0;
}
#search {
  background: transparent;
  color: gray;
  border: 1px solid #ffffff99;
  padding: 10px;
  margin: 2.5vh 0;
  border-radius: 50%;
  font-family: FontAwesome, "Montserrat", sans-serif;
  transition: cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s all;
  width: 20px;
  height: 20px;
  background: white;
}
#search:focus {
  outline: none;
  border-radius: 8px;
  border: 1px solid #ffffff;
  width: 25vw;
  padding: 1vh 1.5vw;
  background: inherit;
}
@media only screen and (max-height: 500px) {
  #show-list .float-song-card {
    font-size: 40% !important;
    height: 60px;
    width: 50px;
  }
  #playlist > #label {
    font-size: 70%;
  }
  #search {
    font-size: 10px;
    padding: 4px;
    width: 10px;
  }
  #search:focus {
    width: 40vw;
  }
  #playlist > #label > h1 {
    margin: 8vh 0 4vh !important;
  }
}

#lyrics::-webkit-scrollbar,
#show-box::-webkit-scrollbar {
  width: 5px;
}
#lyrics::-webkit-scrollbar-track,
#show-box::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
#lyrics::-webkit-scrollbar-thumb,
#show-box::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 15px;
}
.floating-icon {
  position: absolute;
  bottom: 5%;
  z-index: 1000;
  font-size: 4vh;
  border: 1.5px solid white;
  border-radius: 50%;
  padding: 1vh 2vh;
  background: #222;
}
.floating-icon:nth-child(1) {
  right: 3vh;
}
.floating-icon:nth-child(2) {
  right: 12vh;
}

</style>