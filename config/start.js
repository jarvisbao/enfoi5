/**
 *  auth: weilan
 *  读取文件夹并运行服务
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
console.log(`即将进入以下模块并启动服务：${JSON.stringify(apps)} ing...`)



var open = require('open');
const spawn = require('child_process').spawn
function start() {
  apps.forEach(i => {
    console.log(`${i} 开始启动... 全部启动需要时间，请稍加等候，或刷新浏览器即可`)
    const npm = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'serve'], { cwd: path.resolve(i), shell: false });
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
  // open('http://localhost:7000/');
};
start();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
