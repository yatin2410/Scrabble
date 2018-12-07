'use strict';
var express = require('express');
var router = express.Router();
import path from 'path';
var fs = require('fs');
/* GET home page. */
router.get('/', ensureAuth, function (req, res) {
    res.sendFile(path.join(__dirname,'../index.html'));
});

var backpath = path.join(__dirname+'./Players');

function renderHeader(res){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "",
        playerRack: ""
    };
    fs.readFile(path.join(backpath,'/rack.txt'),function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile(path.join(backpath,'/userrack.txt'),function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile(path.join(backpath,'/pcscore.txt'),function(err,data)
            {
                state.PCScore = data.toString();
                fs.readFile(path.join(backpath,'/userscore.txt'),function(err,data)
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
    fs.readFile(path.join(backpath,'/rack.txt'),function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile(path.join(backpath,'/userrack.txt'),function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile(path.join(backpath,'/pcscore.txt'),function(err,data)
            {
                console.log('pcscore',data.toString());
                state.PCScore = data.toString();
                fs.readFile(path.join(backpath,'/userscore.txt'),function(err,data)
                {
                    state.playerScore = data.toString();
                    fs.readFile(path.join(backpath,'/board.txt'),function(err,data){
                    
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


function renderWithErr(res,errorTxt){
    var state={
        playerScore: 0,
        PCScore: 0,
        PCRack: "",
        playerRack: "",
        board:"",
        iserr:true,
        err: errorTxt
        
    };
    fs.readFile(path.join(backpath,'/rack.txt'),function(err,data)
    {
        state.PCRack = data.toString();
        fs.readFile(path.join(backpath,'/userrack.txt'),function(err,data)
        {
            state.playerRack = data.toString();
            fs.readFile(path.join(backpath,'/pcscore.txt'),function(err,data)
            {
                console.log('pcscore',data.toString());
                state.PCScore = data.toString();
                fs.readFile(path.join(backpath,'/userscore.txt'),function(err,data)
                {
                    state.playerScore = data.toString();
                    fs.readFile(path.join(backpath,'/board.txt'),function(err,data){
                    
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
    fs.readFile(path.join(backpath,'/board.txt'),function(err,data){
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
  
    fs.readFile(path.join(backpath,'/userrack.txt'),function(err,data){
        var rack = data.toString();
        fs.readFile(path.join(backpath,'/MainRack.txt'),function(err,data){
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
                fs.writeFile(path.join(backpath,'/MainRack.txt'),strr,function(err){
                        
                fs.writeFile(path.join(backpath,'/userrack.txt'),rack,function(err){
                    if(err)
                        res.send('error');
                        
                        const { spawn } = require('child_process');
                        const pyprog = spawn('python3', [path.join(backpath,'/main.py')]);

                        pyprog.stdout.on('data', function(data) {
                            console.log(data.toString());
                            var yy = data.toString();
                            if(yy.length<5){
                                console.log(yy);
                                renderAll(res);
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
    const pyprog = spawn('python3', [(path.join(backpath,'/main.py'))]);

    pyprog.stdout.on('data', function(data) {
	console.log(data.toString());
        console.log(data.toString().length);
        var yy = data.toString();
        if(yy.length<5){
            console.log(yy);
            renderAll(res);
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

function startNew(res){
    fs.writeFile(path.join(backpath,'/userscore.txt'),"0",function(err){
        fs.writeFile(path.join(backpath,'/pcscore.txt'),"0",function(err){
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
            fs.writeFile(path.join(backpath,'/board.txt'),str,function(err){
               var strr = "";
                fs.readFile(path.join(backpath,'/InitRack.txt'),function(err,data){
                    strr = data.toString();
                    fs.writeFile(path.join(backpath,'/MainRack.txt'),strr,function(err){
                        
                    fs.readFile(path.join(backpath,'/userrack.txt'),function(err,data){
                        var rack = data.toString();
                        fs.readFile(path.join(backpath,'/MainRack.txt'),function(err,data){
                            var strr = data.toString();
                                for (var i=0;i<7;i++)
                                {
                                    var c = rack.charAt(i);
                                    strr.replace(c,"");
                                }
                                fs.writeFile(path.join(backpath,'/MainRack.txt'),strr,function(err){
                                        
                                fs.writeFile(path.join(backpath,'/userrack.txt'),rack,function(err){
                                    fs.writeFile(path.join(backpath,'/rack.txt'),"",function(err){
                                        
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

router.get('/exit',ensureAuth, function(req,res){
    startNew(res);
});

router.post('/myturn',ensureAuth, function(req,res){
    console.log(req.body);
    const { spawn } = require('child_process');
    const pyprog = spawn('python3', [(path.join(backpath,'/main1.py',req.body.word,req.body.row,req.body.col,req.body.hor))]);

    pyprog.stdout.on('data', function(data) {

            const pypro = spawn('python3', [(path.join(backpath,'/main.py'))]);

            pypro.stdout.on('data', function(data) {
                console.log(data.toString());
                renderAll(res);
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
        renderWithErr(res,errorTxt);
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
