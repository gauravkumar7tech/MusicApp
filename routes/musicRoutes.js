const express = require('express')
const router = express.Router()
const musicController = require('../controllers/musicController')

router.get('/', musicController.getAllMusic)
router.get('/add', musicController.getAddMusicForm)
router.post('/add', musicController.upload.single('audioFile'), musicController.addMusic)
router.get('/genre/:genre', musicController.getMusicByGenre)
router.get('/random', musicController.getRandomSuggestion)
router.get('/search', musicController.search)
router.get('/artist/:name', musicController.getArtist)
router.post('/like/:id', musicController.toggleLike)
router.get('/library', musicController.getLibrary)

module.exports = router
