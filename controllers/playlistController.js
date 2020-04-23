const Playlist = require("../models/PlaylistModel");

const playlistController = {
  updatePlaylistName: function (req, res) {
    Playlist.findOne({ username: req.body.username })
      .exec()
      .then((result) => {
        if (result) {
          Playlist.updateOne(
            { username: req.body.username },
            { $set: { playlistName: req.body.name } }
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
    Playlist.findOneAndUpdate(
      { username: req.body.username },
      {
        $push: {
          songs: {
            title: req.body.song.title,
            artist: req.body.song.artist,
            genre: req.body.song.genre,
            lyrics: req.body.song.lyrics,
            duration: req.body.song.duration,
            coverImage: req.body.song.coverImage,
            url: req.body.song.url,
          },
        },
      }
    )
      .exec()
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: "Playlist updated",
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
            { $pull: { songs: { url: req.body.song.url } } }
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
