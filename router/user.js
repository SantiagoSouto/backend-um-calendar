const express = require('express');
const router = express.Router();
const passportConfig = require('../config/passport.js');
const userController = require('../controllers/user');

router.get('/', passportConfig.isAuthenticated, (req, res) => {
    res.json(req.user);
});

router.get('/subjects', passportConfig.isAuthenticated, userController.getAllSubjects);

router.put('/subject/:name', passportConfig.isAuthenticated, userController.putSubject);

// Auth
router.post('/signup', userController.postSignUp);
router.post('/login', userController.postLogin);
router.get('/logout', passportConfig.isAuthenticated, userController.logout);

// Admin
router.get('/admin', passportConfig.isAdmin, (req, res) => res.send("Hola Admin!"));

module.exports = router;