/**
 *  auth: weilan
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const sub_app_ath = path.resolve();
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^sub|^mobile|portal/.test(i));
const args = process.argv.slice(2)
let apps = sub_apps
if (args.length !== 0) {
  apps = ['portal']
  for (var i in sub_apps) {
    app = sub_apps[i]
    if (app != 'portal' && args.includes(app)) {
      apps.push(app)
    }
  }
}


var open = require('open');
const spawn = require('child_process').spawn
function start() {
  apps.forEach(i => {
    const npm = spawn('npm', ['run', 'lint:fix'], { cwd: path.resolve(i), shell: false });
    npm.stdout.on('data', (data) => {
      console.log(`${i} success: ${data}`);
    });

    npm.stderr.on('data', (data) => {
      console.error(`${i} error: ${data}`);
    });

    npm.on('close', (code) => {
      console.log(`${i} 退出，退出码 ${code}`);
    });
  });
};
start();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
