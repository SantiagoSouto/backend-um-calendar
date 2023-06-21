const Event = require('../models/Event');
const Subject = require('../models/Subject');

exports.postCreateEvent = ((req, res, next) => {

    const subjectName = req.body.subject;
    // Date: YYYY-MM-DDTHH:MM:SS
    const date = new Date(`${req.body.date}T${req.body.time}:00`);

    // Verify subject exists
    Subject.findOne({name: subjectName}).then(subject => {
        if (subject == null) {
            res.status(404).send(`${subjectName} no se ingreso como materia al sistema.`);
        }
        // Verify event is not duplicated
        Event.findOne({date: date, eventType: req.body.type, subject: subject._id}).then(eventExists => {
            if (eventExists) {
                res.status(409).send('Esta materia ya tiene este evento agregado')
            } else {
                const newEvent = new Event({
                    name: req.body.name,
                    date: date,
                    eventType: req.body.type,
                    subject: subject._id
                });
                // Save event
                newEvent.save().then((event) => {
                    subject.events = [...subject.events, event._id];
                    subject.save();
                    res.send('Evento creado exitosamente')
                }).catch((err) => next(err));
            }
        }).catch(err => res.send(500).send('Ocurrio un problema inesperado.'))
    }).catch(err => res.send(500).send('Ocurrio un problema inesperado.'));
});

exports.getApprovedEvents = (req, res) => {
    Event.find({approved: true})
    .then(events => {
        if (events != null) {
            res.send(events)
        } else {
            res.status(404).send('No se encontraron eventos aprovados.');
        }
    })
    .catch(err => res.status(500).send('Ocurrio un error.'));
}

exports.getPendingEvents = (req, res) => {
    Event.find({approved: false})
    .then(events => {
        if (events != null) {
            res.send(events)
        } else {
            res.status(404).send('No se encontraron eventos pendientes.');
        }
    })
    .catch(err => res.status(500).send('Ocurrio un error.'));
}

exports.updateEvent = (req, res) => {
    const newEvent = req.body;
    Subject.findOne({name: newEvent.subject}).then(subject => {
        if (subject === null) {
            res.status(404).send(`${newEvent.subject} no se ingreso como materia al sistema.`);
        } else {
            newEvent.subject = subject._id;
            Event.findByIdAndUpdate(req.body._id, req.body)
            .then((doc) => {
                if (doc != null) {
                    res.send('Evento actualizado');
                } else {
                    res.status(400).send(`Ocurrio un error actualizando el evento`);
                }
            });
        }
    });
}