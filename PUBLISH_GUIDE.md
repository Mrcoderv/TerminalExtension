# 📦 How to Publish Faah Sound to VS Code Marketplace

Follow these steps carefully. Takes ~15 minutes total.

---

## STEP 1 — Install Prerequisites

```bash
# Install Node.js (if not already installed)
# Download from https://nodejs.org (v16 or higher)

# Install vsce (VS Code Extension Manager)
npm install -g @vscode/vsce
```

---

## STEP 2 — Create a Microsoft Account

1. Go to https://marketplace.visualstudio.com
2. Click **Sign In** (top right)
3. Use or create a **Microsoft account** (Outlook, Hotmail, or any Microsoft account)

---

## STEP 3 — Create a Publisher

1. Go to: https://marketplace.visualstudio.com/manage
2. Click **Create Publisher**
3. Fill in:
   - **Publisher ID**: e.g., `yourname` (lowercase, no spaces — this goes in package.json)
   - **Display Name**: Your Name or Team Name
4. Click **Create**

---

## STEP 4 — Create a Personal Access Token (PAT)

1. Go to: https://dev.azure.com
2. Sign in → Click your **profile icon** (top right) → **Personal Access Tokens**
3. Click **+ New Token**
4. Fill in:
   - **Name**: `vsce-faah-sound`
   - **Organization**: Select **All accessible organizations**
   - **Expiration**: 1 year (or custom)
   - **Scopes**: Select **Custom defined** → check **Marketplace → Manage**
5. Click **Create**
6. ⚠️ **COPY THE TOKEN NOW** — it won't be shown again!

---

## STEP 5 — Update package.json

Open `package.json` and update:

```json
{
  "publisher": "YOUR_PUBLISHER_ID",  ← Replace with your Publisher ID from Step 3
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/faah-sound"  ← Optional but recommended
  }
}
```

---

## STEP 6 — Add an Icon (Required for Marketplace)

Create or add a `icon.png` file (128x128 or 256x256 pixels) in the extension root folder.

```
faah-extension/
├── icon.png       ← Add this!
├── extension.js
├── package.json
└── sounds/
```

You can use any image — make it fun! (e.g., a speaker emoji as PNG)

---

## STEP 7 — Login with vsce

```bash
cd faah-extension

# Login with your publisher name and PAT
vsce login YOUR_PUBLISHER_ID
# Paste your Personal Access Token when prompted
```

---

## STEP 8 — Package the Extension (Optional Test)

```bash
# Creates a .vsix file — install locally to test first!
vsce package

# Install locally to test:
code --install-extension faah-sound-1.0.0.vsix
```

---

## STEP 9 — Publish!

```bash
# Publish to VS Code Marketplace
vsce publish

# OR publish with a specific version bump:
vsce publish patch   # 1.0.0 → 1.0.1
vsce publish minor   # 1.0.0 → 1.1.0
vsce publish major   # 1.0.0 → 2.0.0
```

---

## STEP 10 — Verify on Marketplace

1. Go to: https://marketplace.visualstudio.com/manage/publishers/YOUR_PUBLISHER_ID
2. Your extension should appear within **5-10 minutes**
3. Public URL: `https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_ID.faah-sound`

---

## 🔄 Publishing Updates

When you make changes:

1. Update `"version"` in `package.json` (e.g., `"1.0.1"`)
2. Run `vsce publish`

Or use shorthand:
```bash
vsce publish patch   # Auto-bumps patch version
```

---

## ❓ Troubleshooting

| Error | Fix |
|-------|-----|
| `Missing publisher name` | Add `"publisher": "yourname"` to package.json |
| `Unauthorized (401)` | Re-run `vsce login` with correct PAT |
| `Missing icon` | Add `icon.png` to root folder |
| `Missing repository` | Add `"repository"` field to package.json or use `--allow-missing-repository` flag |
| Token expired | Create a new PAT in Azure DevOps |

---

## 💡 Tips

- Add a **CHANGELOG.md** to describe updates
- Add **screenshots** in README.md (marketplace shows them!)
- Use **keywords** in package.json for better discoverability
- Star your own GitHub repo for credibility 😄

---

**You're live! Share your extension URL and let everyone Faah and Jai Hoo! 🎉**

## Packaging Your Extension

Ensure you have packaged your extension in a VSIX file format. You can use the `vsce` tool to package your extension. Run the following command in your terminal:

```bash
vsce package
```

This will generate a `.vsix` file that you can use to publish your extension.
