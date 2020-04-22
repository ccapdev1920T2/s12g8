<template>
  <div class="main_content clearfix">
    <div class="box_left">
      <div class="music_list" id="music_list">
        <ul class>
          <li id="songlist__header" class="clearfix border-top">
            <span class="title">Title</span>
            <span class="artist">Singer</span>
            <span class="duration">Duration</span>
          </li>
          <li
            class="music_item clearfix border-top"
            v-for="(item, index) in searchList"
            :key="index"
            @click="selectedItem = item"
          >
            <span class="state">
              <input
                type="checkbox"
                :checked="item.checked"
                @change="onChange(item, $event)"
                class="css-checkbox"
                name="checkboxG2"
                :id="item.title"
              />
              <label :for="item.title" class="css-label title"></label>
            </span>
            <span class="title">{{ item.title }}</span>
            <span class="artist">{{ item.artist }}</span>
            <span class="duration">{{ formatSeconds(item.duration) }}</span>
          </li>
        </ul>
      </div>
      <div>
        <p id="tooltip">Click the heart to add to your playlist! Click again to remove!</p>
        <p id="tooltip">Click on the song to view album image!</p>
        <p id="tooltip">Click the play button to the right side to play your playlist!</p>
      </div>
    </div>
    <div class="box_right">
      <div class="album_img">
        <img :src="selectedItem.coverImage" v-if="selectedItem.coverImage" @click="$emit('toggle')" />
      </div>
      <p>
        <span>{{ selectedItem.title }}</span>
      </p>
      <p>
        <span>{{ selectedItem.artist }}</span>
      </p>
      <div class="playlist_box">
        <ul>
          <li class="playlist_title clearfix border-top">
            <span class="title" @click="$emit('toggle')">
              {{ playlistName }} &nbsp;&nbsp;&nbsp;&nbsp;
              <i
                id="play"
                @click="$emit('toggle')"
                class="fa fa-play"
              ></i>
            </span>
          </li>
          <li
            class="playlist_title clearfix border-top"
            v-for="(item, index) in playlist"
            :key="index"
            @click="selectedItem = item"
          >
            <span class="title">{{ index+1 }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.title }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SongService from "../services/SongService";

export default {
  name: "musiclist",
  data() {
    return {
      searchList: [],
      selectedItem: {},
      playlist: [],
      playlistName: ""
    };
  },
  async created() {
    this.playlist = [];
    this.searchList = this.$store.getters.getSearchResults;

    await SongService.retrievePlaylist(this.$store.getters.userInfo)
      .then(res => {
        if (res.status == 200) {
          this.playlist = res.data.result.songs;
          this.playlistName = res.data.result.playlistName;
        }
      })
      .catch(err => {
        console.log(err);
      });

    this.searchList.forEach(e => {
      e.checked = false;
    });

    for (var i = 0; i < this.searchList.length; i++) {
      for (var j = 0; j < this.playlist.length; j++) {
        if (this.searchList[i].url == this.playlist[j].url) {
          this.searchList[i].checked = true;
        }
      }
    }
  },
  methods: {
    async onChange(song, $event) {
      if ($event.target.checked) {
        await SongService.addToPlaylist(this.$store.getters.userInfo, song)
          .then(() => {
            this.playlist.push(song);
            for (var i = 0; i < this.searchList.length; i++) {
              for (var j = 0; j < this.playlist.length; j++) {
                if (this.searchList[i].url == this.playlist[j].url) {
                  this.searchList[i].checked = true;
                }
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        await SongService.deleteFromPlaylist(this.$store.getters.userInfo, song)
          .then(() => {
            this.playlist = this.playlist.filter(item => {
              return item.url !== song.url;
            });
            for (var i = 0; i < this.searchList.length; i++) {
              for (var j = 0; j < this.playlist.length; j++) {
                if (this.searchList[i].url == this.playlist[j].url) {
                  this.searchList[i].checked = true;
                }
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    formatSeconds(seconds) {
      var date = new Date(1970, 0, 1);
      date.setSeconds(seconds);
      return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}

li {
  list-style: none;
}

.main_content {
  height: 100%;
  width: 100%;
  justify-content: center;
  display: flex;
}

.clearfix:after {
  content: "";
  clear: both;
  display: block;
}

.wd {
  width: 1190px;
}

.container {
  width: 600px;
  margin: 0 100px;
}

.music_item input[type="checkbox"] {
  width: 14px;
  height: 14px;
  margin-top: 20px;
}

.duration {
  width: 80px;
}

.music_item > input,
.music_item > span,
.music_item > img {
  float: left;
}

.music_item > input {
  margin-right: 10px;
}

.music_item > img {
  margin-top: 20px;
}

.music_item > span.title {
  margin-left: 10px;
  width: 350px;
  text-overflow: ellipsis;
}

.music_item > .state,
.music_item > .state_img {
  display: block;
  width: 29px;
}

.music_item > span.artist {
  width: 450px;
  text-overflow: ellipsis;
}

.box_left {
  position: relative;
  width: 1100px;
  margin-top: 30px;
  display: inline-block;
}

.box_right {
  position: relative;
  width: 290px;
  margin: 30px 0 0 30px;
  text-align: center;
}

.playlist_box {
  display: inline-block;
  width: 290px;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: 5px thin;
  scrollbar-color: darkgrey rgba(0, 0, 0, 0);
  scrollbar-shadow-color: rgba(0, 0, 0, 0.3);
}

.music_item {
  height: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  line-height: 50px;
  padding-right: 30px;
  color: rgba(225, 225, 225, 0.8);
}

#play {
  cursor: pointer;
}

#songlist__header {
  height: 50px;
  line-height: 50px;
  color: rgba(225, 225, 225, 0.8);
}

#songlist__header > input,
#songlist__header > span {
  float: left;
}

#songlist__header > input {
  margin-top: 20px;
}

#songlist__header .title {
  margin-left: 40px;
}

#songlist__header > span.title {
  width: 350px;
}

#songlist__header > span.artist {
  width: 450px;
}

#tooltip {
  padding-left: 50px;
}

.playlist_box ul {
  margin: 0;
  padding: 0;
}

.playlist_title {
  height: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  line-height: 50px;
  color: rgba(225, 225, 225, 0.8);
}

.playlist_title span.title {
  float: left;
  width: 290px;
  text-overflow: ellipsis;
}

.hidden {
  display: none !important;
}

.music_list {
  width: 1100px;
  margin-top: 30px;
  height: 500px;
  overflow-y: scroll;
  scrollbar-width: 5px thin;
  scrollbar-color: darkgrey rgba(0, 0, 0, 0);
  scrollbar-shadow-color: rgba(0, 0, 0, 0.3);
}

.music_list ul {
  overflow: hidden;
}

.noselects {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.player_logo {
  position: relative;
  z-index: 4;
  width: 100px;
  left: 20px;
  top: 20px;
}

.player_logo img {
  width: 100%;
}
.border-top {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  /*border-bottom: 1px solid rgba(255, 255, 255, .2);*/
}

.music_item .name span {
  float: left;
}

.music_item .name .title {
  height: 50px;
  width: 220px;
  overflow: hidden;
}

.music_item .name span i {
  cursor: pointer;
  display: inline-block;
  font-size: 20px;
  margin-left: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100%;
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  margin-top: 7px;
}

.music_item .name span i:hover {
  border-color: #fff;
}

.music_item .name .mod_list_menu {
  display: none;
}

.music_item .duration .delete {
  cursor: pointer;
  display: inline-block;
  font-size: 20px;
  margin-left: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100%;
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  margin-top: 7px;
  display: none;
}

.music_item .duration i.delete:hover {
  border: 1px solid #fff;
}

.music_item:hover .name .mod_list_menu {
  display: block;
}

.music_item:hover .duration .delete {
  display: block;
}

.music_item:hover .duration span.duration {
  display: none;
}

input[type="checkbox"].css-checkbox {
  position: absolute;
  z-index: -1000;
  left: -1000px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}

input[type="checkbox"].css-checkbox + label.css-label {
  margin-left: 10px;
  padding-left: 15px;
  height: 15px;
  display: inline-block;
  line-height: 15px;
  background-repeat: no-repeat;
  background-position: 0 0;
  font-size: 15px;
  cursor: pointer;
}

input[type="checkbox"].css-checkbox:checked + label.css-label {
  background-position: 0 -15px;
}

label.css-label {
  background-image: url(http://csscheckbox.com/checkboxes/u/csscheckbox_1437560032a3e1345ce3a7bb5fec77cc.png);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.album_img img {
  margin-top: 6vh;
  width: 186px;
  height: 186px;
  cursor: pointer;
  display: inline-block;
}

.playlist_box::-webkit-scrollbar,
.music_list::-webkit-scrollbar {
  width: 5px;
}

.playlist_box::-webkit-scrollbar-track,
.music_list::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.playlist_box::-webkit-scrollbar-thumb,
.music_list::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 15px;
}
</style>