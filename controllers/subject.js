const Subject = require('../models/Subject');
const Event = require('../models/Event');

exports.postCreateSubject = (req, res) => {
    const newSubject = new Subject({
        name: req.body.name,
        career: req.body.career,
        year: req.body.year
    });

    // Verify subject does not exists in database
    Subject.findOne({name: req.body.name}).then(subjectExists => {
        if (subjectExists) {
            return res.status(409).send('Esa materia esta registrada.');
        }
        newSubject.save().then(() => {
            res.send('Materia creada exitosamente');
        }).catch((err) => res.status(400).send(`Ocurrio un error al guardar en la base de datos: ${err}`));
    }).catch(err => res.send(500).send('Ocurrio un problema inesperado.'))
}

exports.getByName = (req, res) => {
    Subject.findOne({name: req.params.name}).then(subject => {
        if (subject != null) {
            res.json(subject);
        } else {
            res.status(404).send(`No se encontro la materia: ${req.params.name}`);
        }
    }).catch(err => res.status(500).send('Ocurrio un error.'));
}

exports.getById = (req, res) => {
    Subject.findById(req.params.id).then(subject => {
        if (subject != null) {
            res.json(subject);
        } else {
            res.status(404).send(`No se encontro la materia: ${req.params.id}`);
        }
    }).catch(err => res.status(500).send('Ocurrio un error.'));
}

exports.getAllSubjects = (req, res) => {
    Subject.find({})
    .then(subjects => {
        if (subjects != null) {
            res.send(subjects)
        } else {
            res.status(404).send('No se encontraron materias.');
        }
    })
    .catch(err => res.status(500).send('Ocurrio un error.'));
}

exports.getAllEvents = (req, res) => {
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
}