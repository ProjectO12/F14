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


const teddyWrap = document.getElementById("teddyWrap");
const hugFill   = document.getElementById("hugFill");
const teddy     = teddyWrap.querySelector(".teddy");
const message   = document.getElementById("message");
const hint      = document.getElementById("hint");

let holding = false;
let progress = 0;
let raf = null;

const HOLD_TIME = 3000; // ms needed for full hug

function startHold(){
    if(message.classList.contains("show")) return;

    holding = true;
    teddy.classList.add("holding");

    let last = performance.now();

    function step(now){

        if(!holding){
            raf = null;
            return;
        }

        const delta = now - last;
        last = now;

        progress += delta;

        const percent = Math.min(100, (progress / HOLD_TIME) * 100);
        hugFill.style.height = percent + "%";

        if(percent >= 100){
            finishHug();
            return;
        }

        raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
}

function stopHold(){
    if(message.classList.contains("show")) return;

    holding = false;
    teddy.classList.remove("holding");

    if(raf) cancelAnimationFrame(raf);

    // gently fall back
    progress *= 0.5;
    hugFill.style.height = (progress / HOLD_TIME) * 100 + "%";
}

function finishHug(){
    holding = false;
    teddy.classList.remove("holding");
    sendWaitingFromB();

    hugFill.style.height = "100%";
    hint.style.display = "none";
    message.classList.add("show");
}

/* mouse */
teddyWrap.addEventListener("mousedown", startHold);

window.addEventListener("mouseup", stopHold);

/* touch */
teddyWrap.addEventListener("touchstart", e=>{
    e.preventDefault();
    startHold();
},{passive:false});

window.addEventListener("touchend", stopHold);


/* init */
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

/* reference */
const waitingRef = ref(db, "hugRoom/touched");

/* -------------------------
   SEND from web (user B)
-------------------------- */

export function sendWaitingFromB() {
  set(waitingRef, Date.now());
}

/* -------------------------
   CLEAR when released
-------------------------- */

export function clearWaiting() {
  set(waitingRef, "");
}