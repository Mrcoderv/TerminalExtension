
# 📦 Publish Guide — Faah & Jai Hoo

A step-by-step guide to packaging and publishing this extension to the VS Code Marketplace.

---

## 🛠️ Prerequisites

Make sure you have Node.js installed, then install `vsce`:

```bash
npm install -g @vscode/vsce
```

---

## 📁 Required File Structure

Before packaging, make sure your folder looks like this:

```
📁 faah-extension/
├── 📁 sounds/
│   ├── fahhh.wav
│   └── jaihoo.wav
├── extension.js
├── package.json
├── icon.png
├── README.md
├── LICENSE.txt
├── .vscodeignore
└── .gitignore
```

---

## 📦 Step 1 — Package the Extension Locally

Run this in the project root to generate a `.vsix` file:

```bash
vsce package
```

This creates `terminal-jaihoo-and-faah-x.x.x.vsix` in the same folder.

---

## 🧪 Step 2 — Test Locally Before Publishing

Install the `.vsix` directly in VS Code:

```
1. Open VS Code
2. Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)
3. Type: Extensions: Install from VSIX...
4. Select your .vsix file
5. Reload VS Code
6. Run any task and listen for the sound!
```

---

## 🚀 Step 3 — Publish to VS Code Marketplace

### 3a. Create a Publisher Account

1. Go to https://marketplace.visualstudio.com/manage
2. Sign in with your Microsoft account
3. Create a publisher with the name `Raghavvian`

### 3b. Create a Personal Access Token (PAT)

1. Go to https://dev.azure.com
2. Click your profile → **Personal Access Tokens**
3. Click **New Token**
   * Name: `vsce-publish`
   * Organization: **All accessible organizations**
   * Expiration: 1 year
   * Scopes: **Marketplace → Manage**
4. Copy the token (you won't see it again!)

### 3c. Login with vsce

```bash
vsce login Raghavvian
# Paste your PAT when prompted
```

### 3d. Publish

```bash
vsce publish
```

Or publish and bump the version in one step:

```bash
vsce publish patch   # 1.3.0 → 1.3.1
vsce publish minor   # 1.3.0 → 1.4.0
vsce publish major   # 1.3.0 → 2.0.0
```

---

## 🔄 Updating the Extension

1. Make your changes
2. Bump the version in `package.json`
3. Run `vsce publish` or `vsce publish patch`

---

## 🔗 Useful Links

* VS Code Marketplace: https://marketplace.visualstudio.com/manage
* Azure DevOps (PAT): https://dev.azure.com
* vsce docs: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
* Your extension repo: https://github.com/Mrcoderv/TerminalExtension
