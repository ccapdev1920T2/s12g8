const express = require ('express');
const router = express.Router();
const songDBController = require ('../controllers/songDBController');

router.post('/upload', songDBController.postUpload);

router.get('/search/:query', songDBController.getSongs);

router.get('/list', songDBController.getAllSongs);

router.delete('/delete/:url', songDBController.deleteSong);

router.patch('/update', songDBController.updateSong);

module.exports = router;