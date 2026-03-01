const vscode = require('vscode');
const path = require('path');
const { exec } = require('child_process');

function playSound(soundFile) {
  try {
    const platform = process.platform;
    if (platform === 'darwin') {
      exec(`afplay "${soundFile}"`);
    } else if (platform === 'win32') {
      exec(`powershell -c (New-Object Media.SoundPlayer "${soundFile}").PlaySync();`);
    } else {
      exec(`paplay "${soundFile}"`);
    }
  } catch (err) {
    console.error('Error playing sound:', err);
  }
}

function getSoundPath(type) {
  return path.join(__dirname, 'sounds', type === 'failure' ? 'faah.wav' : 'jaihoo.wav');
}

function watchTasks() {
  vscode.tasks.onDidEndTaskProcess(e => {
    if (e.exitCode === 0) {
      playSound(getSoundPath('success'));
    } else {
      playSound(getSoundPath('failure'));
    }
  });
}

function activate(context) {
  watchTasks();
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};