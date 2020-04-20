const express = require ('express');
const router = express.Router();
const playlistController = require ('../controllers/playlistController');

router.get('/:username', playlistController.getPlaylist);

router.post('/add', playlistController.addSongToPlaylist);

router.patch('/delete', playlistController.removeFromPlaylist);

router.post('/edit', playlistController.updatePlaylistName);

module.exports = router;