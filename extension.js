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
    const volume = config.get('volume', 80); // Default to 80 if not set

    if (platform === 'win32') {
      // Windows - PowerShell
      const script = `
        Add-Type -AssemblyName presentationCore;
        $player = New-Object system.windows.media.mediaplayer;
        $player.open('${soundFile.replace(/\\/g, '\\\\')}');
        $player.Volume = ${volume / 100};
        $player.Play();
        Start-Sleep -s 2;
      `;
      exec(`powershell -Command "${script.replace(/\n/g, ' ')}"`);
    } else if (platform === 'darwin') {
      // macOS
      exec(`afplay "${soundFile}" &`);
    } else {
      // Linux - try multiple players
      const players = ['paplay', 'aplay', 'sox', 'mpg123'];
      for (const player of players) {
        try {
          execSync(`which ${player}`, { stdio: 'ignore' });
          exec(`${player} --volume=${volume} "${soundFile}" &`);
          return;
        } catch (e) {
          continue;
        }
      }
      // Fallback: VS Code's built-in notification beep
      log('⚠️ No audio player found. Install paplay/aplay for Linux sound support.');
    }
  } catch (err) {
    log('Sound error: ' + err.message);
  }
}

function getSoundPath(type) {
  const config = vscode.workspace.getConfiguration('faahSound');
  const customPath = config.get(type === 'faah' ? 'customFaahSound' : 'customJaiHooSound');

  if (customPath && fs.existsSync(customPath)) {
    return customPath;
  }

  const ext = require('../package.json');
  return path.join(__dirname, 'sounds', type === 'faah' ? 'faah.wav' : 'jaihoo.wav');
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

  // Reset after 3 seconds
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
  // Task START
  vscode.tasks.onDidStartTask(e => {
    log(`Task started: ${e.execution.task.name}`);
  });

  // Task END
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
    // We can't easily tell success/fail from terminate alone, 
    // but crashed sessions often have type info
    // Use exit code via custom event if available
  });

  // Listen to debug console output for error patterns
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

  vscode.languages.onDidChangeDiagnostics(e => {
    // Debounce to avoid rapid firing while typing
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      let totalErrors = 0;
      vscode.workspace.textDocuments.forEach(doc => {
        const diags = vscode.languages.getDiagnostics(doc.uri);
        totalErrors += diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
      });

      // New errors appeared
      if (totalErrors > previousErrorCount && previousErrorCount === 0) {
        playFaah(`New compile error detected (${totalErrors} errors)`);
      }
      // All errors resolved!
      else if (totalErrors === 0 && previousErrorCount > 0) {
        playJaiHoo(`All errors resolved! Clean build 🎉`);
      }

      previousErrorCount = totalErrors;
    }, 1500); // Wait 1.5s after last change
  });
}

// ─────────────────────────────────────────
//  Terminal monitoring (watches exit codes)
// ─────────────────────────────────────────
function watchTerminals() {
  vscode.window.onDidCloseTerminal(terminal => {
    terminal.processId.then(pid => {
      terminal.exitStatus && terminal.exitStatus.code !== undefined
        ? terminal.exitStatus.code === 0
          ? playJaiHoo(`Terminal "${terminal.name}" exited successfully`)
          : playFaah(`Terminal "${terminal.name}" exited with code ${terminal.exitStatus.code}`)
        : null;
    }).catch(() => {});
  });
}

// ─────────────────────────────────────────
//  Extension Activate
// ─────────────────────────────────────────
function activate(context) {
  outputChannel = vscode.window.createOutputChannel('Faah Sound');
  log('🎵 Faah & Jai Hoo extension activated!');

  // Status bar
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(music) Faah';
  statusBarItem.tooltip = 'Faah & Jai Hoo Sound Effects - Active';
  statusBarItem.command = 'faahSound.testFaah';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Start watchers
  watchTasks();
  watchDebugSessions();
  watchDiagnostics();
  watchTerminals();

  // ── Commands ──
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

    // Add a new command to set volume dynamically
    vscode.commands.registerCommand('faahSound.setVolume', async () => {
      const volume = await vscode.window.showInputBox({
        prompt: 'Set volume (0-100)',
        validateInput: (value) => {
          const num = Number(value);
          return isNaN(num) || num < 0 || num > 100 ? 'Please enter a number between 0 and 100' : null;
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
