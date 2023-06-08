const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Event = require('../models/Event');
const subjectController = require('../controllers/subject');

router.get('/:name', (req, res) => {
    Subject.findOne({name: req.params.name}).then(subject => {
        if (subject != null) {
            res.json(subject);
        } else {
            res.status(404).send(`No se encontro la materia: ${req.params.name}`);
        }
    }).catch(err => res.status(500).send('Ocurrio un error.'));
});

router.get('/:name/events', (req, res) => {
    const events = [];
    Subject.findOne({name: req.params.name})
    .then(subject => {
        if (subject != null) {
            const promises = subject.events.map(event => Event.findById(event));
            return Promise.all(promises);
        } else {
            res.status(404).send(`No se encontro la materia: ${req.params.name}`);
        }
    })
    .then(foundEvents => {
        events.push(...foundEvents);
        res.send(events);
    })
    .catch(err => res.status(500).send('Ocurrio un error.'));
})

router.post('/', subjectController.postCreateSubject);

module.exports = router;