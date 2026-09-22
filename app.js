require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo').default || require('connect-mongo')
const path = require('path')

const musicRoutes = require('./routes/musicRoutes')
const authRoutes = require('./routes/authRoutes')
const { requireAuth } = require('./middleware/auth')

const app = express()
const defaultMongoUri = 'mongodb://127.0.0.1:27017/musicdb'
const mongoUri = process.env.MONGODB_URI || defaultMongoUri
const MemoryStore = session.MemoryStore || require('express-session').MemoryStore
const basePort = Number(process.env.PORT) || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

let sessionStore = null
try {
  sessionStore = MongoStore.create({
    mongoUrl: mongoUri,
    collectionName: 'sessions'
  })
} catch (error) {
  console.warn('Session store setup failed. Falling back to memory store:', error.message)
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore || new MemoryStore(),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))

const connectMongo = async () => {
  const candidateUris = [mongoUri, defaultMongoUri]
  const seen = new Set()

  for (const uri of candidateUris) {
    if (seen.has(uri)) continue
    seen.add(uri)

    try {
      console.log('Connecting to MongoDB:', uri.includes('mongodb+srv') ? 'MongoDB Atlas (Remote)' : 'Local MongoDB')
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      console.log('MongoDB connected')
      return
    } catch (err) {
      console.log(`MongoDB Error for ${uri}:`, err.message)
      if (uri === defaultMongoUri) {
        console.log('Continuing without MongoDB connection. Session storage is using memory fallback.')
      }
    }
  }
}

connectMongo()

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

const startServer = (port) => {
  const server = app.listen(port, () => console.log(`Server running on port ${port}`))

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port + 1
      console.log(`Port ${port} is busy, trying port ${nextPort}...`)
      startServer(nextPort)
      return
    }

    console.error('Server error:', err)
    process.exit(1)
  })
}

startServer(basePort)