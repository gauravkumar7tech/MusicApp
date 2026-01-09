const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { redirectIfLoggedIn } = require('../middleware/auth')

router.get('/login', redirectIfLoggedIn, authController.getLogin)
router.post('/login', authController.login)
router.get('/register', redirectIfLoggedIn, authController.getRegister)
router.post('/register', authController.register)
router.get('/logout', authController.logout)

module.exports = router
