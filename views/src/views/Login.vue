<template>
  <div class="main">
    <p class="sign" align="center">Log in</p>
    <form class="form" name="form" @submit.prevent="logUser">
      <input
        class="user_email"
        name="user_email"
        type="text"
        align="center"
        placeholder="Username or Email"
        :class="{error: errors.account}"
        v-model="userInfo.account"
      />
      <input
        class="password"
        name="password"
        type="password"
        align="center"
        placeholder="Password"
        :class="{error: errors.password}"
        v-model="userInfo.password"
      />
      <input type="submit" class="submit" name="submit" value="Log in" />
    </form>
    <p id="displayError" v-for="(message, index) in errorMessage" :key="index">{{message}}</p>
  </div>
</template>

<script>
import UserService from "../services/UserService";

export default {
  name: "login",
  data() {
    return {
      userInfo: {
        account: "",
        password: ""
      },
      errors: {
        account: false,
        password: false
      },
      errorMessage: []
    };
  },
  methods: {
    logUser: async function() {
      this.errorMessage = [];
      this.errors = {
        account: false,
        password: false
      };
      if (this.userInfo.account === "" || this.userInfo.password === "") {
        if (this.userInfo.account === ""){
          this.errors.account = true;
          this.errorMessage.push("Account cannot be blank!");
        } 
        if (this.userInfo.password === ""){
          this.errors.password = true;
          this.errorMessage.push("Password cannot be blank!");
        } 
      } else {
        await UserService.login({
          account: this.userInfo.account,
          password: this.userInfo.password
        })
          .then(res => {
            if (res.status == 200) {
              this.$store.dispatch('retrieveToken', res);
              this.$router.push("/");
            } else {
              this.errorMessage.push("Username or password is incorrect!");
            }
          })
          .catch(err => {
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
  width: 400px;
  min-height: 350px;
  margin: 10vh auto;
  border-radius: 1.5em;
  box-shadow: 0px 11px 35px 2px rgba(0, 0, 0, 0.14);
}

.error {
  border-color: rgb(241, 66, 66) !important;
}

.sign {
  padding-top: 40px;
  color: #8c55aa;
  font-family: "Ubuntu", sans-serif;
  font-weight: bold;
  font-size: 23px;
}

.user_email {
  width: 76%;
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
  margin-bottom: 50px;
  margin-left: 46px;
  text-align: center;
  margin-bottom: 27px;
  font-family: "Ubuntu", sans-serif;
}

form.form {
  padding-top: 14px;
}

.password {
  width: 76%;
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
  margin-bottom: 50px;
  margin-left: 46px;
  text-align: center;
  margin-bottom: 27px;
  font-family: "Ubuntu", sans-serif;
}

.user_email:focus,
.password:focus {
  border: 2px solid rgba(0, 0, 0, 0.18) !important;
}

.submit {
  margin-top: 14px;
  margin-bottom: 10px;
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
  margin-left: 35%;
  font-size: 13px;
  box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.04);
  text-shadow: 0px 0px 3px rgba(117, 117, 117, 0.12);
  color: #e1bee7;
  text-decoration: none;
}

#displayError {
  color: red;
  font-size: 16px;
  margin: 0px 0px 0px 50px;
  padding: 0 0 25px 0;
}

@media (max-width: 600px) {
  .main {
    border-radius: 0px;
  }
}
</style>