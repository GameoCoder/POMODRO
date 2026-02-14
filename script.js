// const API = "http://127.0.0.1:3000";

// let token = null;
// let currentSessionId = null;

// // Timer state
// let seconds = 0;
// let timerInterval = null;

// // UI elements
// const statusEl = document.getElementById("status");
// const timerEl = document.getElementById("timer");

// // =======================
// // TIMER FUNCTIONS
// // =======================

// function startTimer() {
//   if (timerInterval) return;

//   timerInterval = setInterval(() => {
//     seconds++;
//     const min = String(Math.floor(seconds / 60)).padStart(2, "0");
//     const sec = String(seconds % 60).padStart(2, "0");
//     timerEl.textContent = `${min}:${sec}`;
//   }, 1000);
// }

// function stopTimer() {
//   clearInterval(timerInterval);
//   timerInterval = null;
// }

// // =======================
// // LOGIN
// // =======================

// document.getElementById("loginBtn").onclick = async () => {
//   try {
//     const res = await fetch(`${API}/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: "test@example.com",
//         password: "123456"
//       })
//     });

//     const data = await res.json();
//     token = data.token;

//     statusEl.textContent = "Status: Logged in";
//   } catch (err) {
//     console.error(err);
//     alert("Login failed");
//   }
// };

// // =======================
// // START STUDY
// // =======================

// document.getElementById("startBtn").onclick = async () => {
//   if (!token) {
//     alert("Login first");
//     return;
//   }

//   try {
//     const res = await fetch(`${API}/sessions/start`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     const data = await res.json();
//     currentSessionId = data.id;

//     seconds = 0;
//     timerEl.textContent = "00:00";
//     startTimer();

//     statusEl.textContent = "Status: Studying";
//   } catch (err) {
//     console.error(err);
//     alert("Failed to start session");
//   }
// };

// // =======================
// // STOP STUDY
// // =======================

// document.getElementById("stopBtn").onclick = async () => {
//   if (!token) return;

//   try {
//     await fetch(`${API}/sessions/stop`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     stopTimer();
//     statusEl.textContent = "Status: Stopped";
//   } catch (err) {
//     console.error(err);
//     alert("Failed to stop session");
//   }
// };

// // =======================
// // SIMULATE AI PAUSE
// // =======================

// document.getElementById("pauseBtn").onclick = async () => {
//   if (!token) return;

//   try {
//     await fetch(`${API}/sessions/pause`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     stopTimer();
//     statusEl.textContent = "Status: Paused by AI";
//   } catch (err) {
//     console.error(err);
//     alert("Failed to pause session");
//   }
// };
