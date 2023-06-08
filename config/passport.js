const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// match mongodb and session
passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    }).catch(err => done(err, null));
})

// Verification email and password matching process
passport.use(new LocalStrategy(
    {usernameField: 'email'},
    (email, password, done) => {
        User.findOne({email}).then((user) => {
            if (!user) {
                return done(null, false, {message: `Este email: ${email} no esta registrado`});
            } else {
                user.comparePassword(password, (err, theyMatch) => {
                    if (theyMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'La contraseña no es válida'});
                    }
                });
            }
        })
    }
))

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Tienes que hacer login para acceder a este recurso.');
}

exports.isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    }
    res.status(403).send('Tienes que ser administrador para acceder a este recurso.');
}