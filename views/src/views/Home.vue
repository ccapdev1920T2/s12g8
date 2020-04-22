<template>
  <div class="main">
    <main class="page-content">
      <div class="search-bar">
        <form class="form">
          <img src="../../public/images/InfiniteLoop.png" width="350px" height="200px" class="center" />
          <br />
          <br />
          <br />
          <div class="inner-form">
            <div class="input-field first-wrap">
              <div class="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
              </div>
              <input id="search" name="search" type="text" v-model="query" placeholder="What are you looking for?" />
            </div>
            <div class="input-field second-wrap">
              <button class="btn-search" @click.prevent="search">SEARCH</button>
            </div>
          </div>
          <span class="info">ex. Song Title or Artist</span>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import SongService from '../services/SongService';

export default {
  name: "home",
  data() {
    return {
      query: "",
    }
  },
  methods: {
    async search() {
      if (this.query !== ""){
        await SongService.searchSong(this.query).then((res) => {
          this.$store.commit('togglePlayerWithDecision', false);
          this.$store.commit('retrieveSearchResults', res.data.songs);
          this.$router.push('/player');
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
};
</script>

<style scoped>
.visually-hidden {
  position: absolute;
  clip: rect(0 0 0 0);
  margin: -1px;
  padding: 0;
  width: 1px;
  height: 1px;
  border: 0;
  overflow: hidden;
}

.page-content {
  display: -webkit-box;
  display: flex;
  position: relative;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  min-height: 80vh;
  overflow: hidden;
  background-image: url("../../public/images/bg-01.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transition: background-color 200ms;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.search-bar {
  min-height: 680px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  position: relative;
  background-size: 100%;
  width: 200%;
}

.search-bar form {
  width: 100%;
  max-width: 790px;
  padding-top: 20vh;
}

.search-bar form .inner-form {
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-align: center;
  align-items: center;
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  border-radius: 34px;
  overflow: hidden;
  margin-bottom: 30px;
}

.search-bar form .inner-form .input-field {
  height: 68px;
}

.search-bar form .inner-form .input-field input {
  height: 100%;
  background: transparent;
  border: 0;
  display: block;
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #000;
}

.search-bar form .inner-form .input-field input.placeholder {
  color: #222;
  font-size: 16px;
}

.search-bar form .inner-form .input-field input:hover,
.search-bar form .inner-form .input-field input:focus {
  box-shadow: none;
  outline: 0;
}

.search-bar form .inner-form .input-field.first-wrap {
  -ms-flex-positive: 1;
  flex-grow: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  background: #84ceeb;
}

.search-bar form .inner-form .input-field.first-wrap input {
  -ms-flex-positive: 1;
  flex-grow: 1;
}

.search-bar form .inner-form .input-field.first-wrap .svg-wrapper {
  min-width: 80px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
}

.search-bar form .inner-form .input-field.first-wrap svg {
  width: 36px;
  height: 36px;
  fill: #222;
}

.search-bar form .inner-form .input-field.second-wrap {
  min-width: 216px;
}

.search-bar form .inner-form .input-field.second-wrap .btn-search {
  height: 100%;
  width: 100%;
  white-space: nowrap;
  font-size: 16px;
  color: #fff;
  border: 0;
  cursor: pointer;
  position: relative;
  z-index: 0;
  background: #5680e9;
  transition: all 0.2s ease-out, color 0.2s ease-out;
  font-weight: 300;
}

.search-bar form .inner-form .input-field.second-wrap .btn-search:hover {
  background: #009451;
}

.search-bar form .inner-form .input-field.second-wrap .btn-search:focus {
  outline: 0;
  box-shadow: none;
}

.search-bar form .info {
  font-size: 15px;
  color: #24f5ea;
  padding-left: 26px;
}
</style>
