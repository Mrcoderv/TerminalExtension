
# 🎵 Faah & Jai Hoo — Code Sound Effects

> Never code in silence again!

| Event                        | Sound              |
| ---------------------------- | ------------------ |
| ✅ Program runs successfully | **Jai Hoo!** |
| ❌ Error / failure           | **Faah!**    |

---

## Features

* Plays on terminal commands, tasks, debug sessions, and editor errors
* Custom sounds — use your own `.mp3` or `.wav`
* Volume control
* Cross-platform — Windows, macOS, Linux

---

## Set a Custom Sound

Open Command Palette (`Ctrl+Shift+P`) → type  **Faah Sound** :

* **Set Custom Faah! Sound** — change the failure sound
* **Set Custom Jai Hoo! Sound** — change the success sound

A file picker will open. Pick any `.mp3`, `.wav`, `.ogg`, or `.m4a` file. To go back to the default, run the same command and choose  **Reset to default** .

---

## Commands

| Command                         | Description              |
| ------------------------------- | ------------------------ |
| `Test Faah! Sound`            | Preview failure sound    |
| `Test Jai Hoo! Sound`         | Preview success sound    |
| `Set Custom Faah! Sound`      | Browse for failure sound |
| `Set Custom Jai Hoo! Sound`   | Browse for success sound |
| `Set Volume`                  | Set volume (0–100)      |
| `Enable / Disable Faah Sound` | Toggle on/off            |

---

## Settings

Search `faahSound` in VS Code Settings:

| Setting                         | Default  | Description                  |
| ------------------------------- | -------- | ---------------------------- |
| `faahSound.enabled`           | `true` | Master on/off                |
| `faahSound.volume`            | `80`   | Volume (0–100)              |
| `faahSound.cooldownMs`        | `1500` | Min ms between sounds        |
| `faahSound.customFaahSound`   | `""`   | Path to custom failure sound |
| `faahSound.customJaiHooSound` | `""`   | Path to custom success sound |

---

> Made with ❤️ by [Raghavvian](https://github.com/Mrcoderv/TerminalExtension)
>
