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
- **Jai Hoo** (जय हो) — Victory! Glory! 

Made with ❤️ for developers who feel things deeply.
