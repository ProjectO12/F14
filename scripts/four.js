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

const steps = document.querySelectorAll(".valentine-stepper .step");

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

const daySchedule = [
    new Date("2026-02-03T00:00:00"), // Day 1 start
    new Date("2026-02-04T00:00:00"), // Day 2 start
    new Date("2026-02-09T00:00:00"),
    new Date("2026-02-10T00:00:00"),
    new Date("2026-02-11T00:00:00"),
    new Date("2026-02-12T00:00:00"),
    new Date("2026-02-13T00:00:00"),
    new Date("2026-02-14T00:00:00")  // end boundary (needed for last calc)
];

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
