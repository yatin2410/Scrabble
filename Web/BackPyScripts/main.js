const spawn = require("child_process").spawn;
import path from 'path';

const pythonProcess = spawn('python',[path.join(__dirname,'../main.py')]);


pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
});