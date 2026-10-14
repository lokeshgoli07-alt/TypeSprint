# ⚡ TypeSprint — Modern Precision Typing Trainer

**TypeSprint** is a modern, responsive, distraction-free typing speed trainer built with vanilla **HTML5**, **CSS3**, and **JavaScript**. It features real-time WPM analytics, customizable durations and difficulty tiers, realistic mechanical audio feedback generated via Web Audio API, anti-paste protection, and local persistence.

---

## 🌟 Key Features

### 1. Modern Dark Navy & Cyan Aesthetics
- **Theme Support:** Dark Navy default (`#0a0e1a`) with vibrant electric indigo and cyan accents, plus a fully styled light theme.
- **Glassmorphism:** Frosted surface cards, ambient blurred background glow orbs, and smooth transitions.
- **Responsive Layout:** Optimized for desktop monitors, laptops, tablets, and mobile screens.

### 2. Live Dashboard & Telemetry
- **Typing Speed (WPM):** Real-time calculated speed using standardized 5-character word metrics:
  $$\text{WPM} = \frac{\text{Correct Characters} / 5}{\text{Elapsed Time in Minutes}}$$
- **Accuracy (%):**
  $$\text{Accuracy} = \frac{\text{Correct Characters}}{\text{Total Typed Characters}} \times 100$$
- **Live Countdown Timer:** Displays formatted remaining time (`mm:ss`) with a warning state when $\le 10$ seconds remain.
- **Correct Characters Counter:** Displays current position and characters matched.
- **Dynamic Progress Bar:** Visual indicator displaying progress through the passage.

### 3. Precision Typing Practice Area
- **Smooth Caret:** Real-time floating caret that moves dynamically and auto-scrolls through multi-line passages.
- **Next-Character Highlight:** Pulsing glowing cyan highlight on the upcoming character so you always know what to press next.
- **Character Highlighting:**
  - 🟢 **Green:** Correctly typed characters.
  - 🔴 **Red:** Incorrectly typed characters.
  - 🔵 **Cyan Pulse:** Next character to type.
  - 🔘 **Muted:** Upcoming untyped characters.
- **Letter Case Flexibility:**
  - **Exact (Aa):** Strict casing; requires <kbd>Shift</kbd> for capital letters (default).
  - **Ignore (aa):** Case-insensitive practice; lowercase and uppercase both count as correct.
- **Dynamic Key Helpers:**
  - `⇧ Shift + [Key]` badge whenever a capital letter is upcoming.
  - `⇪ Caps Lock ON` alert badge when Caps Lock is unexpectedly active.
- **Anti-Paste Protection:** Clipboard paste events are blocked with feedback to encourage honest muscle memory practice.
- **Auto-Start:** Simply start typing to begin the countdown timer automatically.

### 4. Practice Text Library
- **60+ Diverse Passages:** Categorized into three difficulty tiers:
  - **Beginner (20 passages):** Simple everyday topics, common vocabulary, basic punctuation.
  - **Intermediate (20 passages):** Science, philosophy, history, and compound sentences.
  - **Advanced (20 passages):** Programming code patterns, technical jargon, numbers, and special symbols.
- **Randomization:** Avoids immediate repeats for consecutive tests.

### 5. Mechanical Switch Audio Engine (Web Audio API)
- **Zero Audio Files Needed:** Pure browser synthesis using oscillators, noise buffers, and biquad filters.
- **Distinct Sound Cues:**
  - Alpha keys: High-frequency click + body resonance thock.
  - Spacebar: Deep, hollow stabilizer thock.
  - Backspace: Soft double-tap click.
  - Typo / Error: Subdued low-frequency error cue.
  - Test Completion: Uplifting arpeggio completion chime ($C_5 - E_5 - G_5 - C_6$).
- **Toggleable:** Easily mute/unmute via the header sound button.

### 6. Results Modal & History Tracking
- **Detailed Scorecard:** Final WPM, Accuracy %, Total Characters Typed, Correct Chars, Incorrect Chars, and Elapsed Time.
- **Speed Progression Chart:** Native inline SVG sparkline graph showing WPM progression over the duration of the test.
- **Performance Tiers & Motivational Feedback:** Dynamically assigned rank badges (e.g., *Novice*, *Swift*, *Pro Sprinter*, *Rocket*, *Legend*).
- **Local Persistence (`localStorage`):** Tracks your all-time Personal Best WPM and logs the last 30 tests in the Test History modal.
- **Share Result:** One-click copy formatted score card to clipboard.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Esc</kbd> | Instant Restart of the current test |
| <kbd>Alt</kbd> + <kbd>P</kbd> | Pause / Resume the active test |
| <kbd>Space</kbd> | Resume when test is paused |
| <kbd>Enter</kbd> | Start a new test when on the Results modal |
| Any typing key | Automatically focuses the typing area |

---

## 🚀 How to Run Locally

### Option 1: Zero-Dependency Node.js Server (Included)
Run the bundled lightweight static server:
```bash
node server.js
```
Then open your browser at:
```
http://localhost:8080/
```

### Option 2: Python Built-in HTTP Server
```bash
python -m http.server 8080
```
Then navigate to:
```
http://localhost:8080/
```

### Option 3: Direct File Opening
Double-click `index.html` in your file explorer to open it directly in Chrome, Edge, Firefox, or Safari. All features (including Web Audio and LocalStorage) work seamlessly without an active internet connection.

---

## 📁 File Structure

```text
d:/typO/
├── index.html         # Semantic HTML5 layout and modal overlays
├── css/
│   └── style.css      # Comprehensive CSS design system, themes, and animations
├── js/
│   ├── texts.js       # 60+ categorized practice passages and randomizer
│   ├── sound.js       # Pure Web Audio synthesizer for mechanical keyboard clicks
│   ├── storage.js     # LocalStorage persistence for best WPM, history, and preferences
│   └── app.js         # Core typing engine, state management, and real-time calculations
├── server.js          # Lightweight local static server
└── README.md          # Documentation and user guide
```
