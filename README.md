
# 🎵 Faah & Jai Hoo — Code Sound Effects

> Simple sound effects for your coding tasks. Never code in silence again!

| Event                                | Sound              |
| ------------------------------------ | ------------------ |
| ❌ Task failure (non-zero exit code) | **Faah!**    |
| ✅ Task success (exit code 0)        | **Jai Hoo!** |

---

## 🚀 Features

* 🔴 **Faah!** — Plays when a task fails.
* 🟢 **Jai Hoo!** — Plays when a task succeeds.
* 🔊 **Volume control** — Set volume from 0 to 100.
* 🎵 **Custom sounds** — Use your own `.wav` files.
* ✅ **Enable / Disable** — Toggle sounds without uninstalling.
* 🧪 **Test commands** — Preview sounds anytime from the Command Palette.

---

## 🔊 Platform Support

| OS      | Audio Method                                      |
| ------- | ------------------------------------------------- |
| Windows | PowerShell `System.Media.SoundPlayer`(built-in) |
| macOS   | `afplay`(built-in)                              |
| Linux   | Auto-detects best available player (see below)    |

### 🐧 Linux Audio — Auto Fallback

The extension automatically tries these players in order — no setup needed if any one is installed:

| Priority | Player     | Install command                       |
| -------- | ---------- | ------------------------------------- |
| 1st      | `paplay` | `sudo apt install pulseaudio-utils` |
| 2nd      | `aplay`  | `sudo apt install alsa-utils`       |
| 3rd      | `ffplay` | `sudo apt install ffmpeg`           |
| 4th      | `mpg123` | `sudo apt install mpg123`           |
| 5th      | `cvlc`   | `sudo apt install vlc`              |

> Most Linux systems already have `aplay` (ALSA) built in — so it should just work out of the box.

---

## 📂 Sound Files

The extension uses the following sound files located in the `sounds/` directory:

* `fahhh.wav` — Failure sound
* `jaihoo.wav` — Success sound

---

## 🛠️ How It Works

The extension listens for task completions in VS Code. Depending on the task's exit code, it plays the appropriate sound:

* **Success (exit code 0):** Plays `jaihoo.wav`
* **Failure (non-zero exit code):** Plays `fahhh.wav`

---

## ⌨️ Commands

Access these from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command                 | Description               |
| ----------------------- | ------------------------- |
| `Test Faah! Sound`    | Preview the failure sound |
| `Test Jai Hoo! Sound` | Preview the success sound |
| `Enable Faah Sound`   | Turn sounds on            |
| `Disable Faah Sound`  | Turn sounds off           |
| `Set Volume`          | Set volume level (0–100) |

---

## ⚙️ Settings

| Setting                         | Default  | Description                           |
| ------------------------------- | -------- | ------------------------------------- |
| `faahSound.enabled`           | `true` | Enable or disable all sound effects   |
| `faahSound.enableFaah`        | `true` | Toggle failure sound independently    |
| `faahSound.enableJaiHoo`      | `true` | Toggle success sound independently    |
| `faahSound.volume`            | `80`   | Volume level (0–100)                 |
| `faahSound.customFaahSound`   | `""`   | Path to a custom failure `.wav`file |
| `faahSound.customJaiHooSound` | `""`   | Path to a custom success `.wav`file |

---

## 📦 Repository

[GitHub — Mrcoderv/TerminalExtension](https://github.com/Mrcoderv/TerminalExtension)

---

> Made with ❤️ by Raghavvian
>
