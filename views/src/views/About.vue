<template>
  <div class="about">
    <div class="table_box">
      <ul>
        <li class="items clearfix border-top">
          <span class="title">Server Packages</span>
        </li>
        <li class="items clearfix border-top">
          <span class="package">
            <b>Package</b>
          </span>
          <span class="version">
            <b>Version</b>
          </span>
        </li>
        <li class="items clearfix border-top" v-for="(item, index) in serverPackages" :key="index">
          <span class="package">{{ item.name }}</span>
          <span class="version">{{ item.version }}</span>
        </li>
      </ul>
      <ul>
        <li class="items clearfix border-top">
          <span class="title">Client Packages</span>
        </li>
        <li class="items clearfix border-top">
          <span class="package">
            <b>Package</b>
          </span>
          <span class="version">
            <b>Version</b>
          </span>
        </li>
        <li class="items clearfix border-top" v-for="(item, index) in clientPackages" :key="index">
          <span class="package">{{ item.name }}</span>
          <span class="version">{{ item.version }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      serverPackages: [
        {
          name: "brcrypt",
          version: "^4.0.1"
        },
        {
          name: "cors",
          version: "^2.8.5"
        },
        {
          name: "express",
          version: "^4.17.1"
        },
        {
          name: "jsonwebtoken",
          version: "^8.5.1"
        },
        {
          name: "mongoose",
          version: "^5.9.7"
        },
        {
          name: "nodemon",
          version: "^2.0.2"
        }
      ],
      clientPackages: [
        {
          name: "axios",
          version: "^0.19.2"
        },
        {
          name: "core-js",
          version: "^3.6.4"
        },
        {
          name: "validator",
          version: "^13.0.0"
        },
        {
          name: "vue",
          version: "^2.6.11"
        },
        {
          name: "vue-router",
          version: "^3.1.6"
        },
        {
          name: "vuex",
          version: "^3.1.3"
        },
        {
          name: "@vue/cli-plugin-babel",
          version: "~4.3.0"
        },
        {
          name: "@vue/cli-plugin-eslint",
          version: "~4.3.0"
        },
        {
          name: "@vue/cli-service",
          version: "~4.3.0"
        },
        {
          name: "babel-eslint",
          version: "^10.1.0"
        },
        {
          name: "eslint",
          version: "^6.7.2"
        },
        {
          name: "eslint-plugin-vue",
          version: "^6.2.2"
        },
        {
          name: "vue-template-compiler",
          version: "^2.6.11"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  text-align: center;
}

.table_box {
  display: inline-block;
  width: 800px;
  height: 100%;
}
.table_box ul {
  margin: 0;
  padding: 0;
}

.items {
  height: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  line-height: 50px;
  color: rgba(225, 225, 225, 0.8);
  display: flex;
  justify-content: center;
}

.items span.package {
  float: left;
  width: 350px;
  text-overflow: ellipsis;
}
.items span.version {
  float: left;
  width: 350px;
  text-overflow: ellipsis;
}
.items span.title {
  float: left;
  width: 700px;
  text-overflow: ellipsis;
}
.clearfix:after {
  content: "";
  clear: both;
  display: block;
}
.border-top {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
</style>