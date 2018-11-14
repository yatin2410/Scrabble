'use strict';
var express = require('express');
var router = express.Router();
import path from 'path';
import { stat } from 'fs';
import { func } from 'prop-types';
var fs = require('fs');
/* GET home page. */
router.get('/', ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname,'../index.html'));
});

function renderHeader(res){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "",
        playerRack: ""
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

}


function renderAll(res){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "",
        playerRack: "",
        board:"",
    };
    fs.readFile('./BackPyScripts/rack.txt',function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile('./BackPyScripts/userrack.txt',function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile('./BackPyScripts/pcscore.txt',function(err,data)
            {
                console.log('pcscore',data.toString());
                state.PCScore = data.toString();
                fs.readFile('./BackPyScripts/userscore.txt',function(err,data)
                {
                    state.playerScore = data.toString();
                    fs.readFile('./BackPyScripts/board.txt',function(err,data){
                    
                        console.log(data);
                        data = data.toString('ascii');
                        console.log(data);
                        for(var i=0;i<data.length;i++)
                        {
                            data = data.replace(/(\r\n|\n|\r)/gm,"");
                        }
                        
                        state.board = data;

                        console.log(state);
                        res.send(state);
                    
                    });
                    
                });
            
            });

        });
    
    });

}


function renderWithErr(res){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "",
        playerRack: "",
        board:"",
        iserr:true,
        err: 'not valid!!!'
        
    };
    fs.readFile('./BackPyScripts/rack.txt',function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile('./BackPyScripts/userrack.txt',function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile('./BackPyScripts/pcscore.txt',function(err,data)
            {
                console.log('pcscore',data.toString());
                state.PCScore = data.toString();
                fs.readFile('./BackPyScripts/userscore.txt',function(err,data)
                {
                    state.playerScore = data.toString();
                    fs.readFile('./BackPyScripts/board.txt',function(err,data){
                    
                        console.log(data);
                        data = data.toString('ascii');
                        console.log(data);
                        for(var i=0;i<data.length;i++)
                        {
                            data = data.replace(/(\r\n|\n|\r)/gm,"");
                        }
                        
                        state.board = data;
                        console.log(state);
                        res.send(state);
                    
                    });
                    
                });
            
            });

        });
    
    });

}


router.get('/rackandscore',ensureAuth, function(req,res){
    renderHeader(res);
});

router.get('/board',ensureAuth, function(req,res){
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

router.get('/changerack',ensureAuth,function(req,res){
  
    fs.readFile('./BackPyScripts/userrack.txt',function(err,data){
        var rack = data.toString();
        fs.readFile('./BackPyScripts/MainRack.txt',function(err,data){
            var strr = data.toString();
                strr = strr + rack;
                rack = "";
                if(strr.length<7)
                {
                    res.send({error:"ENDING"});
                }else{
                for (var i=0;i<7;i++)
                {
                    var c = strr.charAt(Math.floor(Math.random()*strr.length));
                    strr.replace(c,"");
                    rack += c;
                }
                fs.writeFile('./BackPyScripts/MainRack.txt',strr,function(err){
                        
                fs.writeFile('./BackPyScripts/userrack.txt',rack,function(err){
                    if(err)
                        res.send('error');
                        
                        const { spawn } = require('child_process');
                        const pyprog = spawn('python', ['./BackPyScripts/main.py']);

                        pyprog.stdout.on('data', function(data) {
                            console.log(data.toString());
                            renderAll(res);
                        });

                        pyprog.stderr.on('data', (data) => {
                            res.send('err');
                            console.log(data.toString());
                        });

                });

                });
            }
        });
    });
});

router.get('/gameonbitch',ensureAuth,function(req,res){
    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['./BackPyScripts/main.py']);

    pyprog.stdout.on('data', function(data) {
        console.log(data.toString());
        renderAll(res);
    });

    pyprog.stderr.on('data', (data) => {
        res.send('err');
        console.log(data.toString());
    });

});

function startNew(res){
    fs.writeFile('./BackPyScripts/userscore.txt',"0",function(err){
        fs.writeFile('./BackPyScripts/pcscore.txt',"0",function(err){
            var str = "";
            for(var i=0;i<15;i++)
            {
                for(var j=0;j<15;j++)
                {
                    str += "#";
                }
                if(i!=14)
                    str += "\r\n";
            }
            fs.writeFile('./BackPyScripts/board.txt',str,function(err){
               var strr = "";
                fs.readFile('./BackPyScripts/InitRack.txt',function(err,data){
                    strr = data.toString();
                    fs.writeFile('./BackPyScripts/MainRack.txt',strr,function(err){
                        
                    fs.readFile('./BackPyScripts/userrack.txt',function(err,data){
                        var rack = data.toString();
                        fs.readFile('./BackPyScripts/MainRack.txt',function(err,data){
                            var strr = data.toString();
                                for (var i=0;i<7;i++)
                                {
                                    var c = rack.charAt(i);
                                    strr.replace(c,"");
                                }
                                fs.writeFile('./BackPyScripts/MainRack.txt',strr,function(err){
                                        
                                fs.writeFile('./BackPyScripts/userrack.txt',rack,function(err){
                                    fs.writeFile('./BackPyScripts/rack.txt',"",function(err){
                                        
                                    renderAll(res);
                                    });
                                });

                            });

                        });

                    });

                 });
                });
            });
        });
     });

}

router.get('/exit',ensureAuth,function(req,res){
    startNew(res);
});

router.post('/myturn',ensureAuth, function(req,res){
    console.log(req.body);
    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['./BackPyScripts/main1.py',req.body.word,req.body.row,req.body.col,req.body.hor]);

    pyprog.stdout.on('data', function(data) {

            const pypro = spawn('python', ['./BackPyScripts/main.py']);

            pypro.stdout.on('data', function(data) {
                console.log(data.toString());
                renderAll(res);
            });

            pypro.stderr.on('data', (data) => {
                res.send('err');
                console.log(data.toString());
            });
        
    });

    pyprog.stderr.on('data', (data) => {
        console.log(data.toString());
        renderWithErr(res);
    });

});


router.get('/search',function(req,res){
    
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
