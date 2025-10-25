# 🚀 Chrome Extension Auto-Deploy Setup Guide

This guide will help you set up automated deployment of your Task Tracker Chrome Extension to the Chrome Web Store using GitHub Actions.

## 📋 Prerequisites

- GitHub repository (you already have this!)
- Google Chrome Web Store Developer account
- Chrome extension published at least once manually

## 🔧 Setup Steps

> **⚠️ Important:** This is a two-phase setup because you need to publish your extension once manually to get the Extension ID, then complete the OAuth setup for automation.

### Phase 1: Initial Setup & Manual Publish

### Step 1: Chrome Web Store Developer Account & API Setup

1. **Sign up for Chrome Web Store Developer**
   - Go to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/)
   - Pay the $5 one-time registration fee
   - Verify your developer account

2. **Create Google Cloud Project & Enable API**
   ```bash
   # Go to Google Cloud Console
   https://console.cloud.google.com/
   
   # Create new project or select existing
   # Enable "Chrome Web Store API"
   # Go to APIs & Services > Chrome Web Store API > Enable
   ```

3. **Create OAuth2 Credentials** *(Skip this step initially - see note below)*
   - Go to `APIs & Services` > `Credentials`
   - Click `Create Credentials` > `OAuth 2.0 Client IDs`
   - Application type: `Chrome Extension`
   - Name: `TaskTracker0AuthClient` (or your preferred name)
   - **Item ID**: Leave blank for now (you'll get this after first publish)
   - Download the JSON file (keep it safe!)

   > **📝 Note:** You can create the OAuth credentials without the Item ID first, then update them later after you get your extension ID from the Chrome Web Store.

4. **Get Refresh Token** *(Also skip initially)*
   ```bash
   # Use Google OAuth2 Playground
   https://developers.google.com/oauthplayground/
   
   # Step 1: Select "Chrome Web Store API v1.1"
   # Step 2: Authorize APIs (login with your developer account)
   # Step 3: Exchange authorization code for tokens
   # Copy the "Refresh token" - you'll need this!
   ```

### Step 2: Publish Extension Initially (Manual - One Time Only)

1. **Package your extension**
   ```bash
   npm run build
   ```

2. **Upload to Chrome Web Store**
   - Go to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/)
   - Click `Add new item`
   - Upload `task-tracker-extension.zip`
   - Fill in all required information:
     - Store listing details
     - Screenshots (at least 1 screenshot required)
     - Category: Productivity
     - Privacy policy (if needed)
   - Submit for review

3. **Get Extension ID**
   - After upload, note the Extension ID from the URL
   - Format: `abcdefghijklmnopqrstuvwxyzabcdef`
   - **Save this!** You'll need it for the next phase

---

### Phase 2: Complete OAuth Setup for Automation

Now that you have your Extension ID, complete the OAuth setup:

### Step 3: Complete OAuth2 Credentials

1. **Update your OAuth2 Credentials** (go back to Google Cloud Console)
   - Go to `APIs & Services` > `Credentials`
   - Find your previously created OAuth client
   - Click the edit button (pencil icon)
   - **Item ID**: Enter your Extension ID from Step 2.3
   - Save the changes
   - Download the updated JSON file

2. **Get Refresh Token**
   ```bash
   # Use Google OAuth2 Playground
   https://developers.google.com/oauthplayground/
   
   # Step 1: Select "Chrome Web Store API v1.1"  
   # Step 2: Authorize APIs (login with your developer account)
   # Step 3: Exchange authorization code for tokens
   # Copy the "Refresh token" - you'll need this!
   ```

### Step 4: Configure GitHub Secrets

Go to your GitHub repository and add these secrets:

1. **Repository Settings** > **Secrets and variables** > **Actions** > **New repository secret**

2. **Add these 4 secrets:**

   ```
   CHROME_EXTENSION_ID
   Value: your-extension-id-from-step-2
   
   CHROME_CLIENT_ID  
   Value: from OAuth2 credentials JSON file
   
   CHROME_CLIENT_SECRET
   Value: from OAuth2 credentials JSON file
   
   CHROME_REFRESH_TOKEN
   Value: from OAuth2 playground step
   ```

### Step 4: Test the Deployment

1. **Make a small change** to trigger deployment:
   ```bash
   # Bump version and commit
   npm run prepare-release
   
   # Push to trigger deployment  
   npm run deploy
   ```

2. **Check GitHub Actions**
   - Go to your repo > `Actions` tab
   - Watch the deployment workflow run
   - Check for any errors in the logs

## 🎯 How It Works

### Automatic Deployment Triggers
- **Push to main branch** with changes to extension files
- **Manual trigger** via GitHub Actions UI
- **Version bumps** automatically create releases

### Workflow Process
1. 🔍 **Detects changes** to extension files
2. 📦 **Builds extension** package
3. 📤 **Uploads to Chrome Web Store** 
4. 🏷️ **Creates GitHub release** with version tag
5. 📎 **Attaches extension ZIP** to release
6. ✅ **Notifies success/failure**

## 🛠️ Development Workflow

### For Quick Updates:
```bash
# Make your changes to the extension files
# Then use the helper script:
npm run prepare-release
npm run deploy

# This will:
# 1. Bump version number
# 2. Update manifest.json  
# 3. Commit changes
# 4. Push to trigger auto-deploy
```

### For Manual Version Control:
```bash
# Edit package.json version manually
# Update manifest.json version to match
npm run update-manifest

# Commit and push
git add .
git commit -m "Update extension to v1.0.1"
git push origin main
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid refresh token"**
   - Regenerate refresh token using OAuth2 playground
   - Update GitHub secret

2. **"Extension not found"**  
   - Check CHROME_EXTENSION_ID is correct
   - Ensure extension was published manually first

3. **"Quota exceeded"**
   - Chrome Web Store has daily upload limits
   - Wait 24 hours or contact support

4. **Build fails**
   - Check all required files are present
   - Verify ZIP package contains correct files

### Debug Steps:
```bash
# Test build locally
npm run build
unzip -l task-tracker-extension.zip

# Check version sync
node -p "require('./package.json').version"
node -p "require('./manifest.json').version"
```

## 📈 Version Management

The system automatically handles version numbers:

- **package.json**: Source of truth for version
- **manifest.json**: Synced automatically  
- **GitHub releases**: Created with version tags
- **Chrome Web Store**: Updated with new version

### Manual Version Bump:
```bash
# Patch version (1.0.0 -> 1.0.1)
npm run version-bump

# Or edit manually:
# 1. Edit package.json version
# 2. Run: npm run update-manifest
# 3. Commit and push
```

## 🎉 Success!

Once set up, your workflow is:

1. **Make changes** to extension files
2. **Push to GitHub** 
3. **Automatic deployment** happens!
4. **Users get updates** automatically

No more manual uploads, zipping, or Chrome Web Store visits! 🚀

---

## 📞 Support

If you run into issues:
- Check GitHub Actions logs for detailed error messages
- Verify all secrets are set correctly  
- Ensure Chrome Web Store developer account is active
- Test with a small change first

**Happy deploying!** 🎊