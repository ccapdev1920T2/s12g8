<template>
  <div class="database_box">
    <div class="songs" v-if="!editMode">
      <div class="song" v-for="(song, index) in songList" :key="index">
        <h4>
          Title
          <span style="font-size: smaller;">{{ song.title }}</span>
        </h4>
        <h5>
          Artist
          <span style="font-size: smaller;">{{ song.artist }}</span>
        </h5>
        <h5>
          Genre
          <span style="font-size: smaller;">{{ song.genre.toString()}}</span>
        </h5>
        <div class="lyric_box">
          <p class="card-text" v-for="(line, index) in song.lyrics" :key="index">{{ line }}</p>
        </div>
        <div class="buttons">
          <button
            class="button editbutton js-message-btn"
            @click="editMode = true; selectedSong = formatSong(song)"
          >Edit</button>
          <button class="button deletebutton" @click="deleteSong(song)">Delete</button>
        </div>
      </div>
    </div>
    <div class="main" v-if="editMode" @submit.prevent="updateSong">
      <p class="sign" align="center">Upload Song</p>
      <form class="form" name="form">
        <div class="grid">
          <img :src="selectedSong.coverImage" id="imagebox" />
          <input
            type="text"
            :class="{error: errors.title}"
            v-model="selectedSong.title"
            name="title"
            id="title"
            align="center"
          />
          <input
            type="text"
            :class="{error: errors.artist}"
            v-model="selectedSong.artist"
            name="artist"
            id="artist"
            align="center"
          />
          <input
            type="text"
            :class="{error: errors.genre}"
            v-model="selectedSong.genre"
            name="genre"
            id="genre"
            align="center"
          />
          <input
            type="text"
            :class="{error: errors.duration}"
            v-model="selectedSong.duration"
            name="song-length"
            id="slength"
            align="center"
          />
          <textarea
            id="lyrics"
            name="lyrics"
            :class="{error: errors.lyrics}"
            v-model="selectedSong.lyrics"
            rows="3"
          ></textarea>
          <input
            type="text"
            :class="{error: errors.url}"
            disabled="true"
            v-model="selectedSong.url"
            id="uploads"
          />
          <input
            type="text"
            :class="{error: errors.coverImage}"
            v-model="selectedSong.coverImage"
            id="uploadi"
          />
          <input type="submit" id="submit" class="submit" align="center" value="Submit" />
          <div>
            <p id="displayError" v-for="(message, index) in errorMessage" :key="index">{{message}}</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import SongService from "../services/SongService";
import validator from "validator";

export default {
  name: "database",
  data() {
    return {
      songList: [],
      selectedSong: {},
      editMode: false,
      errors: {
        title: false,
        artist: false,
        genre: false,
        duration: false,
        lyrics: false,
        url: false,
        coverImage: false
      },
      errorMessage: []
    };
  },
  computed: {},
  async created() {
    await SongService.getAllSongs()
      .then(res => {
        if (res.status == 200) this.songList = res.data.results;
      })
      .catch(err => {
        console.log(err);
      });
    if (this.songList == null) this.songList = [];
    else {
      this.songList.forEach(e => {
        e.editMode = false;
      });
    }
  },
  methods: {
    async deleteSong(song) {
      await SongService.deleteSong(song.url, this.$store.getters.userInfo)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });

      this.songList = this.songList.filter(item => {
        return item.url !== song.url;
      });
    },
    updateSong: async function() {
      var lyricsArray = [];
      this.errors = {
        title: false,
        artist: false,
        genre: false,
        duration: false,
        lyrics: false,
        url: false,
        coverImage: false
      };
      this.errorMessage = [];

      var flag = false;
      if (this.selectedSong.title === "") {
        flag = true;
        this.errors.title = true;
        this.errorMessage.push("Title cannot be blank!");
      }
      if (this.selectedSong.artist === "") {
        flag = true;
        this.errors.artist = true;
        this.errorMessage.push("Artist cannot be blank!");
      }
      if (this.selectedSong.genre === "") {
        flag = true;
        this.errors.genre = true;
        this.errorMessage.push("Genre cannot be blank!");
      }
      if (
        this.selectedSong.duration === "" ||
        !validator.isNumeric(this.selectedSong.duration.toString())
      ) {
        flag = true;
        this.errors.duration = true;
        if (this.selectedSong.duration === "") {
          this.errorMessage.push("Duration cannot be blank!");
        } else {
          this.errorMessage.push("Duration must be numeric!");
        }
      }
      if (this.selectedSong.lyrics === "") {
        flag = true;
        this.errors.lyrics = true;
        this.errorMessage.push("Lyrics cannot be blank!");
      } else {
        lyricsArray = this.selectedSong.lyrics.split("\n");
      }

      if (
        this.selectedSong.coverImage === "" ||
        !validator.isURL(this.selectedSong.coverImage)
      ) {
        flag = true;
        this.errors.coverImage = true;
        if (this.selectedSong.coverImage === "") {
          this.errorMessage.push("Image URL cannot be blank!");
        } else {
          this.errorMessage.push(
            "Image URL must be a valid URL ending in png or image format!"
          );
        }
      }

      if (!flag) {
        this.editMode = false;
        await SongService.updateSong({
          title: this.selectedSong.title,
          artist: this.selectedSong.artist,
          genre: this.selectedSong.genre.split(",").map(item => item.trim()),
          duration: this.selectedSong.duration,
          lyrics: lyricsArray,
          coverImage: this.selectedSong.coverImage,
          url: this.selectedSong.url
        })
          .catch(err => {
            console.log(err);
          });
        await SongService.getAllSongs()
          .then(res => {
            if (res.status == 200) this.songList = res.data.results;
          })
          .catch(err => {
            console.log(err);
          });
        if (this.songList == null) this.songList = [];
        else {
          this.songList.forEach(e => {
            e.editMode = false;
          });
        }
      }
    },
    formatSong(song) {
      var songObj = { ...song };
      var lyrics = "";
      for (let i = 0; i < songObj.lyrics.length; i++) {
        lyrics += songObj.lyrics[i];
        if (i + 1 !== songObj.lyrics.length) {
          lyrics += "\n";
        }
      }
      songObj.lyrics = lyrics;
      var genre = "";
      for (let i = 0; i < songObj.genre.length; i++) {
        genre += songObj.genre[i];
        if (i + 1 !== songObj.genre.length) {
          genre += ", ";
        }
      }
      songObj.genre = genre;

      return songObj;
    }
  }
};
</script>

<style scoped>
.lyric_box {
  overflow: scroll;
  overflow-x: hidden;
  height: 250px;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

@media screen and (max-width: 576px) {
  .buttons {
    flex-wrap: wrap;
  }
}

.button {
  background: none;
  border: none;
  font-family: "Quicksand", sans-serif;
  font-weight: 700;
  margin: 10px 20px;
  padding: 15px 40px;
  min-width: 100px;
  border-radius: 50px;
  min-height: 20px;
  color: #fff;
  cursor: pointer;
  backface-visibility: hidden;
  transition: all 0.3s;
}
@media screen and (max-width: 768px) {
  .button {
    min-width: 170px;
    margin: 15px 25px;
  }
}
@media screen and (max-width: 576px) {
  .button {
    min-width: inherit;
    margin: 0;
    margin-bottom: 16px;
    width: 100%;
    max-width: 300px;
  }
  .button:last-child {
    margin-bottom: 0;
  }
}
.button:focus {
  outline: none !important;
}
@media screen and (min-width: 768px) {
  .button:hover {
    transform: translateY(-5px);
  }
}
.button:first-child {
  margin-left: 0;
}
.button:last-child {
  margin-right: 0;
}
.button.editbutton {
  background: linear-gradient(45deg, #1da1f2, #0e71c8);
  box-shadow: 0px 4px 30px rgba(19, 127, 212, 0.4);
}
.button.editbutton:hover {
  box-shadow: 0px 7px 30px rgba(19, 127, 212, 0.75);
}
.button.deletebutton {
  background: linear-gradient(45deg, #d5135a, #f05924);
  box-shadow: 0px 4px 30px rgba(223, 45, 70, 0.35);
}
.button.deletebutton:hover {
  box-shadow: 0px 7px 30px rgba(223, 45, 70, 0.75);
}
.button.button--gray {
  box-shadow: none;
  background: #dcdcdc;
  color: #142029;
}

.song {
  float: left;
  display: flex;
  border: 10px solid #f0f0f0;
  border-radius: 10px;
  padding: 8px;
  background-color: #f0f0f0;
  box-sizing: border-box;
  margin-top: 5px;
  margin-right: 10px;
  text-align: left;
  min-height: 300px;
  flex-flow: column;
  width: 300px;
}

.songs {
  display: flex;
  margin: 10px 10px;
  width: 100%;
  padding: 5px;
  min-height: 722px;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;
}

.songs:after {
  content: "";
  display: table;
  clear: both;
}

.main {
  position: relative;
  background-color: #ffffff;
  width: 750px;
  min-height: 550px;
  margin: 10vh auto;
  border-radius: 1.5em;
  box-shadow: 0px 11px 35px 2px rgba(0, 0, 0, 0.14);
}

.sign {
  padding-top: 40px;
  color: #8c55aa;
  font-family: "Ubuntu", sans-serif;
  font-weight: bold;
  font-size: 23px;
  margin-bottom: -1px;
}

.grid {
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 335px auto;
  padding: 10px;
  gap: 10px;
}

.error {
  border-color: rgb(241, 66, 66) !important;
}

#displayError {
  color: red;
}

#imagebox {
  border-width: 1px;
  background: rgba(136, 126, 126, 0.04);
  border: 2px solid rgba(0, 0, 0, 0.02);
  border-radius: 20px;
  grid-row: 1 / 6;
  height: 100%;
  width: 100%;
}

#title {
  color: rgb(38, 50, 56);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(136, 126, 126, 0.04);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}

#uploadi {
  color: rgb(38, 50, 56);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(136, 126, 126, 0.04);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}

#uploads {
  color: rgb(38, 50, 56);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(136, 126, 126, 0.04);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}

#genre {
  /* width: 40%; */
  color: rgb(38, 50, 56);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(136, 126, 126, 0.04);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}
#artist {
  color: rgb(38, 50, 56);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(136, 126, 126, 0.04);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}
#slength {
  color: rgb(38, 50, 56);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(136, 126, 126, 0.04);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}

#lyrics {
  resize: none;
  color: rgb(38, 50, 56);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background: rgba(136, 126, 126, 0.04);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.02);
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}

#displayMessage {
  color: black;
  font-family: "Ubuntu", sans-serif;
  font-size: 16px;
  margin: 25px 0px 0px 50px;
}

form.form {
  padding-top: 40px;
}

.fname:focus,
.lname:focus,
.email:focus,
.uname:focus,
.pw:focus,
.cpw:focus {
  border: 2px solid rgba(0, 0, 0, 0.18) !important;
}

.submit {
  cursor: pointer;
  border-radius: 5em;
  color: #fff;
  background: linear-gradient(to right, #9c27b0, #e040fb);
  border: 0;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 10px;
  padding-top: 10px;
  font-family: "Ubuntu", sans-serif;
  font-size: 13px;
  box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.04);
  text-shadow: 0px 0px 3px rgba(117, 117, 117, 0.12);
  color: #e1bee7;
  text-decoration: none;
  position: relative;
}

#submit {
  margin-top: 20px;
  grid-column: 1 / 3;
}

@media (max-width: 600px) {
  .main {
    border-radius: 0px;
  }
}
</style>