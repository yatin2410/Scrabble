'use strict';
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/register', ensureAuth, function (req, res) {
    res.render('register');
});

router.get('/login', ensureAuth, function (req, res) {
    res.render('login');
});

router.get('/forgetpass', ensureAuth, function (req, res) {
    res.render('forgetpass');
});


function ensureAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/')
    }
}


router.post('/register', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.confirm_password;

    console.log(name + " " + email + " " + username + " " + password + " " + password2);

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Valid Email is required').isEmail();
    req.checkBody('username', 'UserName is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm_password', 'Password do not match').equals(password);

    var errors = req.validationErrors();

    if (errors) {

        res.render('register', {
            errors: errors
        });

    }
    
    else {
       
        User.find({ email: email }, function (err, docs) {
            if (docs.length) {
                var emailerr = "Email is already used!";
                res.render('register', {
                    emailerr: emailerr
                });
            }

            else {

                User.find({ username: username }, function (err, docs) {
                    if (docs.length) {
                        var usernameerr = "UserName is already taken!";
                        res.render('register', {
                            usernameerr: usernameerr
                        });
                    }

                    else {

                        var newUser = new User({
                            name: name,
                            email: email,
                            username: username,
                            password: password
                        });

                        User.createUser(newUser, function (err, user) {
                            if (err) throw err;
                            console.log(user);
                        });

                        req.flash('success_msg', 'You are registered and can now login in');
                        res.redirect('/users/login');

                    }
                });

            }

        });

    }


});


passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch)
                    return done(null, user);
                else
                    return done(null, false, { message: 'Invalid Password' });

            });

        });

    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function (req, res) {
        res.redirect('/');
    }
);

router.get('/logout', ensureAuthLogout, function (req, res) {
    req.logout();
    req.flash('success_msg', 'You successfully logeged out');

    res.redirect('/users/login');
});

function ensureAuthLogout(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/users/login')
    }
}


router.post('/forgetpass', function (req, res) {
    var email = req.body.email;

    req.checkBody('email', 'Valid Email is required').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        res.render('forgetpass', {
            errors: errors
        });
    }

    else {

        User.find({ email: email }, function (err, docs) {
            if (docs.length) {

                console.log(docs);

                //TODO: add code for sent email for change password

                var messg = 'Password Change link is sent to Your Email';
                res.render('login', {
                    messg: messg
                });

            }

            else {
                var err = "Email is not found please register first!!";
                res.render('register', {
                    err: err
                });
            }
        });
    }

});



module.exports = router;
