# 🎵 Faah & Jai Hoo — Code Sound Effects

> Simple sound effects for your coding tasks!

| Event | Sound |
|-------|-------|
| ❌ Task failure (non-zero exit code) | **Faah!** |
| ✅ Task success (exit code 0) | **Jai Hoo!** |

---

## 🚀 Features

- 🔴 **Faah!** — Plays when a task fails.
- 🟢 **Jai Hoo!** — Plays when a task succeeds.

---

## 🔊 Platform Support

| OS | Audio Method |
|----|-------------|
| Windows | PowerShell MediaPlayer |
| macOS | `afplay` (built-in) |
| Linux | `paplay` (PulseAudio) |

> **Linux users:** Make sure `paplay` (PulseAudio) is installed.

---

## 📂 Sound Files

The extension uses the following sound files located in the `sounds/` directory:

- `faah.wav` — Failure sound
- `jaihoo.wav` — Success sound

---

## 🛠️ How It Works

The extension listens for task completions in VS Code. Depending on the task's exit code, it plays the appropriate sound:

- **Success (exit code 0):** Plays `jaihoo.wav`
- **Failure (non-zero exit code):** Plays `faah.wav`
