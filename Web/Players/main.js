var ncp = require('ncp');
var path = require('path')

ncp.limit = 20;

console.log(__dirname);

ncp(path.join(__dirname+"/InitialGame"),path.join(__dirname+"/InitialGame1"),function(err) {
    if(err)
    {
        return console.log(err);
    }   
    console.log('DONE!');
}); 