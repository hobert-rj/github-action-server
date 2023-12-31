const express = require('express');
const {exec} = require('child_process');
const minimist = require('minimist');

const app = express();
const port = 7500;

const args = minimist(process.argv.slice(2));
const projectDirectory = args.directory;

app.get('/deploy-pwa-stage', (req, res) => {
    process.chdir(projectDirectory);

    let stdoutData = '';
    let stderrData = '';

    const npmScript = exec('yarn run deploy:pwa:stage');

    npmScript.stdout.on('data', (data) => {
        console.log(data);
        stdoutData += data + '\n';
    });

    npmScript.stderr.on('data', (data) => {
        console.error(data);
        stderrData += data + '\n';
    });

    npmScript.on('exit', (code) => {
        if (code === 0) {
            console.log('Script executed successfully');
            res.status(200).send(stdoutData + '\n' + 'Script executed successfully');
        } else {
            console.error(`Script execution failed with code ${code}`);
            res.status(500).send(stderrData + '\n' + 'Error running the script');
        }
    });
});


app.listen(port, () => {
    console.log(`Node server is running on port ${port}`);
    console.log(`Project directory: ${projectDirectory}`);
});
