const Playlist = require("../models/PlaylistModel");

const playlistController = {
  updatePlaylistName: function(req, res) {
    Playlist.findOne({ username: req.body.username })
      .exec()
      .then((result) => {
        if (result) {
          Playlist.updateOne(
            { username: req.body.username },
            { $set: { playlistName: req.body.name }}
          )
            .then(
              res.status(200).json({
                message: "Playlist updated",
              })
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
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

  getPlaylist: function (req, res) {
    Playlist.findOne({ username: req.params.username })
      .exec()
      .then((result) => {
        if (result)
          res.status(200).json({
            message: "Search successful",
            result: result,
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },

  addSongToPlaylist: function (req, res) {
    Playlist.findOne({ username: req.body.username })
      .exec()
      .then((result) => {
        if (result) {
          Playlist.updateOne(
            { username: req.body.username },
            { $push: { songs: req.body.song } }
          )
            .then(
              res.status(200).json({
                message: "Playlist updated",
              })
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        } else {
          var arr = [req.body.song];
          const playlist = new Playlist({
            username: req.body.username,
            playlistName: "playlist",
            songs: arr,
          });

          playlist
            .save()
            .then((result) => {
              res.status(201).json({
                message: "Playlist created",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
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
  
  removeFromPlaylist: function (req, res) {
    Playlist.findOne({ username: req.body.username })
      .exec()
      .then((result) => {
        if (result) {
          Playlist.updateOne(
            { username: req.body.username },
            { $pull: { songs: req.body.song } }
          )
            .then(
              res.status(200).json({
                message: "Playlist updated",
              })
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
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

module.exports = playlistController;
