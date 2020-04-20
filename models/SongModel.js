const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    genre: [{
        type: String,
        required: true
    }],
    lyrics: [{
        type: String,
    }],
    duration: {
        type: Number,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const Song = mongoose.model("Song", SongSchema);
module.exports = Song;