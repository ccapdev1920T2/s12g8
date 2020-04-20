import Vue from "vue";
import Router from "vue-router";

import About from "./views/About.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import MusicPlayer from './views/MusicPlayer.vue';
import Signup from "./views/Signup.vue";
import Upload from "./views/Upload.vue";
import Database from "./views/Database.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/about",
      component: About
    },
    {
      path: "/login",
      component: Login,
      meta: {
        requiresVisitor: true
      }
    },
    {
      path: "/player",
      component: MusicPlayer,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/signup",
      component: Signup,
      meta: {
        requiresVisitor: true
      }
    },
    {
      path: "/upload",
      component: Upload,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/database",
      component: Database,
      meta: {
        requiresAuth: true
      }
    },
  ]
});
