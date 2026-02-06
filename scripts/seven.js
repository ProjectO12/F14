 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAo2PlDvTAm3p_r6AxjPu9REznEaUb50pc",
    authDomain: "project012-72667.firebaseapp.com",
    databaseURL: "https://project012-72667-default-rtdb.firebaseio.com",
    projectId: "project012-72667",
    storageBucket: "project012-72667.appspot.com",
    messagingSenderId: "1015186451511",
    appId: "1:1015186451511:web:86adc349360eef195923b2"
};

    const steps = document.querySelectorAll("#stepper .step");

    // Use local year automatically
    const YEAR = new Date().getFullYear();

    // Valentine week schedule (same order as your tracker)
    const daySchedule = [
        new Date(YEAR, 1, 7),  // one.html  – Rose
        new Date(YEAR, 1, 8),  // two.html
        new Date(YEAR, 1, 9),  // three.html
        new Date(YEAR, 1, 10), // four.html
        new Date(YEAR, 1, 11), // five.html
        new Date(YEAR, 1, 12), // six.html
        new Date(YEAR, 1, 14)  // seven.html
    ];

    const today = new Date();
    today.setHours(0,0,0,0);

    steps.forEach((step, i) => {

        const link = step.querySelector("a");
        const circle = step.querySelector(".circle");

        if(!link || !daySchedule[i]) return;

        const dayDate = new Date(daySchedule[i]);
        dayDate.setHours(0,0,0,0);

        // completed day = strictly before today
        if(dayDate <= today){
            circle.classList.remove("disabled");
            link.style.pointerEvents = "auto";
            link.style.opacity = "1";

        }else{

            // today + future → disabled
            link.style.pointerEvents = "none";
            link.style.opacity = "0.35";
            circle.classList.add("disabled");

        }
    });

/*
SET YOUR REAL DATES HERE
(India standard Valentine week – edit if needed)

0 -> Rose
1 -> Propose
2 -> Chocolate
3 -> Teddy
4 -> Promise
5 -> Hug
6 -> Valentine
*/

function updateStepperByTime(){

    const now = new Date();

    steps.forEach((step, i) => {

        const circle = step.querySelector(".circle");
        const fill   = step.querySelector(".fill");

        const start = daySchedule[i];
        const end   = daySchedule[i + 1];

        // future day
        if(now < start){
            circle.classList.remove("active");
            if(fill) fill.style.width = "0%";
            return;
        }

        // completed day
        if(end && now >= end){
            circle.classList.add("active");
            if(fill) fill.style.width = "100%";
            return;
        }

        // current running day
        if(end && now >= start && now < end){

            circle.classList.add("active");

            const total = end.getTime() - start.getTime();
            const passed = now.getTime() - start.getTime();

            const percent = Math.min(100, Math.max(0, (passed / total) * 100));

            if(fill) fill.style.width = percent + "%";
        }

    });
}

// update every minute
updateStepperByTime();
setInterval(updateStepperByTime, 60000);

const slides = document.querySelectorAll(".slide-card");

let gifs = [
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmc4OGdmbmt4d3I2OHJva3lxamVvMW1qemZzNHlsb293dGs3a2w4bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Rj41suh06fmDe/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cm9lenRtM3gydGNyejhieXp2ZWZta3pod281bWhiNTFmNXZhYWIyYiZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/wQIH5xQjEQt0WN8I9Z/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OTVleW9weGV3c2M5dGtkdGp2c2toYXNhcXUwcmhodXJiOTJ3NTd2diZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/YtQyQahBsPX1FVMTWm/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OTVleW9weGV3c2M5dGtkdGp2c2toYXNhcXUwcmhodXJiOTJ3NTd2diZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/ThXPZjL6YZ0leJIYBN/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MnE4aXAyMGttbTVnMTZwazdyMzljYzZlaXFnandobHowZmFrMWEzMSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/4js9EokufmZgkgtB6V/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZmF0M2R4b2lyNDIxaW8waHE3ZnRndjU0ZDBwcGNvb3FhZmx0ZHV6ZSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/TYLge9eDFs0ifVKtvC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OTVleW9weGV3c2M5dGtkdGp2c2toYXNhcXUwcmhodXJiOTJ3NTd2diZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/E8rxZH89hFaZ0NNKGe/giphy.gif"
];
const obs = new IntersectionObserver(entries => {

    entries.forEach(e => {

        if(e.isIntersecting){
            e.target.classList.add("show");
        }

    });

},{ threshold:0.5 });

slides.forEach(s => {
    s.classList.add("fade");
    obs.observe(s);
});

const zone = document.getElementById("zone");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const result = document.getElementById("result");
    const hint = document.getElementById("hint");

    /* ---------- YES BUTTON GROWS ---------- */
    let yesScale = 1;
    function growYes() {
      yesScale = Math.min(2.2, yesScale + 0.1);
      yesBtn.style.transform = `translateY(-50%) scale(${yesScale})`;
    }

    /* ---------- NO BUTTON RUNS AWAY ---------- */
    function clamp(n, min, max) {
      return Math.max(min, Math.min(max, n));
    }

    function moveNo(px, py) {
      const z = zone.getBoundingClientRect();
      const b = noBtn.getBoundingClientRect();

      let dx = (b.left + b.width / 2) - px;
      let dy = (b.top + b.height / 2) - py;
      let mag = Math.hypot(dx, dy) || 1;
      dx /= mag;
      dy /= mag;

      let newLeft = (b.left - z.left) + dx * 150;
      let newTop  = (b.top - z.top) + dy * 150;

      newLeft = clamp(newLeft, 0, z.width - b.width);
      newTop  = clamp(newTop, 0, z.height - b.height);

      noBtn.style.left = newLeft + "px";
      noBtn.style.top = newTop + "px";

    }

    zone.addEventListener("pointermove", e => {
      const b = noBtn.getBoundingClientRect();
      const d = Math.hypot(
        (b.left + b.width / 2) - e.clientX,
        (b.top + b.height / 2) - e.clientY
      );
      if (d < 140) moveNo(e.clientX, e.clientY);
    });

    let noScale = 1;
    let gcount = 0;

    const NO_REMOVE_THRESHOLD = 0.35;

noBtn.addEventListener("click", e => {
  e.preventDefault();

  const gif = document.getElementById("sticker");

  // 🔁 always change top gif
  gcount++;
  gif.src = "";
  gif.src = gifs[gcount];
  startGifLoop(gif, 2000);

  // grow YES
  yesScale = Math.min(2.2, yesScale + 0.15);
  yesBtn.style.transform = `scale(${yesScale})`;

  // shrink NO
  noScale = noScale - 0.12;
  noBtn.style.transform = `scale(${noScale})`;

  if (noScale <= NO_REMOVE_THRESHOLD) {

    gcount = 0;
    noBtn.style.pointerEvents = "none";

    noBtn.style.transition = "transform 0.15s ease, opacity 0.2s ease";
    noBtn.style.opacity = "0";

    setTimeout(() => {
      noBtn.remove();
    }, 200);
  }
});


    /* ---------- YES CLICK ---------- */
yesBtn.addEventListener("click", () => {

  const gif = result.querySelector(".fireworks");

  sendWaitingFromB();

  zone.style.display = "none";
  hint.style.display = "none";
  result.style.display = "block";


  const gif2 = document.getElementById("sticker");

  gcount++;
  gif2.src = "";
  gif2.src = "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cm9lenRtM3gydGNyejhieXp2ZWZta3pod281bWhiNTFmNXZhYWIyYiZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/l7PotkXT6TgFrmlAoI/giphy.gif";

  // start fake looping gif
  startGifLoop(gif, 1550);
});

let gifLoopTimer = null;

function startGifLoop(img, interval = 2000) {
  const base = img.dataset.base || img.src.split("?")[0];
  img.dataset.base = base;

  clearInterval(gifLoopTimer);

  gifLoopTimer = setInterval(() => {
    img.src = base + "?t=" + Date.now();
  }, interval);
}
/* init */
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

/* reference */
const waitingRef = ref(db, "hugRoom/accepted");

/* -------------------------
   SEND from web (user B)
-------------------------- */

export function sendWaitingFromB() {
  set(waitingRef, ""+new Date());
}

/* -------------------------
   CLEAR when released
-------------------------- */

export function clearWaiting() {
  set(waitingRef, "");
}