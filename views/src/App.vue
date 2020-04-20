<template>
  <div class="main-vue">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from "./components/Header";
import axios from "axios";

export default {
  name: "App",
  components: {
    Header
  },
  created: function() {
    axios.interceptors.response.use(undefined, function(err) {
      return async function() {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("destroyToken");
          if (this.$router.currentRoute !== "/") {
            this.$router.push("/");
          }
        }
      };
    });
  }
};
</script>

<style>
:root {
  --menu-color: #00000045;
  --lyrics-color: white;
  --font-family: "Montserrat", sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

html {
  line-height: 1.15;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

html,
body {
  background-image: url("../public/images/bg-01.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: var(--font-family);
}

.main-vue {
  height: inherit;
}

:root::-webkit-scrollbar {
  display: none;
}

img {
  width: auto;
}

article,
aside,
footer,
header,
nav,
section {
  display: block;
}

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

button,
input,
optgroup,
select,
textarea {
  font-family: sans-serif;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}

button,
select {
  text-transform: none;
}

img {
  border-style: none;
}
</style>
