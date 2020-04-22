<template>
  <nav class="navbar navbar-default">
    <div class="topnav">
      <router-link to="/" class="left">
        <img src="../../public/images/InfiniteLoop_Word.png" width="100%" height="16px" />
      </router-link>
      <router-link to="/about" class="right">About</router-link>
      <router-link to="/signup" v-if="!loggedIn" class="right">Sign Up</router-link>
      <router-link to="/login" v-if="!loggedIn" class="right">Login</router-link>
      <a v-if="loggedIn" class="right" @click="logout()">Logout</a>
      <router-link to="/database" v-if="isAdmin" class="right">Database</router-link>
      <router-link to="/upload" v-if="isAdmin" class="right">Upload</router-link>
      <router-link to="/player" class="right"><a @click="togglePlayer">Player</a></router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Header",
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  },
  methods: {
    logout() {
      this.$store
        .dispatch("destroyToken")
        .then(() => {
          if (this.$router.currentRoute.path !== "/")
            this.$router.push("/").catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    togglePlayer() {
      this.$store.commit("togglePlayer");
    }
  }
};
</script>

<style scoped>
.topnav {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  background: linear-gradient(
    90deg,
    rgba(140, 0, 255, 1) 0%,
    rgba(163, 0, 244, 1) 20%,
    rgba(186, 0, 233, 1) 40%,
    rgba(209, 0, 222, 1) 60%,
    rgba(232, 0, 211, 1) 80%,
    rgba(255, 0, 200, 1) 100%
  );
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

.topnav a.right {
  float: right;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  cursor: pointer;
}

.topnav a.left {
  float: left;
  padding: 14px 16px;
}

.topnav a:hover {
  background-color: #ddd;
  color: black;
}
</style>