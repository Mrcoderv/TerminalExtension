# 🎵 Faah & Jai Hoo — Code Sound Effects

> Never code in silence again!

| Event | Sound |
|-------|-------|
| ❌ Code error / build failure / crash | **Faah!** |
| ✅ Successful run / all errors resolved | **Jai Hoo!** |

---

## 🚀 Features

- 🔴 **Faah!** — Plays on:
  - Task failures (non-zero exit code)
  - Debug session crashes
  - New compile/lint errors appearing
  - Terminal exits with error

- 🟢 **Jai Hoo!** — Plays on:
  - Task success (exit code 0)
  - Debug session success
  - All errors resolved (clean build!)
  - Terminal exits successfully

- 🎛️ **Fully customizable** — Use your own sound files!
- 🔇 **Toggle on/off** from command palette
- 📊 **Status bar indicator** — Always know the extension is active

---

## ⚙️ Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `faahSound.enabled` | `true` | Master on/off switch |
| `faahSound.enableFaah` | `true` | Enable Faah! sound |
| `faahSound.enableJaiHoo` | `true` | Enable Jai Hoo! sound |
| `faahSound.volume` | `80` | Volume (0-100) |
| `faahSound.customFaahSound` | `""` | Path to custom fail sound (.wav/.mp3) |
| `faahSound.customJaiHooSound` | `""` | Path to custom success sound (.wav/.mp3) |

---

## 🎮 Commands

Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search:

- `Faah Sound: Test Faah! Sound`
- `Faah Sound: Test Jai Hoo! Sound`
- `Faah Sound: Enable Faah Sound`
- `Faah Sound: Disable Faah Sound`

---

## 🔊 Platform Support

| OS | Audio Method |
|----|-------------|
| Windows | PowerShell MediaPlayer |
| macOS | `afplay` (built-in) |
| Linux | `paplay` / `aplay` / `mpg123` |

> **Linux users:** Make sure `paplay` (PulseAudio) or `aplay` (ALSA) is installed.

---

## 💡 Custom Sounds

Add your own sounds in settings:

```json
{
  "faahSound.customFaahSound": "/path/to/your/faah.wav",
  "faahSound.customJaiHooSound": "/path/to/your/jaihoo.mp3"
}
```

---

## 🇮🳳 Inspired By

- **Faah** (فاہ) — The universal sound of disappointment
- **Jai Hoo** (ज हो) — Victory! Glory! 

Made with ❤️ for developers who feel things deeply.

---

# 🛠️ How to Use the Faah & Jai Hoo Extension

## 📥 Installation

1. Open Visual Studio Code.
2. Go to the Extensions Marketplace (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Search for **Faah & Jai Hoo - Code Sound Effects**.
4. Click **Install**.

Alternatively, you can install the extension manually:

1. Download the `.vsix` file from the [GitHub Releases](https://github.com/Mrcoderv/TerminalExtension).
2. Open the Extensions view in VS Code.
3. Click the `...` menu in the top-right corner and select **Install from VSIX...**.
4. Select the downloaded `.vsix` file.

---

## 🔧 Configuration

1. Open the settings (`Ctrl+,` / `Cmd+,`).
2. Search for `Faah Sound`.
3. Adjust the following settings as needed:

| Setting | Description |
|---------|-------------|
| `faahSound.enabled` | Master on/off switch for all sounds. |
| `faahSound.enableFaah` | Enable the **Faah!** sound for errors. |
| `faahSound.enableJaiHoo` | Enable the **Jai Hoo!** sound for successes. |
| `faahSound.volume` | Set the volume (0-100). |
| `faahSound.customFaahSound` | Path to a custom **Faah!** sound file. |
| `faahSound.customJaiHooSound` | Path to a custom **Jai Hoo!** sound file. |

---

## 🎮 Testing the Sounds

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run the following commands:
   - `Faah Sound: Test Faah! Sound`
   - `Faah Sound: Test Jai Hoo! Sound`

---

## 🐞 Troubleshooting

- **No sound?**
  - Ensure your system volume is not muted.
  - Check that the required audio players are installed:
    - **Linux:** Install `paplay` (PulseAudio) or `aplay` (ALSA).
  - Verify the sound files exist in the `sounds/` folder.

- **Custom sounds not working?**
  - Ensure the file path is correct and points to a valid `.wav` or `.mp3` file.

---

For more details, visit the [GitHub repository](https://github.com/Mrcoderv/TerminalExtension).
