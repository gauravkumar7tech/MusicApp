const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.getLogin = (req, res) => {
  res.render('login', { error: null })
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.render('login', { error: 'Invalid username or password' })
    }
    req.session.user = { id: user._id, username: user.username }
    res.redirect('/music')
  } catch (err) {
    res.render('login', { error: 'Login failed. Please try again.' })
  }
}

exports.getRegister = (req, res) => {
  res.render('register', { error: null })
}

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      return res.render('register', { error: 'Passwords do not match' })
    }
    const existing = await User.findOne({ username })
    if (existing) {
      return res.render('register', { error: 'Username already exists' })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hash })
    await user.save()
    res.redirect('/auth/login')
  } catch (err) {
    res.render('register', { error: 'Registration failed. Please try again.' })
  }
}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
}
