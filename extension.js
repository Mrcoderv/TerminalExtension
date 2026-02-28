const vscode = require('vscode');
const path = require('path');
const { execSync, exec } = require('child_process');
const fs = require('fs');

let statusBarItem;
let outputChannel;

// ─────────────────────────────────────────
//  Platform-aware audio player
// ─────────────────────────────────────────
function playSound(soundFile) {
  const config = vscode.workspace.getConfiguration('faahSound');
  if (!config.get('enabled')) return;

  try {
    const platform = process.platform;
    const volume = config.get('volume', 80); // 0-100

    if (platform === 'win32') {
      // Windows - PowerShell via Base64-encoded command to avoid quote/newline issues
      const script = [
        'Add-Type -AssemblyName presentationCore;',
        '$player = New-Object system.windows.media.mediaplayer;',
        `$player.open('${soundFile.replace(/\\/g, '\\\\')}');`,
        `$player.Volume = ${volume / 100};`,
        '$player.Play();',
        'Start-Sleep -s 3;'
      ].join(' ');
      const encoded = Buffer.from(script, 'utf16le').toString('base64');
      exec(`powershell -EncodedCommand ${encoded}`);

    } else if (platform === 'darwin') {
      // macOS - afplay supports -v for volume (0.0 to 1.0)
      const afplayVolume = (volume / 100).toFixed(2);
      exec(`afplay -v ${afplayVolume} "${soundFile}"`);

    } else {
      // Linux - try players with correct volume syntax
      const players = [
        { bin: 'paplay', args: `--volume=${Math.round(volume / 100 * 65536)}` },
        { bin: 'aplay',  args: '' },      // aplay has no volume flag; use system mixer
        { bin: 'mpg123', args: `-f ${Math.round(volume / 100 * 32768)}` },
        { bin: 'sox',    args: '' }
      ];

      for (const { bin, args } of players) {
        try {
          execSync(`which ${bin}`, { stdio: 'ignore' });
          exec(`${bin} ${args} "${soundFile}"`);
          return;
        } catch (e) {
          continue;
        }
      }

      log('⚠️ No audio player found. Install paplay/aplay for Linux sound support.');
    }
  } catch (err) {
    log('Sound error: ' + err.message);
  }
}

// FIX: actual filename is 'fahhh.wav', not 'faah.wav'
function getSoundPath(type) {
  const config = vscode.workspace.getConfiguration('faahSound');
  const customPath = config.get(type === 'faah' ? 'customFaahSound' : 'customJaiHooSound');

  if (customPath && fs.existsSync(customPath)) {
    return customPath;
  }

  // FIX: removed dead `require('../package.json')` line
  return path.join(__dirname, 'sounds', type === 'faah' ? 'fahhh.wav' : 'jaihoo.wav');
}

// ─────────────────────────────────────────
//  Sound triggers
// ─────────────────────────────────────────
function playFaah(reason) {
  const config = vscode.workspace.getConfiguration('faahSound');
  if (!config.get('enableFaah')) return;

  log(`🔴 FAAH! triggered by: ${reason}`);
  updateStatusBar('$(error) Faah!', 'red');
  playSound(getSoundPath('faah'));
}

function playJaiHoo(reason) {
  const config = vscode.workspace.getConfiguration('faahSound');
  if (!config.get('enableJaiHoo')) return;

  log(`🟢 JAI HOO! triggered by: ${reason}`);
  updateStatusBar('$(check) Jai Hoo!', 'green');
  playSound(getSoundPath('jaihoo'));
}

// ─────────────────────────────────────────
//  Status bar
// ─────────────────────────────────────────
function updateStatusBar(text, color) {
  statusBarItem.text = text;
  statusBarItem.backgroundColor = color === 'red'
    ? new vscode.ThemeColor('statusBarItem.errorBackground')
    : undefined;
  statusBarItem.show();

  setTimeout(() => {
    statusBarItem.text = '$(music) Faah';
    statusBarItem.backgroundColor = undefined;
  }, 3000);
}

// ─────────────────────────────────────────
//  Logging
// ─────────────────────────────────────────
function log(msg) {
  outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

// ─────────────────────────────────────────
//  Task monitoring
// ─────────────────────────────────────────
function watchTasks() {
  vscode.tasks.onDidStartTask(e => {
    log(`Task started: ${e.execution.task.name}`);
  });

  vscode.tasks.onDidEndTaskProcess(e => {
    const taskName = e.execution.task.name;
    if (e.exitCode === 0) {
      playJaiHoo(`Task "${taskName}" succeeded (exit 0)`);
    } else if (e.exitCode !== undefined) {
      playFaah(`Task "${taskName}" failed (exit ${e.exitCode})`);
    }
  });
}

// ─────────────────────────────────────────
//  Debug session monitoring
// ─────────────────────────────────────────
function watchDebugSessions() {
  vscode.debug.onDidStartDebugSession(session => {
    log(`Debug session started: ${session.name}`);
  });

  vscode.debug.onDidTerminateDebugSession(session => {
    log(`Debug session ended: ${session.name}`);
  });

  vscode.debug.onDidReceiveDebugSessionCustomEvent(e => {
    if (e.event === 'exited') {
      if (e.body && e.body.exitCode === 0) {
        playJaiHoo(`Debug session "${e.session.name}" exited successfully`);
      } else if (e.body && e.body.exitCode !== 0) {
        playFaah(`Debug session "${e.session.name}" crashed (exit ${e.body.exitCode})`);
      }
    }
  });
}

// ─────────────────────────────────────────
//  Diagnostics monitoring (errors in code)
// ─────────────────────────────────────────
function watchDiagnostics() {
  let previousErrorCount = 0;
  let debounceTimer = null;

  vscode.languages.onDidChangeDiagnostics(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      let totalErrors = 0;
      vscode.workspace.textDocuments.forEach(doc => {
        const diags = vscode.languages.getDiagnostics(doc.uri);
        totalErrors += diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
      });

      if (totalErrors > previousErrorCount && previousErrorCount === 0) {
        playFaah(`New compile error detected (${totalErrors} errors)`);
      } else if (totalErrors === 0 && previousErrorCount > 0) {
        playJaiHoo(`All errors resolved! Clean build 🎉`);
      }

      previousErrorCount = totalErrors;
    }, 1500);
  });
}

// ─────────────────────────────────────────
//  Terminal monitoring (watches exit codes)
// ─────────────────────────────────────────
function watchTerminals() {
  // FIX: no need to await processId — exitStatus is synchronously available on close
  vscode.window.onDidCloseTerminal(terminal => {
    const code = terminal.exitStatus && terminal.exitStatus.code;
    if (code === undefined || code === null) return;

    if (code === 0) {
      playJaiHoo(`Terminal "${terminal.name}" exited successfully`);
    } else {
      playFaah(`Terminal "${terminal.name}" exited with code ${code}`);
    }
  });
}

// ─────────────────────────────────────────
//  Extension Activate
// ─────────────────────────────────────────
function activate(context) {
  outputChannel = vscode.window.createOutputChannel('Faah Sound');
  log('🎵 Faah & Jai Hoo extension activated!');

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(music) Faah';
  statusBarItem.tooltip = 'Faah & Jai Hoo Sound Effects - Active';
  statusBarItem.command = 'faahSound.testFaah';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  watchTasks();
  watchDebugSessions();
  watchDiagnostics();
  watchTerminals();

  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.testFaah', () => {
      vscode.window.showInformationMessage('🔴 Playing Faah! sound...');
      playFaah('Manual test');
    }),

    vscode.commands.registerCommand('faahSound.testJaiHoo', () => {
      vscode.window.showInformationMessage('🟢 Playing Jai Hoo! sound...');
      playJaiHoo('Manual test');
    }),

    vscode.commands.registerCommand('faahSound.enable', () => {
      vscode.workspace.getConfiguration('faahSound').update('enabled', true, true);
      vscode.window.showInformationMessage('✅ Faah Sound effects enabled!');
      statusBarItem.text = '$(music) Faah';
    }),

    vscode.commands.registerCommand('faahSound.disable', () => {
      vscode.workspace.getConfiguration('faahSound').update('enabled', false, true);
      vscode.window.showInformationMessage('🔇 Faah Sound effects disabled.');
      statusBarItem.text = '$(mute) Faah (muted)';
    }),

    vscode.commands.registerCommand('faahSound.setVolume', async () => {
      const volume = await vscode.window.showInputBox({
        prompt: 'Set volume (0-100)',
        validateInput: (value) => {
          const num = Number(value);
          return isNaN(num) || num < 0 || num > 100
            ? 'Please enter a number between 0 and 100'
            : null;
        }
      });

      if (volume !== undefined) {
        vscode.workspace.getConfiguration('faahSound').update('volume', Number(volume), true);
        vscode.window.showInformationMessage(`🔊 Volume set to ${volume}`);
      }
    })
  );

  vscode.window.showInformationMessage('🎵 Faah & Jai Hoo loaded! Fail = Faah! | Success = Jai Hoo!');
}

function deactivate() {
  log('Faah Sound deactivated.');
}

module.exports = { activate, deactivate };