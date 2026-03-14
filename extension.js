const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execFile, exec } = require('child_process');

// ─── Audio Player via Native OS Commands ──────────────────────────────────────

function playSound(soundFile, volume) {
  try {
    if (!fs.existsSync(soundFile)) {
      console.error('Faah Sound: file not found:', soundFile);
      vscode.window.showWarningMessage(`Faah Sound: file not found — ${soundFile}`);
      return;
    }

    const platform = process.platform;
    const vol = Math.max(0, Math.min(100, volume ?? 80));

    if (platform === 'darwin') {
      execFile('afplay', ['-v', (vol / 100).toString(), soundFile], (err) => {
        if (err) console.error('Faah Sound: afplay error:', err);
      });
    } else if (platform === 'win32') {
      const psCmd = `Add-Type -AssemblyName presentationCore; $player = New-Object system.windows.media.mediaplayer; $player.open('${soundFile}'); $player.Volume = ${vol / 100}; $player.Play(); Start-Sleep 1; Start-Sleep -s $player.NaturalDuration.TimeSpan.TotalSeconds; Exit;`;
      exec(`powershell -c "${psCmd}"`, { windowsHide: true }, (err) => {
        if (err) console.error('Faah Sound: powershell error:', err);
      });
    } else {
      // linux / other
      execFile('paplay', [soundFile], (err) => {
        if (err) {
          execFile('aplay', ['-q', soundFile], (err2) => {
            if (err2) console.error('Faah Sound: aplay/paplay error:', err2);
          });
        }
      });
    }
  } catch (err) {
    console.error('Faah Sound: error playing sound:', err);
  }
}

// ─── Path Helpers ─────────────────────────────────────────────────────────────

function getDefaultSoundPath(type) {
  const file = type === 'failure' ? 'fahhh.wav' : 'jaihoo.wav';
  return path.join(__dirname, 'sounds', file);
}

function getSoundPath(type) {
  const config = vscode.workspace.getConfiguration('faahSound');
  const customKey = type === 'failure' ? 'customFaahSound' : 'customJaiHooSound';
  const custom = config.get(customKey, '');
  return (custom && custom.trim() !== '') ? custom.trim() : getDefaultSoundPath(type);
}

// ─── Config Helpers ───────────────────────────────────────────────────────────

function cfg(key, def) { return vscode.workspace.getConfiguration('faahSound').get(key, def); }
function isEnabled() { return cfg('enabled', true); }
function isFaahEnabled() { return cfg('enableFaah', true); }
function isJaiHooEnabled() { return cfg('enableJaiHoo', true); }
function getVolume() { return cfg('volume', 80); }
function playOnDiagnostics() { return cfg('playOnDiagnosticsError', true); }
function playOnDebugFailure() { return cfg('playOnDebugFailure', true); }
function playOnDebugSuccess() { return cfg('playOnDebugSuccess', true); }
function getCooldown() { return cfg('cooldownMs', 1500); }

// ─── Cooldown Manager ─────────────────────────────────────────────────────────

let lastSoundTime = 0;

function tryPlay(type) {
  if (!isEnabled()) return;
  const now = Date.now();
  if (now - lastSoundTime < getCooldown()) return;
  lastSoundTime = now;
  if (type === 'failure' && isFaahEnabled()) playSound(getSoundPath('failure'), getVolume());
  if (type === 'success' && isJaiHooEnabled()) playSound(getSoundPath('success'), getVolume());
}

// ─── Custom Sound Picker ──────────────────────────────────────────────────────

const AUDIO_FILTER = {
  'Audio Files': ['mp3', 'wav', 'ogg', 'm4a'],
  'All Files': ['*']
};

async function pickCustomSound(type) {
  const label = type === 'failure' ? 'Faah! (failure)' : 'Jai Hoo! (success)';
  const configKey = type === 'failure' ? 'customFaahSound' : 'customJaiHooSound';

  // Show options: pick file, reset to default, or cancel
  const choice = await vscode.window.showQuickPick(
    [
      { label: '📂 Browse for audio file...', value: 'browse' },
      { label: '🔄 Reset to default sound', value: 'reset' },
      { label: '🔊 Preview current sound', value: 'preview' },
    ],
    { title: `Custom Sound — ${label}`, placeHolder: 'What would you like to do?' }
  );

  if (!choice) return;

  if (choice.value === 'browse') {
    const uris = await vscode.window.showOpenDialog({
      title: `Pick a sound file for ${label}`,
      canSelectMany: false,
      canSelectFolders: false,
      filters: AUDIO_FILTER,
      openLabel: 'Use this sound'
    });

    if (!uris || uris.length === 0) return;

    const filePath = uris[0].fsPath;

    // Validate file exists and is readable
    if (!fs.existsSync(filePath)) {
      vscode.window.showErrorMessage(`Faah Sound: Cannot read file — ${filePath}`);
      return;
    }

    await vscode.workspace.getConfiguration('faahSound').update(configKey, filePath, true);

    // Preview immediately after setting
    const preview = await vscode.window.showInformationMessage(
      `✅ Custom sound set!\n${path.basename(filePath)}`,
      'Preview it'
    );
    if (preview === 'Preview it') {
      playSound(filePath, getVolume());
    }

  } else if (choice.value === 'reset') {
    await vscode.workspace.getConfiguration('faahSound').update(configKey, '', true);
    vscode.window.showInformationMessage(`🔄 ${label} reset to default sound.`);

  } else if (choice.value === 'preview') {
    playSound(getSoundPath(type), getVolume());
  }
}

// ─── Activate ─────────────────────────────────────────────────────────────────

function activate(context) {

  // ── 1. Terminal shell exit code (VS Code 1.93+) ───────────────────────────
  if (vscode.window.onDidEndTerminalShellExecution) {
    context.subscriptions.push(
      vscode.window.onDidEndTerminalShellExecution(e => {
        try {
          if (e.execution && e.execution.commandLine && e.execution.commandLine.value) {
            if (e.execution.commandLine.value.trim().length === 0) return;
          }
        } catch (_) { }

        const code = e.exitCode;
        if (code === undefined) return;
        if (code === 0) tryPlay('success');
        else tryPlay('failure');
      })
    );
  }

  // ── 2. VS Code Tasks (tasks.json / Run Task / Ctrl+Shift+B) ──────────────
  context.subscriptions.push(
    vscode.tasks.onDidEndTaskProcess(e => {
      if (e.exitCode === 0) tryPlay('success');
      else tryPlay('failure');
    })
  );

  // ── 3. Terminal close with exit code ─────────────────────────────────────
  context.subscriptions.push(
    vscode.window.onDidCloseTerminal(terminal => {
      const code = terminal.exitStatus?.code;
      if (code === undefined) return;
      if (code === 0) tryPlay('success');
      else tryPlay('failure');
    })
  );

  // ── 4. Diagnostics — new red squiggly errors ──────────────────────────────
  let prevErrorCount = 0;
  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics(() => {
      if (!isEnabled() || !playOnDiagnostics() || !isFaahEnabled()) return;
      let totalErrors = 0;
      for (const [, diags] of vscode.languages.getDiagnostics()) {
        totalErrors += diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
      }
      if (totalErrors > prevErrorCount) tryPlay('failure');
      prevErrorCount = totalErrors;
    })
  );

  // ── 5. Debug session via DAP tracker ─────────────────────────────────────
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterTrackerFactory('*', {
      createDebugAdapterTracker() {
        return {
          onDidSendMessage(msg) {
            if (msg.type === 'event' && msg.event === 'exited') {
              const code = msg.body?.exitCode;
              if (code === undefined) return;
              if (code === 0) { if (playOnDebugSuccess()) tryPlay('success'); }
              else { if (playOnDebugFailure()) tryPlay('failure'); }
            }
          }
        };
      }
    })
  );

  // ── 6. Fallback terminal output scan (VS Code < 1.93) ────────────────────
  if (!vscode.window.onDidEndTerminalShellExecution && typeof vscode.window.onDidWriteTerminalData === 'function') {
    const FAILURE_PATTERNS = [
      /\berror\b/i, /\bfailed\b/i, /\bfailure\b/i, /\bfatal\b/i,
      /\bexception\b/i, /\bpanic\b/i, /\bcommand not found\b/i,
      /\bnetsdk\d+/i, /\bMSB\d+/i, /\bCS\d{3,}\b/i, /build failed/i,
      /\bnpm err/i, /\btraceback\b/i, /\bbash:.*not found/i, /\bzsh:.*not found/i,
    ];
    let debounceTimer = null;
    context.subscriptions.push(
      vscode.window.onDidWriteTerminalData(e => {
        if (!isEnabled()) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (FAILURE_PATTERNS.some(p => p.test(e.data))) tryPlay('failure');
        }, 300);
      })
    );
  }

  // ─── Commands ──────────────────────────────────────────────────────────────

  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.testFaah', () => {
      playSound(getSoundPath('failure'), getVolume());
      vscode.window.showInformationMessage('🔊 Playing Faah! sound...');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.testJaiHoo', () => {
      playSound(getSoundPath('success'), getVolume());
      vscode.window.showInformationMessage('🎉 Playing Jai Hoo! sound...');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.enable', () => {
      vscode.workspace.getConfiguration('faahSound').update('enabled', true, true);
      vscode.window.showInformationMessage('✅ Faah Sound enabled!');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.disable', () => {
      vscode.workspace.getConfiguration('faahSound').update('enabled', false, true);
      vscode.window.showInformationMessage('🔇 Faah Sound disabled.');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.setVolume', async () => {
      const input = await vscode.window.showInputBox({
        prompt: 'Enter volume (0-100)',
        value: String(getVolume()),
        validateInput: v => {
          const n = Number(v);
          return (isNaN(n) || n < 0 || n > 100) ? 'Enter a number between 0 and 100' : null;
        }
      });
      if (input !== undefined) {
        vscode.workspace.getConfiguration('faahSound').update('volume', Number(input), true);
        vscode.window.showInformationMessage(`🔊 Volume set to ${input}`);
      }
    })
  );

  // ── Custom sound picker commands ──────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.setCustomFaah', () => pickCustomSound('failure'))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.setCustomJaiHoo', () => pickCustomSound('success'))
  );

  // Shortcut: open custom sounds menu showing both
  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.customSounds', async () => {
      const choice = await vscode.window.showQuickPick(
        [
          { label: '😬 Set custom Faah! sound    (failure)', value: 'failure' },
          { label: '🎉 Set custom Jai Hoo! sound  (success)', value: 'success' },
        ],
        { title: 'Custom Sounds', placeHolder: 'Which sound do you want to customize?' }
      );
      if (choice) pickCustomSound(choice.value);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('faahSound.resetErrorCount', () => {
      prevErrorCount = 0;
      vscode.window.showInformationMessage('🔄 Error count reset.');
    })
  );

  vscode.window.setStatusBarMessage('🎵 Faah & Jai Hoo active', 3000);
}

function deactivate() { }

module.exports = { activate, deactivate };