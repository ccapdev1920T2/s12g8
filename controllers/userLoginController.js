const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_key = "secret";

const userLoginController = {
  postLogin: function (req, res) {
    User.findOne({$or: [{ email: req.body.account }, {username: req.body.account}]})
      .exec()
      .then((user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              return res.status(401).json({
                message: "Authentication failed!",
              });
            }

            if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                },
                jwt_key,
                {
                  expiresIn: "2h",
                }
              );
              return res.status(200).json({
                message: "Authentication success!",
                token: token,
                user: user
              });
            } else {
              return res.status(401).json({
                message: "Authentication failed!",
              });
            }
          });
        } else {
          return res.status(401).json({
            message: "Authentication failed!",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },
};

module.exports = userLoginController;
