<template>
  <div class="main">
    <p class="sign" align="center">Registration</p>
    <form id="signup" class="form" name="form" @submit.prevent="checkForm">
      <label for="fname"></label>
      <br />
      <input
        type="text"
        :class="{error: errors.firstName}"
        v-model="newUser.firstName"
        name="fname"
        id="fname"
        align="center"
        placeholder="First Name"
      />
      <label for="lname"></label>
      <input
        type="text"
        :class="{error: errors.lastName}"
        v-model="newUser.lastName"
        name="lname"
        id="lname"
        align="center"
        placeholder="Last Name"
      />
      <label for="email"></label>
      <input
        type="text"
        :class="{error: errors.email}"
        v-model="newUser.email"
        name="email"
        id="email"
        align="center"
        placeholder="Email"
      />
      <label for="uname"></label>
      <input
        type="text"
        :class="{error: errors.username}"
        v-model="newUser.username"
        name="uname"
        id="uname"
        align="center"
        placeholder="Username"
      />
      <label for="pw"></label>
      <input
        type="password"
        :class="{error: errors.password}"
        v-model="newUser.password"
        name="pw"
        id="pw"
        align="center"
        placeholder="Password (at least 6 characters)"
      />
      <label for="cpw"></label>
      <input
        type="password"
        :class="{error: errors.confirmPW}"
        v-model="newUser.confirmPW"
        name="cpw"
        id="cpw"
        align="center"
        placeholder="Confirm Password"
      />
      <input type="submit" class="submit" id="submit" value="Sign Up" />
    </form>
    <p id="displayError" v-for="(message, index) in errorMessage" :key="index">{{message}}</p>
  </div>
</template>

<script>
import validator from "validator";
import UserService from "../services/UserService";

export default {
  name: "signup",
  data() {
    return {
      newUser: {
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPW: ""
      },
      errors: {
        email: false,
        username: false,
        firstName: false,
        lastName: false,
        password: false,
        confirmPW: false
      },
      errorMessage: []
    };
  },
  methods: {
    checkForm: async function() {
      this.errorMessage = [];
      this.errors = {
        email: false,
        username: false,
        firstName: false,
        lastName: false,
        password: false,
        confirmPW: false
      };
      if (this.newUser.firstName == "") {
        this.errors.firstName = true;
        this.errorMessage.push("First name cannot be blank!");
      }
      if (this.newUser.lastName == "") {
        this.errors.lastName = true;
        this.errorMessage.push("Last name cannot be blank!");
      }
      if (!validator.isEmail(this.newUser.email)) {
        this.errors.email = true;
        this.errorMessage.push("Email is invalid!");
      } else if (this.newUser.email == "") {
        this.errors.email = true;
        this.errorMessage.push("Email cannot be blank!");
      }
      if (this.newUser.username == "") {
        this.errors.username = true;
        this.errorMessage.push("Username cannot be blank!");
      }
      if (this.newUser.password == "") {
        this.errors.password = true;
        this.errorMessage.push("Password cannot be blank!");
      } else if (
        !validator.isLength(this.newUser.password, { min: 6, max: 128 })
      ) {
        this.errors.password = true;
        this.errorMessage.push("Password too short! (minimum of 6 alphanumeric characters)");
      } else if (this.newUser.password != this.newUser.confirmPW) {
        this.errors.confirmPW = true;
        this.errors.password = true;
        this.errorMessage.push("Password didn't match!");
      }

      if (
        this.errors.email === false &&
        this.errors.firstName === false &&
        this.errors.lastName === false &&
        this.errors.password === false &&
        this.errors.confirmPW === false
      ) {
        await UserService.addUser({
          email: this.newUser.email,
          username: this.newUser.username,
          firstName: this.newUser.firstName,
          lastName: this.newUser.lastName,
          password: this.newUser.password
        })
          .then(res => {
            if (res.status == 201) this.$router.push("/login");
            else {
              this.errorMessage.push("Email or username exists!");
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
  width: 600px;
  min-height: 525px;
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

.error {
  border-color: rgb(241, 66, 66) !important;
}

#fname {
  width: 40%;
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
  margin-right: -27px;
  text-align: center;
  margin-bottom: 27px;
  font-family: "Ubuntu", sans-serif;
}

#lname {
  width: 40%;
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

#email {
  width: 84%;
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

#uname {
  width: 84%;
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

#pw {
  width: 84%;
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

#cpw {
  width: 84%;
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
  margin-left: 39%;
  margin-bottom: 10px;
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
  padding: 0px 0px 25px 0px;
}

@media (max-width: 600px) {
  .main {
    border-radius: 0px;
  }
}
</style>