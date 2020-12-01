/**
 *  auth: weilan
 *  读取文件夹并打包项目
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const sub_app_ath = path.resolve();
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^sub|^mobile|portal/.test(i));

console.log(`即将进入所有模块并打包项目：${JSON.stringify(sub_apps)} ing...`)

const spawn = require('child_process').spawn
function build() {
  sub_apps.forEach(i => {
    console.log(`${i} 开始打包,耗时较久请耐心等待...`)
    const npm = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { cwd: path.resolve(i), shell: false });
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
build();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
