'use strict';
var express = require('express');
var router = express.Router();
import path from 'path';
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });
var User = require('../models/user');

/* GET home page. */
router.get('/', ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname,'../index.html'));
});

function ensureAuth(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/users/login');
    }
}

module.exports = router;
