'use strict';
var express = require('express');
var router = express.Router();
import path from 'path';
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });
var User = require('../models/user');
var fs = require('fs');

/* GET home page. */
router.get('/', ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname,'../index.html'));
});

router.get('/rackandscore',ensureAuth, function(req,res){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "ASJASJK",
        playerRack: "erdseds"
    };
    fs.readFile('./BackPyScripts/rack.txt',function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile('./BackPyScripts/userrack.txt',function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile('./BackPyScripts/pcscore.txt',function(err,data)
            {
                state.PCScore = data.toString();
                fs.readFile('./BackPyScripts/userscore.txt',function(err,data)
                {
                    state.playerScore = data.toString();
                    console.log(state);
                    res.send(state);                
                });
            
            });

        });
    
    });

});

router.get('/board',function(req,res){
    fs.readFile('./BackPyScripts/board.txt',function(err,data){
        console.log(data);
        data = data.toString('ascii');
        console.log(data);
        for(var i=0;i<data.length;i++)
        {
            data = data.replace(/(\r\n|\n|\r)/gm,"");
        }
        console.log(data);
        res.send(data);
    });
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
