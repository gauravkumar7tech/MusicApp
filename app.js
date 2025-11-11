const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const path = require('path')

const musicRoutes = require('./routes/musicRoutes')
const authRoutes = require('./routes/authRoutes')
const { requireAuth } = require('./middleware/auth')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}))

mongoose.connect('mongodb://127.0.0.1:27017/musicdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// Root route redirects to register
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/music')
  } else {
    res.redirect('/auth/register')
  }
})

app.use('/auth', authRoutes)
app.use('/music', requireAuth, musicRoutes)

app.use((req, res) => {
  res.status(404).render('error', { error: 'Page not found' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))