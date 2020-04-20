<template>
  <div class="main">
    <p class="sign" align="center">Upload Song</p>
    <form class="form" name="form" @submit.prevent="addSong">
      <div class="grid">
        <img :src="songInfo.coverImage" id="imagebox" />
        <input
          type="text"
          :class="{error: errors.title}"
          v-model="songInfo.title"
          name="title"
          id="title"
          align="center"
          placeholder="Title"
        />
        <input
          type="text"
          :class="{error: errors.artist}"
          v-model="songInfo.artist"
          name="artist"
          id="artist"
          align="center"
          placeholder="Artist"
        />
        <input
          type="text"
          :class="{error: errors.genre}"
          v-model="songInfo.genre"
          name="genre"
          id="genre"
          align="center"
          placeholder="Genre"
        />
        <input
          type="text"
          :class="{error: errors.duration}"
          v-model="songInfo.duration"
          name="song-length"
          id="slength"
          align="center"
          placeholder="Song Length"
        />
        <textarea
          id="lyrics"
          name="lyrics"
          :class="{error: errors.lyrics}"
          v-model="songInfo.lyrics"
          placeholder="Insert lyrics here"
          rows="3"
        ></textarea>
        <input
          type="text"
          :class="{error: errors.url}"
          v-model="songInfo.url"
          id="uploads"
          placeholder="Input Song Link"
        />
        <input
          type="text"
          :class="{error: errors.coverImage}"
          v-model="songInfo.coverImage"
          id="uploadi"
          placeholder="Input Image Link"
        />
        <input
          type="submit"
          id="submit"
          class="submit"
          align="center"
          value="Submit"
        />
        <p id="displayMessage">{{ message }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import SongService from '../services/SongService';
import validator from 'validator';

export default {
  name: "upload",
  data() {
    return {
      songInfo: {
        title: "",
        artist: "",
        genre: "",
        duration: "",
        lyrics: "",
        url: "",
        coverImage: ""
      },
      errors: {
        title: false,
        artist: false,
        genre: false,
        duration: false,
        lyrics: false,
        url: false,
        coverImage: false
      },
      message: ""
    };
  },
  methods: {
    addSong: async function () {
      var lyricsArray = [];
      var flag = false;
      if (this.songInfo.title === ""){
        flag = true;
        this.errors.title = true;
      }
      if (this.songInfo.artist === ""){
        flag = true;
        this.errors.artist = true;
      }
      if (this.songInfo.genre === ""){
        flag = true;
        this.errors.genre = true;
      }
      if (this.songInfo.duration === "" || !validator.isNumeric(this.songInfo.duration)){
        flag = true;
        this.errors.duration = true;
      }
      if (this.songInfo.lyrics === ""){
        flag = true;
        this.errors.lyrics = true;
      } else {
        lyricsArray = this.songInfo.lyrics.split('\n');
      }
      if (this.songInfo.url === "" || !validator.isURL(this.songInfo.url)){
        flag = true;
        this.errors.url = true;
      }
      if (this.songInfo.coverImage === ""){
        flag = true;
        this.errors.coverImage = true;
      }

      if (!flag) {
        await SongService.addSong({
          title: this.songInfo.title,
          artist: this.songInfo.artist,
          genre: this.songInfo.genre,
          duration: this.songInfo.duration,
          lyrics: lyricsArray,
          coverImage: this.songInfo.coverImage,
          url: this.songInfo.url
        }).then(res => {
          if (res.status === 201) {
            this.message = "Successfully added!";
          } else {
            this.message = "Song exists or an error has occurred!";
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
};
</script>

<style scoped>
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