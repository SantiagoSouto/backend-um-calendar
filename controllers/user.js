const passport = require('passport');
const User = require('../models/User');
const Subject = require('../models/Subject');
const { isAdmin } = require('../config/passport');

exports.postSignUp = (req, res, next) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin ? true : false
    });

    // Verify user has UM email syntax
    const emailRegex = /[a-zA-Z0-9]+@((correo.)?(um.))+edu.uy/;
    if (!emailRegex.test(newUser.email)) {
        return res.status(412).send('Ese email no pertenece a la UM.');
    }

    // Verify user does not exists in database
    User.findOne({email: req.body.email}).then(userExists => {
        if (userExists) {
            return res.status(409).send('Ese email esta registrado.');
        }
        newUser.save().then(() => {
            req.logIn(newUser, (err) => {
                if (err) {
                    next(err);
                }
                res.send('Usuario creado exitosamente');
            })
        }).catch((err) => next(err));
    }).catch(err => res.send(500).send('Ocurrio un problema inesperado.'))
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err);
        }
        if (!user) {
            return res.status(400).send('Email o contraseña no válidos');
        }
        req.logIn(user, (err) => {
            if (err) {
                next(err);
            }
            res.send('Login exitoso');
        })
    })(req, res, next);
}

exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { 
            return next(err); 
        }
    });
    res.send('Logout exitoso.');
}

exports.putSubject = (req, res) => {
    const subjectName = req.params.name;
    Subject.findOne({name: subjectName}).then(subject => {
        if (subject == null) {
            res.status(404).send(`${subjectName} no se ingreso como materia al sistema.`);
        }
        req.user.subjects = [...req.user.subjects, subject._id];
        req.user.save();
        res.json(req.user);
    })
}

exports.getAllSubjects = (req, res) => {
    const subjects = [];
    const promises = req.user.subjects.map(subject => Subject.findById(subject));
    Promise.all(promises).then(foundSubjects => {
        subjects.push(...foundSubjects);
        res.send(subjects);
    }).catch(err => res.status(500).send('Ocurrio un error.'));
}