const API = "http://localhost:3000";
const token = localStorage.getItem("token");

let sessionData = {
  startTime: null,
  interruptions: []
};

let currentPauseStart = null;
let interruptionCount = 0;

let isPausedByAI = false;
let faceReturnSeconds = 0;
let faceMissingSeconds = 0;

let seconds = 0;
let initialSeconds = 0;

let timerInterval = null;
let aiInterval = null;
let studyStartedAt = 0;
let stream = null;

let mode = "focus";
let longBreakMinutes = 15;
let isBreak = false;

const alarm = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const video = document.getElementById("video");

/* ===================== LOAD ===================== */

window.onload = function () {
  if (!token) {
    alert("Login Again");
  } else {
    statusEl.textContent = "Status: Logged in!";
    document.getElementById("loginBtn").remove();
  }
};

/* ===================== TIMER ===================== */

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    seconds--;

    updateTimerDisplay();

    if (seconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;

      alarm.play();

      if (mode === "focus") {
        statusEl.textContent = "Focus session complete!";
      } else {
        statusEl.textContent = "Break finished!";
      }

      stopAI();
      stopCamera();
    }

  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimerDisplay() {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
}

async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

function stopCamera() {
  if (!stream) return;
  stream.getTracks().forEach(track => track.stop());
  video.srcObject = null;
  stream = null;
}

async function startAI() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

  aiInterval = setInterval(async () => {
    if (video.readyState < 2) return;
    if (Date.now() - studyStartedAt < 5000) return;

    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.6 })
    );

    if (detections.length === 0) {
      faceMissingSeconds++;
      faceReturnSeconds = 0;

      if (!isPausedByAI) {
        statusEl.textContent = `Warning: Face missing (${faceMissingSeconds}s)`;
      }

      if (faceMissingSeconds >= 5 && !isPausedByAI) {
        pauseByAI();
      }
    } else {
      faceMissingSeconds = 0;

      if (isPausedByAI) {
        faceReturnSeconds++;
        statusEl.textContent = `Resuming in ${2 - faceReturnSeconds}s`;

        if (faceReturnSeconds >= 2) {
          resumeAfterAI();
        }
      } else {
        statusEl.textContent = "Studying";
      }
    }
  }, 1000);
}

function stopAI() {
  clearInterval(aiInterval);
  aiInterval = null;
  faceMissingSeconds = 0;
}

/* ===================== AI PAUSE ===================== */

function pauseByAI() {
  if (isPausedByAI) return;

  isPausedByAI = true;
  stopTimer();

  currentPauseStart = Date.now();
  interruptionCount++;

  statusEl.textContent = "Paused (away)";
}

function resumeAfterAI() {
  if (!isPausedByAI) return;

  isPausedByAI = false;
  faceReturnSeconds = 0;

  if (currentPauseStart) {
    sessionData.interruptions.push({
      start: currentPauseStart,
      end: Date.now(),
      durationSec: Math.round((Date.now() - currentPauseStart) / 1000)
    });
    currentPauseStart = null;
  }

  startTimer();
  statusEl.textContent = "Studying";
}

/* ===================== MODE HANDLING ===================== */

function configureMode() {
  if (mode === "focus") {
    seconds = 25 * 60;
    isBreak = false;
  }

  if (mode === "short") {
    seconds = 5 * 60;
    isBreak = true;
  }

  if (mode === "long") {
    seconds = longBreakMinutes * 60;
    isBreak = true;
  }

  initialSeconds = seconds;
  updateTimerDisplay();
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const text = tab.innerText.toLowerCase();

    if (text.includes("focus")) mode = "focus";
    if (text.includes("short")) mode = "short";
    if (text.includes("long")) {
      mode = "long";
      longBreakMinutes = parseInt(prompt("Long break minutes:", 15)) || 15;
    }

    stopTimer();
    configureMode();
  });
});

/* ===================== START ===================== */

document.getElementById("startBtn").onclick = async () => {
  if (!token) return alert("Login first");

  sessionData = {
    startTime: Date.now(),
    interruptions: []
  };

  interruptionCount = 0;
  faceMissingSeconds = 0;
  faceReturnSeconds = 0;
  isPausedByAI = false;
  currentPauseStart = null;

  configureMode();
  studyStartedAt = Date.now();

  if (!isBreak) {
    await startCamera();
    startAI();
  }

  startTimer();

  statusEl.textContent = mode === "focus"
    ? "Focus session started"
    : "Break started";
};

/* ===================== STOP ===================== */

document.getElementById("stopBtn").onclick = async () => {
  stopTimer();
  stopAI();
  stopCamera();

  const totalDuration = initialSeconds - seconds;

  const minutes = Math.floor(totalDuration / 60);
  const secs = totalDuration % 60;

  let verdict = "Good session 👍";
  if (interruptionCount >= 3) verdict = "Needs better focus ⚠️";
  if (interruptionCount >= 6) verdict = "Very distracted ❌";

  statusEl.textContent =
    `Session ended • ${minutes}m ${secs}s • Interruptions: ${interruptionCount} • ${verdict}`;
};
