const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',['./main.py']);


pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
});