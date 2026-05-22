const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo').default || require('connect-mongo')
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
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/musicdb',
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7  
  }
}))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/musicdb', {
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

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}...`)
    app.listen(PORT + 1, () => console.log(`Server running on port ${PORT + 1}`))
  }
})