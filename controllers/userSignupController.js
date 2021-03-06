const User = require("../models/UserModel.js");
const Playlist = require("../models/PlaylistModel");
// const db = require('../models/db.js');
const bcrypt = require("bcrypt");

const userSignupController = {
  postSignUp: function (req, res) {
    User.findOne({
      $or: [{ email: req.body.account }, { username: req.body.account }],
    })
      .exec()
      .then((user) => {
        if (user) {
          res.status(409).json({
            message: "E-Mail exists",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const user = new User({
                email: req.body.email,
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
              });
              user
                .save()
                .then((result) => {
                  var arr = [];
                  const playlist = new Playlist({
                    username: req.body.username,
                    playlistName: "playlist",
                    songs: arr,
                  });

                  playlist
                    .save()
                    .then((result) => {
                      res.status(201).json({
                        message: "User and playlist created",
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(500).json({
                        error: err,
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
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

  deleteUser: function (req, res) {
    User.remove({ username: req.params.username })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "User deleted",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },
};

module.exports = userSignupController;
