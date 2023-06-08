const Subject = require('../models/Subject');

exports.postCreateSubject = ((req, res, next) => {
    const newSubject = new Subject({
        name: req.body.name,
        career: req.body.career,
        year: req.body.year
    });

    // Verify subject does not exists in database
    Subject.findOne({name: req.body.name}).then(subjectExists => {
        if (subjectExists) {
            return res.status(400).send('Esa materia esta registrada.');
        }
        newSubject.save().then(() => {
            res.send('Materia creada exitosamente');
        }).catch((err) => next(err));
    }).catch(err => res.send(500).send('Ocurrio un problema inesperado.'))
});