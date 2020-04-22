const Song = require("../models/SongModel");
const Playlist = require("../models/PlaylistModel");

const songDBController = {
  postUpload: function (req, res) {
    Song.findOne({ url: req.body.url })
      .exec()
      .then((song) => {
        if (song) {
          res.status(409).json({
            message: "Song exists",
          });
        } else {
          const song = new Song({
            title: req.body.title,
            artist: req.body.artist,
            genre: req.body.genre,
            lyrics: req.body.lyrics,
            duration: req.body.duration,
            coverImage: req.body.coverImage,
            url: req.body.url,
          });

          song
            .save()
            .then(() => {
              res.status(201).json({
                message: "Song added",
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

  getSongs: function (req, res) {
    Song.find({
      $or: [
        { title: { $regex: req.params.query, $options: "i" } },
        { artist: { $regex: req.params.query, $options: "i" } },
      ],
    })
      .exec()
      .then((songs) => {
        res.status(200).json({
          message: "Search successful",
          songs: songs,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },

  deleteSong: function (req, res) {
    Song.findOneAndDelete({ url: req.body.url })
      .then((result) => {
        Playlist.updateMany(
          {},
          { $pull: { songs: { url: req.body.url } } },
          { new: true }
        )
          .then(
            res.status(200).json({
              message: "Song deleted and playlist updated",
            })
          )
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
  },

  getAllSongs: function (req, res) {
    Song.find({})
      .exec()
      .then((results) => {
        if (results) {
          res.status(200).json({
            results: results,
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

  updateSong: function (req, res) {
    Song.findOneAndUpdate(
      { url: req.body.url },
      {
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        lyrics: req.body.lyrics,
        duration: req.body.duration,
        coverImage: req.body.coverImage,
      },
      { new: true }
    )
      .then((result) => {
        console.log(result);
        Playlist.updateMany(
          {'songs.url' : req.body.url},
          {
            $set: {
              'songs.$': {
                title: req.body.title,
                artist: req.body.artist,
                genre: req.body.genre,
                lyrics: req.body.lyrics,
                duration: req.body.duration,
                coverImage: req.body.coverImage,
                url: req.body.url,
              },
            },
          },
          { new: true }
        )
          .then(() =>{
            res.status(200).json({
              message: "Song updated and playlist updated",
            })
          }
            
          )
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
  },
};

module.exports = songDBController;
