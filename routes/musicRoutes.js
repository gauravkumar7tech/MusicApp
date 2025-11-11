const express = require('express')
const router = express.Router()
const musicController = require('../controllers/musicController')

router.get('/', musicController.getAllMusic)
router.get('/add', musicController.getAddMusicForm)
router.post('/add', musicController.addMusic)
router.get('/genre/:genre', musicController.getMusicByGenre)
router.get('/random', musicController.getRandomSuggestion)

module.exports = router