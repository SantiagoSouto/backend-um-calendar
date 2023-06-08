const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Event = require('../models/Event');
const subjectController = require('../controllers/subject');

router.get('/:name', subjectController.getByName);

router.get('/:name/events', subjectController.getAllEvents);

router.post('/', subjectController.postCreateSubject);

module.exports = router;