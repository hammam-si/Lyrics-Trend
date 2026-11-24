# Lyrics-Trend — Coding Lyrics Visualizer

A minimalist, terminal-inspired lyric visualizer built with HTML, CSS, Vanilla JavaScript, and GSAP. Lyrics are rendered as syntax-highlighted pseudo-code with a character-by-character glitch decode effect, synchronized directly to audio playback.

## Features

- **Audio-Synchronized Timeline:** Uses `requestAnimationFrame` locked to `audio.currentTime` for frame-accurate lyric triggers without timer drift.
- **Scramble / Glitch Decode Effect:** Flashes randomized symbols (`$%#*@^&!?~¥/\|<>`) before locking each character into syntax-highlighted tokens.
- **2D Camera Tracking (`#camera-rig`):** Smoothly pans horizontally when lines extend past `68%` of the viewport width and shifts vertically to keep the active line centered.
- **Depth Opacity Decay:** Gradually fades previous lines (`1.0` -> `0.38` -> `0.16` -> `0.06`) to maintain focus on the active lyric.
- **Reduced-Motion Support:** Uses `gsap.matchMedia()` to disable camera motion and scramble flashes when `prefers-reduced-motion: reduce` is active.

## Tech Stack

- HTML5 & CSS3
- Vanilla JavaScript (ES6+)
- [GSAP 3.12.5](https://gsap.com/) (Core & `matchMedia`)
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

## Project Structure

```text
├── index.html
├── style.css
├── script.js
├── .gitignore
└── README.md
```

## Setup & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hammam-si/Lyrics-Trend.git
   cd Lyrics-Trend
   ```

2. **Add the audio file:**
   Place your local MP3 track in the root directory and rename it to `Audio.mp3` (matching the `src` attribute on `<audio id="bgm">` in `index.html`).

3. **Run locally:**
   Launch `index.html` using VS Code **Live Server** (or any local HTTP server), press **F11** for fullscreen, and click anywhere on the screen to start playback.

## Credits

- **Song:** *Merry Christmas, Please Don't Call* by Bleachers
- **Animation Engine:** GreenSock Animation Platform (GSAP)
