<template>
  <div class="music_div">
    <MusicList v-show="!toggleMusicPlayer" @toggle="toggleMusicPlayer = true" />
    <MusicPlayerComponent v-show="toggleMusicPlayer" @toggle="toggleMusicPlayer = false" />
    <div class="bg_player_mask" v-show="toggleMusicPlayer"></div>
  </div>
</template>

<script>
import MusicList from "../components/MusicList";
import MusicPlayerComponent from "../components/MusicPlayerComponent";

export default {
  name: "musicplayer",
  components: {
    MusicList,
    MusicPlayerComponent
  },
  data() {
    return {
      toggleMusicPlayer: this.$store.getters.getToggleStatus
    };
  }
};
</script>

<style scoped>
.scroll_bar {
  width: 8px;
  height: 404px;
  position: relative;
  margin-top: 30px;
}

.scroll_bar .bar {
  width: 8px;
  background: rgba(0, 0, 0, 0.1);
  height: 100px;
  display: inline-block;
  border-radius: 10px;
  position: absolute;
}

.bg_player_mask {
  margin-top: 48px;
  background-color: #292a2b;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 680px;
  overflow: hidden;
  min-width: 1170px;
}
</style>