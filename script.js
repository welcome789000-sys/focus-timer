const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const sessionsEl = document.getElementById("sessions");
const modeBtns = document.querySelectorAll(".mode");

let totalSeconds = 25 * 60;
let remaining = totalSeconds;
let timerId = null;
const today = new Date().toDateString();
const saved = JSON.parse(localStorage.getItem("focusTimerSessions") || "{}");
let sessions = saved.date === today ? saved.count : 0;
sessionsEl.textContent = sessions;

function render() {
  const m = String(Math.floor(remaining / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  timeEl.textContent = `${m}:${s}`;
  document.title = `${m}:${s} - Focus Timer`;
}

function stop() {
  clearInterval(timerId);
  timerId = null;
  startBtn.textContent = "Start";
}

function tick() {
  remaining--;
  render();
  if (remaining <= 0) {
    stop();
    if (totalSeconds === 25 * 60) {
      sessions++;
      localStorage.setItem("focusTimerSessions", JSON.stringify({ date: today, count: sessions }));
      sessionsEl.textContent = sessions;
    }
    alert("Time is up!");
    remaining = totalSeconds;
    render();
  }
}

startBtn.addEventListener("click", () => {
  if (timerId) { stop(); return; }
  timerId = setInterval(tick, 1000);
  startBtn.textContent = "Pause";
});

resetBtn.addEventListener("click", () => {
  stop();
  remaining = totalSeconds;
  render();
});

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    stop();
    totalSeconds = Number(btn.dataset.minutes) * 60;
    remaining = totalSeconds;
    render();
  });
});

render();
