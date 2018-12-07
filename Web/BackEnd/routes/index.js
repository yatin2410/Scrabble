'use strict';
var express = require('express');
var router = express.Router();
import path from 'path';
var fs = require('fs');
/* GET home page. */
router.get('/', ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname,'../index.html'));
});

var backpath = path.join(__dirname+"/../../Players/");

function renderHeader(req,res){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "",
        playerRack: ""
    };
    fs.readFile(path.join(backpath,req.user.username+'/rack.txt'),function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile(path.join(backpath,req.user.username+'/userrack.txt'),function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile(path.join(backpath,req.user.username+'/pcscore.txt'),function(err,data)
            {
                state.PCScore = data.toString();
                fs.readFile(path.join(backpath,req.user.username+'/userscore.txt'),function(err,data)
                {
                    state.playerScore = data.toString();
                    console.log(state);
                    res.send(state);
                });
            
            });

        });
    
    });

}


function renderAll(req,res){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "",
        playerRack: "",
        board:"",
    };
    fs.readFile(path.join(backpath,req.user.username+'/rack.txt'),function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile(path.join(backpath,req.user.username+'/userrack.txt'),function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile(path.join(backpath,req.user.username+'/pcscore.txt'),function(err,data)
            {
                console.log('pcscore',data.toString());
                state.PCScore = data.toString();
                fs.readFile(path.join(backpath,req.user.username+'/userscore.txt'),function(err,data)
                {
                    state.playerScore = data.toString();
                    fs.readFile(path.join(backpath,req.user.username+'/board.txt'),function(err,data){
                    
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


function renderWithErr(req,res,errorTxt){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "",
        playerRack: "",
        board:"",
        iserr:true,
        err: errorTxt
        
    };
    fs.readFile(path.join(backpath,req.user.username+'/rack.txt'),function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile(path.join(backpath,req.user.username+'/userrack.txt'),function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile(path.join(backpath,req.user.username+'/pcscore.txt'),function(err,data)
            {
                console.log('pcscore',data.toString());
                state.PCScore = data.toString();
                fs.readFile(path.join(backpath,req.user.username+'/userscore.txt'),function(err,data)
                {
                    state.playerScore = data.toString();
                    fs.readFile(path.join(backpath,req.user.username+'/board.txt'),function(err,data){
                    
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
    renderHeader(req,res);
});

router.get('/board',ensureAuth, function(req,res){
    fs.readFile(path.join(backpath,req.user.username+'/board.txt'),function(err,data){
        console.log(path.join(backpath,req.user.username+'/baord.txt'));
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

router.get('/changerack',ensureAuth, function(req,res){
  
    fs.readFile(path.join(backpath,req.user.username+'/userrack.txt'),function(err,data){
        var rack = data.toString();
        fs.readFile(path.join(backpath,req.user.username+'/MainRack.txt'),function(err,data){
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
                    strr = strr.replace(c,"");
                    rack += c;
                }
                fs.writeFile(path.join(backpath,req.user.username+'/MainRack.txt'),strr,function(err){
                        
                fs.writeFile(path.join(backpath,req.user.username+'/userrack.txt'),rack,function(err){
                    if(err)
                        res.send('error');
                        
                        const { spawn } = require('child_process');
                        const pyprog = spawn('python3', [path.join(backpath,'/main.py'),req.user.username]);

                        pyprog.stdout.on('data', function(data) {
                            console.log(data.toString());
                            var yy = data.toString();
                            if(yy.length<5){
                                console.log(yy);
                                renderAll(req,res);
                            }
                            else{
                                console.log(yy.length);
                            res.send('err');
                            }
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

router.get('/gameonbitch',ensureAuth, function(req,res){
    const { spawn } = require('child_process');
    console.log((path.join(backpath,'/main.py')));
    const pyprog = spawn('python3', [path.join(backpath,'/main.py'),req.user.username]);

    pyprog.stdout.on('data', function(data) {
	console.log(data.toString());
        console.log(data.toString().length);
        var yy = data.toString();
        if(yy.length<5){
            console.log(yy);
            renderAll(req,res);
        }
        else{
            console.log(yy.length);
        res.send('err');
        }
    });

    pyprog.stderr.on('data', (data) => {
        console.log(data.toString());
        res.send('err');
    });

});

function startNew(req,res){
    fs.writeFile(path.join(backpath,req.user.username+'/userscore.txt'),"0",function(err){
        fs.writeFile(path.join(backpath,req.user.username+'/pcscore.txt'),"0",function(err){
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
            fs.writeFile(path.join(backpath,req.user.username+'/board.txt'),str,function(err){
               var strr = "";
                fs.readFile(path.join(backpath,req.user.username+'/InitRack.txt'),function(err,data){
                    strr = data.toString();
                    fs.writeFile(path.join(backpath,req.user.username+'/MainRack.txt'),strr,function(err){
                        
                    fs.readFile(path.join(backpath,req.user.username+'/userrack.txt'),function(err,data){
                        var rack = data.toString();
                        fs.readFile(path.join(backpath,req.user.username+'/MainRack.txt'),function(err,data){
                            var strr = data.toString();
                                for (var i=0;i<7;i++)
                                {
                                    var c = rack.charAt(i);
                                    strr.replace(c,"");
                                }
                                fs.writeFile(path.join(backpath,req.user.username+'/MainRack.txt'),strr,function(err){
                                        
                                fs.writeFile(path.join(backpath,req.user.username+'/userrack.txt'),rack,function(err){
                                    fs.writeFile(path.join(backpath,req.user.username+'/rack.txt'),"",function(err){
                                        
                                    renderAll(req,res);
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

router.get('/exit',ensureAuth, function(req,res){
    startNew(req,res);
});

router.post('/myturn',ensureAuth, function(req,res){
    console.log(req.body);
    const { spawn } = require('child_process');
    const pyprog = spawn('python3', [path.join(backpath,'/main1.py'),req.body.word,req.body.row,req.body.col,req.body.hor,req.user.username]);

    pyprog.stdout.on('data', function(data) {

            const pypro = spawn('python3', [path.join(backpath,'/main.py'),req.user.username]);

            pypro.stdout.on('data', function(data) {
                console.log(data.toString());
                renderAll(req,res);
            });

            pypro.stderr.on('data', (data) => {
                
                res.send('err');
                
            });
        
    });

    pyprog.stderr.on('data', (data) => {
        console.log(data.toString());
        var strr = (    data.toString()).split('\n');
        console.log(strr[strr.length-2]);
       var errorTxt = strr[strr.length-2].replace("ValueError: ","");
       console.log(errorTxt);
        renderWithErr(req,res,errorTxt);
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
