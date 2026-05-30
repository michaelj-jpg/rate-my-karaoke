# 🎤 Rate My Karaoke - Premium PWA Web App

Welcome to **Rate My Karaoke**, a premium, high-fidelity interactive simulation of a digital voting dashboard for karaoke venues. This app lets you explore a simulated dual-screen experience for **Hosts** and **Guests** on a single page!

Designed with a rich, glassmorphic **Cyberpunk Neon Lounge** aesthetic, it features dynamic calculations, responsive design, custom logo uploads, full local persistence, and native **PWA (Progressive Web App)** capabilities.

---

## 💻 Opening and Editing in VS Code

You can easily open, customize, and run this project using Visual Studio Code:

1. **Launch VS Code**.
2. Click **File ➔ Open Folder...** (or press `Ctrl+K Ctrl+O`).
3. Navigate to:  
   `C:\Users\jcox1\.gemini\antigravity\scratch\rate-my-karaoke`  
   and click **Select Folder**.
4. **Interactive Development Tip**:  
   If you install the **Live Server** extension (by Ritwick Dey) in VS Code, you can click **"Go Live"** in the bottom-right status bar. It will spin up a dev server instantly and auto-refresh your browser whenever you save changes!

---

## 🚀 Quick Start Guide (Local Execution)

Here are the three easiest ways to run the app on your computer:

### Method 1: Just Double-Click (Easiest)
1. Open your file explorer and double-click the **[index.html](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/index.html)** file.
2. It will open instantly in your default web browser!

### Method 2: Python HTTP Server (Recommended)
Open a terminal (PowerShell or command prompt) and start a Python web server:
```bash
python -m http.server 8000 --directory "C:\Users\jcox1\.gemini\antigravity\scratch\rate-my-karaoke"
```
Then, open your browser and go to: **[http://localhost:8000](http://localhost:8000)**

### Method 3: Node.js / NPM Server
If you have Node.js installed, run:
```bash
npx -y http-server "C:\Users\jcox1\.gemini\antigravity\scratch\rate-my-karaoke" -p 8080
```
Then, open your browser and go to: **[http://localhost:8080](http://localhost:8080)**

---

## 📱 Mobile PWA Optimization (Installable App)

The app is fully optimized as a **Progressive Web App (PWA)**, making it installable on mobile devices (iOS & Android) so that it behaves like a native application!

### What makes it a PWA?
1. **Web App Manifest (`manifest.json`)**: Configures application naming, orientation, splash screens, and standalone window styling.
2. **Service Worker (`sw.js`)**: Automatically pre-caches core HTML, CSS, JavaScript, and asset resources, allowing the application to load instantly and run **completely offline**.
3. **High-Res App Icon (`icon.png`)**: Implements a custom-generated, gorgeous glowing neon mic branding icon that serves as your home screen app icon.
4. **Mobile Web Headers**: Injected IOS-capable capabilities to hide safari controls, enable black-translucent status bars, and enforce a native standalone container.

### How to install it on a Phone:
1. Open the deployed URL in your phone's browser (e.g., Safari on iOS, Chrome on Android).
2. **iOS (Safari)**: Tap the **Share** button in the bottom menu bar ➔ scroll down and select **"Add to Home Screen"**.
3. **Android (Chrome)**: Tap the three dots in the top-right menu ➔ select **"Install App"** (or *"Add to Home screen"*).
4. The icon will appear on your phone's screen. Launching it from the home screen opens a **sleek, full-screen standalone container** with no browser search bars!

---

## ☁️ Deploying on Vercel (The Gift Setup)

To deploy the app and send it to your friend as a gift, follow these simple steps:

### Option A: Vercel CLI (Super Fast, No GitHub Required)
1. Open your terminal inside the project directory:
   ```bash
   cd "C:\Users\jcox1\.gemini\antigravity\scratch\rate-my-karaoke"
   ```
2. Run Vercel's global deployer:
   ```bash
   npx -y vercel --prod
   ```
3. Log in or create a free Vercel account in the terminal prompt.
4. Vercel will scan the folder, see the static assets and the PWA config, and deploy it in seconds.
5. It will return a **live public URL** that you can immediately send to your friend!

### Option B: GitHub + Vercel Dashboard (Ideal for updates)
1. Push this folder to a new repository on your GitHub account.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..." ➔ "Project"**.
4. Import your new GitHub repository.
5. Leave all settings at their defaults and click **"Deploy"**.
6. Vercel will build it and auto-redeploy every time you push edits to GitHub!

> [!NOTE]
> We have included a pre-configured **[vercel.json](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/vercel.json)** file in the project. This configures clean URLs and ensures that PWA service workers and manifests are bypassed from Vercel's caching layer, ensuring that updates propagate instantly when you edit the app!

---

## 🕹️ How to Simulate the Demo

The app displays the **Host Console** and the **Guest Phone Mockup** side-by-side on desktop screens, allowing you to simulate the live venue environment interactively.

1. **Host Performer Selection**:  
   On the **Host Console** (left), select a performer (e.g. **Tyler Robinson**).
2. **Real-Time Sync**:  
   Watch the **Guest Phone** (right) instantly update to show: *"Now Performing: Tyler Robinson"*.
3. **Submit Guest Scores**:  
   On the **Guest Phone**, drag the glowing sliders to rate Tyler on *Lyric Accuracy*, *Tone Quality*, and *Crowd Reaction*, then click **Submit Anonymous Rating**.
4. **Dynamic Scoreboards**:  
   The guest screen transitions into a beautiful checkmark success screen with a vote receipt. Meanwhile, the **Leaderboard** on the Host Console instantly calculates the new average, increments the vote count, and resorts the ranks with smooth transitions!
5. **Branding customization**:  
   Click the **Upload Custom Logo** button in the Host Console to upload an image file. It immediately replaces the default microphone icon in the main header and persists!
6. **Add Custom Performer**:  
   Type a new name in the text field (e.g., *"John Doe"*) and click **Add**. They will be added to the selector, instantly set as active, and added to the scorecard.

---

## 📁 File Structure

* [index.html](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/index.html) - Structural semantic HTML5 layout & interactive template scripts.
* [style.css](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/style.css) - Vanilla CSS3 neon styling, animations, range input resets, and responsive media queries.
* [app.js](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/app.js) - State management, event handling, dynamic leaderboard sorting, local storage operations, and uploader handlers.
* [manifest.json](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/manifest.json) - PWA application metadata config.
* [sw.js](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/sw.js) - Offline pre-caching service worker logic.
* [icon.png](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/icon.png) - High-res neon mic branding logo & mobile icon asset.
* [vercel.json](file:///C:/Users/jcox1/.gemini/antigravity/scratch/rate-my-karaoke/vercel.json) - Deployment header and clean route caching config.
