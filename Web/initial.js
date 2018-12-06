var fs = require('fs');

function startNew(){
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
                        var rack = "";
                        fs.readFile('./BackPyScripts/MainRack.txt',function(err,data){
                            var strr = data.toString();
                                for (var i=0;i<7;i++)
                                {
                                    var c = strr.charAt(Math.floor(Math.random()*strr.length));
                                    strr.replace(c,"");
                                    rack += c;
                                }
                            fs.writeFile('./BackPyScripts/MainRack.txt',strr,function(err){        
                                fs.writeFile('./BackPyScripts/userrack.txt',rack,function(err){
                                    var rack1 = "";
                                    fs.readFile('./BackPyScripts/MainRack.txt',function(err,data){
                                        var strr = data.toString();
                                            for (var i=0;i<7;i++)
                                            {
                                                var c = strr.charAt(Math.floor(Math.random()*strr.length));
                                                strr.replace(c,"");
                                                rack1 += c;
                                            }
                                    fs.writeFile('./BackPyScripts/rack.txt',rack1,function(err){
                                        
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

startNew();