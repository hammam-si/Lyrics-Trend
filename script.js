const LINES = [
  {
    time: 0.0,
    speed: 34,
    tokens: [
      { comment: "// merry christmas, please don't call..." }
    ]
  },
  {
    time: 0.6,
    speed: 36,
    tokens: [
      { id: "i_would" }, { punc: "." }, { fn: "rather_burn" },
      { punc: "( " }, { str: '"forever"' }, { punc: " );" }
    ]
  },
  {
    time: 3.5,
    speed: 34,
    tokens: [
      { kw: "if" }, { punc: " (!" }, { id: "you" }, { punc: "." },
      { fn: "should_know" }, { punc: "()) {" }
    ]
  },
  {
    time: 5.6,
    speed: 35,
    tokens: [
      { id: "that_i" }, { punc: "." }, { fn: "died" },
      { punc: "( " }, { str: '"slow"' }, { punc: " ) };" }
    ]
  },
  {
    time: 8.0,
    speed: 33,
    tokens: [
      { id: "running" }, { punc: "." }, { fn: "through_the_halls" },
      { punc: "( " }, { str: '"of_your_haunted_home"' }, { punc: " );" }
    ]
  },
  {
    time: 11.6,
    speed: 34,
    tokens: [
      { kw: "const" }, { id: " selfish_part = " }, { fn: "we_both_know" },
      { punc: "( " }, { str: '"true"' }, { punc: " );" }
    ]
  },
  {
    time: 15.1,
    speed: 32,
    tokens: [
      { id: "what" }, { punc: "." }, { fn: "happened" },
      { punc: "( " }, { str: '"to_you"' }, { punc: " );" }
    ]
  },
  {
    time: 17.2,
    speed: 32,
    tokens: [
      { id: "why_you" }, { punc: "." }, { fn: "rattle" },
      { punc: "( " }, { str: '"your_bones"' }, { punc: " );" }
    ]
  },
  {
    time: 19.8,
    speed: 38,
    tokens: [
      { id: "merry" }, { punc: "." }, { fn: "christmas" },
      { punc: "()," }
    ]
  },
  {
    time: 21.9,
    speed: 40,
    tokens: [
      { id: "please" }, { punc: "." }, { fn: "dont_call" },
      { punc: "();" }
    ]
  },
  {
    time: 24.8,
    speed: 55,
    tokens: [
      { handle: "@mamm12__" }
    ]
  }
];

const GLITCH_CHARS = "$%#*@^&!?~¥/\\|<>";
const MAX_VISIBLE_LINES = 4;

const startScreen = document.getElementById("start-screen");
const cameraRig = document.getElementById("camera-rig");
const editor = document.getElementById("editor");
const audio = document.getElementById("bgm");

let started = false;
let currentLineIndex = 0;
let activeCursor = null;
let activeLineEl = null;
let reduceMotion = false;

const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  reduceMotion = true;
  return () => { reduceMotion = false; };
});

startScreen.addEventListener("click", () => {
  if (started) return;
  started = true;

  gsap.to(startScreen, {
    autoAlpha: 0,
    duration: reduceMotion ? 0 : 0.45,
    ease: "power2.out"
  });

  audio.play().catch(() => {});
  requestAnimationFrame(syncLoop);
});

function syncLoop() {
  const elapsed = audio.currentTime;

  while (currentLineIndex < LINES.length && elapsed >= LINES[currentLineIndex].time) {
    typeLine(LINES[currentLineIndex]);
    currentLineIndex++;
  }

  updateCameraFocus();

  if (currentLineIndex < LINES.length || !audio.paused) {
    requestAnimationFrame(syncLoop);
  }
}

function updateCameraFocus() {
  if (!activeLineEl || !activeCursor) return;

  const lineOffsetY = activeLineEl.offsetTop;
  const cursorOffsetX = activeCursor.offsetLeft;
  const safeVisibleWidth = window.innerWidth * 0.68;
  const targetX = cursorOffsetX > safeVisibleWidth ? -(cursorOffsetX - safeVisibleWidth) : 0;

  gsap.to(cameraRig, {
    x: targetX,
    y: -lineOffsetY,
    duration: reduceMotion ? 0 : 0.35,
    ease: "power2.out",
    overwrite: "auto"
  });
}

function updateLineOpacities() {
  const lines = Array.from(editor.querySelectorAll(".code-line"));
  const total = lines.length;

  lines.forEach((line, idx) => {
    const dist = total - 1 - idx;
    let targetAlpha = 0;

    if (dist === 0) targetAlpha = 1;
    else if (dist === 1) targetAlpha = 0.38;
    else if (dist === 2) targetAlpha = 0.16;
    else if (dist < MAX_VISIBLE_LINES) targetAlpha = 0.06;

    gsap.to(line, {
      autoAlpha: targetAlpha,
      duration: reduceMotion ? 0 : 0.4,
      ease: "power1.out",
      overwrite: "auto"
    });
  });
}

function randomGlitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function typeLine(lineObj) {
  if (activeCursor) {
    activeCursor.remove();
  }

  const lineEl = document.createElement("div");
  lineEl.className = "code-line";

  const contentEl = document.createElement("span");
  const scrambleEl = document.createElement("span");
  scrambleEl.className = "scramble-char";

  const cursorEl = document.createElement("span");
  cursorEl.className = "cursor";
  cursorEl.textContent = "_";

  lineEl.appendChild(contentEl);
  lineEl.appendChild(scrambleEl);
  lineEl.appendChild(cursorEl);
  editor.appendChild(lineEl);

  activeLineEl = lineEl;
  activeCursor = cursorEl;

  gsap.fromTo(
    lineEl,
    { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.25, ease: "power2.out" }
  );

  updateLineOpacities();

  const chars = [];
  lineObj.tokens.forEach((token) => {
    const cls = Object.keys(token)[0];
    const text = token[cls];
    for (const ch of text) {
      chars.push({ ch, cls });
    }
  });

  let i = 0;
  let currentSpan = null;
  let lastCls = null;
  const stepDelay = lineObj.speed || 35;

  const timer = setInterval(() => {
    if (i >= chars.length) {
      scrambleEl.textContent = "";
      clearInterval(timer);
      return;
    }

    const { ch, cls } = chars[i];

    if (!reduceMotion && ch !== " ") {
      scrambleEl.textContent = randomGlitchChar();
      setTimeout(() => {
        if (scrambleEl.textContent) scrambleEl.textContent = "";
      }, Math.max(16, stepDelay * 0.6));
    }

    if (cls !== lastCls) {
      currentSpan = document.createElement("span");
      currentSpan.className = cls;
      contentEl.appendChild(currentSpan);
      lastCls = cls;
    }

    currentSpan.textContent += ch;
    i++;
  }, stepDelay);
}