const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const eventController = require('../controllers/event');

// router.get('/:name', (req, res) => {
//     Subject.findOne({name: req.params.name}).then(subject => {
//         if (subject) {
//             res.json(subject);
//         } else {
//             res.status(404).send(`No se encontro la materia: ${req.params.name}`);
//         }
//     }).catch(err => res.status(500).send('Ocurrio un error.'));
// });

router.post('/', eventController.postCreateEvent);

module.exports = router;