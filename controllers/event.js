const Event = require('../models/Event');
const Subject = require('../models/Subject');

exports.postCreateEvent = ((req, res, next) => {

    const subjectName = req.body.subject;
    // Date: YYYY-MM-DDTHH:MM:SS-03:00
    const date = new Date(`${req.body.date}T${req.body.time}:00-03:00`);

    // Verify subject exists
    Subject.findOne({name: subjectName}).then(subject => {
        if (subject == null) {
            res.status(404).send(`${subjectName} no se ingreso como materia al sistema.`);
        }
        // Verify event is not duplicated
        Event.findOne({date: date, eventType: req.body.type, subject: subject._id}).then(eventExists => {
            if (eventExists) {
                res.status(409).send('Esta materia ya tiene este evento agregado')
            }
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
        }).catch(err => res.send(500).send('Ocurrio un problema inesperado.'))
    }).catch(err => res.send(500).send('Ocurrio un problema inesperado.'));
});