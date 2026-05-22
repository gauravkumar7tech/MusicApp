const Music = require('../models/Music')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/songs/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

const musicController = {
  getAllMusic: async (req, res) => {
    try {
      const music = await Music.find().sort({ createdAt: -1 })
      const likedIds = req.session.likedSongs || []
      res.render('index', { music, likedIds })
    } catch (error) {
      res.status(500).render('error', { error: error.message })
    }
  },

  getMusicByGenre: async (req, res) => {
    try {
      const { genre } = req.params
      const music = await Music.find({ genre: new RegExp(genre, 'i') }).sort({ createdAt: -1 })
      const likedIds = req.session.likedSongs || []
      res.render('genre-suggestions', { music, genre: genre.charAt(0).toUpperCase() + genre.slice(1), likedIds })
    } catch (error) {
      res.status(500).render('error', { error: error.message })
    }
  },

  getAddMusicForm: (req, res) => res.render('add-music'),

  addMusic: async (req, res) => {
    try {
      const music = new Music({ ...req.body, audioFile: req.file ? req.file.filename : null })
      await music.save()
      res.redirect('/music')
    } catch (error) {
      res.status(400).render('add-music', { error: error.message })
    }
  },

  getRandomSuggestion: async (req, res) => {
    try {
      const count = await Music.countDocuments()
      if (count === 0) return res.render('random-suggestion', { music: null })
      const music = await Music.findOne().skip(Math.floor(Math.random() * count))
      res.render('random-suggestion', { music })
    } catch (error) {
      res.status(500).render('error', { error: error.message })
    }
  },

  // Search: JSON for dropdown, HTML for full results page
  search: async (req, res) => {
    try {
      const q = (req.query.q || '').trim()
      if (!q) return res.json([])
      const regex = new RegExp(q, 'i')
      const music = await Music.find({
        $or: [{ title: regex }, { artist: regex }, { genre: regex }]
      }).limit(20)
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(music)
      }
      const likedIds = req.session.likedSongs || []
      res.render('search-results', { music, query: q, likedIds })
    } catch (error) {
      res.status(500).render('error', { error: error.message })
    }
  },

  // Artist page
  getArtist: async (req, res) => {
    try {
      const artist = decodeURIComponent(req.params.name)
      const music = await Music.find({ artist: new RegExp(`^${artist}$`, 'i') }).sort({ year: -1 })
      const likedIds = req.session.likedSongs || []
      res.render('artist', { music, artist, likedIds })
    } catch (error) {
      res.status(500).render('error', { error: error.message })
    }
  },

  // Toggle like
  toggleLike: (req, res) => {
    const { id } = req.params
    if (!req.session.likedSongs) req.session.likedSongs = []
    const idx = req.session.likedSongs.indexOf(id)
    if (idx === -1) {
      req.session.likedSongs.push(id)
    } else {
      req.session.likedSongs.splice(idx, 1)
    }
    res.json({ liked: idx === -1, total: req.session.likedSongs.length })
  },

  // My Library (liked songs)
  getLibrary: async (req, res) => {
    try {
      const likedIds = req.session.likedSongs || []
      const music = likedIds.length ? await Music.find({ _id: { $in: likedIds } }) : []
      res.render('library', { music, likedIds })
    } catch (error) {
      res.status(500).render('error', { error: error.message })
    }
  },

  // ── Feature 1: Vibe Matcher — filter by mood ──
  vibeMatcher: async (req, res) => {
    try {
      const mood = (req.query.mood || '').trim().toLowerCase()
      if (!mood) return res.json({ songs: [], message: 'Please select a mood.' })
      // Derive mood from stored field OR fall back to genre mapping
      const GENRE_MOOD = { rock:'intense', electronic:'upbeat', jazz:'chill', classical:'melancholic', pop:'upbeat', hiphop:'intense', ballad:'melancholic', punjabi:'upbeat', haryanvi:'intense' }
      const all = await Music.find().lean()
      const songs = all.filter(s => {
        const m = s.mood || GENRE_MOOD[s.genre && s.genre.toLowerCase()] || 'chill'
        return m === mood
      })
      if (!songs.length) return res.json({ songs: [], message: `No tracks found for mood "${mood}". Try another vibe!` })
      res.json({ songs })
    } catch (e) {
      res.status(500).json({ songs: [], message: e.message })
    }
  },

  // ── Feature 2: Auto-Queue — next song by genre similarity (20% random jump) ──
  autoQueue: async (req, res) => {
    try {
      const { currentId } = req.query
      const current = await Music.findById(currentId).lean()
      if (!current) return res.status(404).json({ error: 'Track not found' })
      const all = await Music.find({ _id: { $ne: currentId } }).lean()
      if (!all.length) return res.json(null)
      // 20% chance of random genre jump
      const useRandom = Math.random() < 0.2
      const pool = useRandom ? all : all.filter(s => s.genre === current.genre)
      const next = (pool.length ? pool : all)[Math.floor(Math.random() * (pool.length || all.length))]
      res.json(next)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  },

  // ── Feature 5: Chaos-to-Calm sorted playlist ──
  chaosToCalm: async (req, res) => {
    try {
      const ENERGY_MAP = {
        'victims of chaos': 10, 'brother': 9, 'manimal': 9, 'scarwhores': 8,
        'throne': 8, 'ateraxia': 7, 'j5': 7, 'billo bagge': 6,
        'get away': 5, 'highschool funeral': 4, 'neruda': 3, 'solitude': 2
      }
      const all = await Music.find().lean()
      const sorted = all.sort((a, b) => {
        const ea = a.energy || ENERGY_MAP[a.title.toLowerCase()] || 5
        const eb = b.energy || ENERGY_MAP[b.title.toLowerCase()] || 5
        return eb - ea  // high energy first
      })
      res.json(sorted)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}

musicController.upload = upload
module.exports = musicController
