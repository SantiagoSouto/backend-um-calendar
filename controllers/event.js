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

exports.getAllEvents = (req, res) => {
    Event.find({})
    .then(events => {
        if (events != null) {
            res.send(events)
        } else {
            res.status(404).send('No se encontraron eventos.');
        }
    })
    .catch(err => res.status(500).send('Ocurrio un error.'));
}

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
    if (newEvent.subject) {
        Event.findById(req.body._id)
        .then(oldEvent => {
            const oldSubject = oldEvent.subject;
            Subject.findById(oldSubject)
            .then(subject => {
                subject.events = subject.events.filter(event =>  event != req.body._id);
                subject.save();
            })
            .catch(err => res.status(500).send('Ocurrio un error.'))
        })
        .then(() => {
            Subject.findOne({name: newEvent.subject}).then(subject => {
                if (subject === null) {
                    res.status(404).send(`${newEvent.subject} no se ingreso como materia al sistema.`);
                } else {
                    newEvent.subject = subject._id;
                    Event.findByIdAndUpdate(req.body._id, req.body)
                    .then((doc) => {
                        if (doc != null) {
                            subject.events = [...subject.events, req.body._id]
                            subject.save()
                                .then(() => res.send('Evento actualizado'))
                                .catch(err => res.status(500).send('Ocurrio un error.'))
                        } else {
                            res.status(400).send(`Ocurrio un error actualizando el evento`);
                        }
                    }).catch(err => res.status(500).send('Ocurrio un error.'));
                }
            }).catch(err => res.status(500).send('Ocurrio un error.'));
        })
    } else {
        Event.findByIdAndUpdate(req.body._id, req.body)
        .then((doc) => {
            if (doc != null) {
                res.send('Evento actualizado')
            } else {
                res.status(400).send(`Ocurrio un error actualizando el evento`);
            }
        }).catch(err => res.status(500).send('Ocurrio un error.'));
    }
}

exports.deleteEvent = (req, res) => {
    const eventId = req.body._id;

    Event.findByIdAndDelete(eventId).then(event => {
        if (event === null) {
            res.status(404).send('El evento ya no existe.');
        } else {
            Subject.find({events: { $elemMatch: {$eq: eventId} }})
            .then(subjects => {
                subjects.forEach(sub => {
                    sub.events = sub.events.filter(event =>  event != eventId);
                    sub.save()
                });
            })
            .catch(err => res.status(500).send('Ocurrio un error.'))
            .finally(() => res.send('Evento eliminado correctamente.'))
            
        }
    }).catch(err => res.status(500).send('Ocurrio un error.'));
}