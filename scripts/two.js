const letterEl = document.getElementById("letter");
const replyBtn = document.getElementById("replyBtn");
const popper = document.getElementById("popper");

/* --------------------------------------
   Your love letter (edit freely)
--------------------------------------- */

const letterText =
`I don’t know how to say this in a perfect way.
But being with you makes my normal days feel softer.

We are still just college students,
still figuring life out…
but I really like growing through this phase with you.

So today, I only want to ask you one small thing.

Will you let me keep choosing you,
even on the boring days,
even on the stressful days,
even when we don’t understand each other properly?

— Charan`;

/* -------------------------------------- */

let i = 0;

function typeLetter(){

    if(i < letterText.length){

        letterEl.textContent += letterText.charAt(i);

        // play soft typing sound (throttled)
        // const now = Date.now();
        // if(now - lastSoundTime > 60){
        //     typeSound.currentTime = 0;
        //     typeSound.play().catch(()=>{});
        //     lastSoundTime = now;
        // }

        i++;
        setTimeout(typeLetter, 35);

    }else{
        replyBtn.classList.add("show");
    }

}


typeLetter();

/* --------------------------------------
   CLICK → notify + popper
--------------------------------------- */

replyBtn.addEventListener("click", () => {

    showPopper();
    startConfetti();
    // sendNotification();

});


function showPopper(){
    popper.classList.add("show");

    setTimeout(()=>{
        popper.classList.remove("show");
    },2500);
}


/*
   IMPORTANT:
   Put your webhook URL here later
// */
// function sendNotification(){

//     const WEBHOOK_URL = "PASTE_YOUR_WEBHOOK_URL_HERE";

//     if(WEBHOOK_URL.includes("PASTE")) return;

//     fetch(WEBHOOK_URL,{
//         method:"POST",
//         headers:{
//             "Content-Type":"application/json"
//         },
//         body: JSON.stringify({
//             from: "Iswarya",
//             day: "Propose Day",
//             message: "She clicked the button 💛"
//         })
//     }).catch(()=>{});
// }

const typeSound = document.getElementById("typeSound");
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

let lastSoundTime = 0;

function startConfetti(duration = 4500){

    const canvas = confettiCanvas;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#c94a6a", "#ffd1dc", "#ff9fb2", "#ffe5ec"];

    const count = Math.min(140, Math.floor(canvas.width / 6));

    for(let i=0;i<count;i++){
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: Math.random() * 6 + 6,
            h: Math.random() * 10 + 10,
            vy: Math.random() * 1.5 + 1.5,
            vx: Math.random() * 0.6 - 0.3,
            rotation: Math.random() * Math.PI,
            rotationSpeed: Math.random() * 0.02 - 0.01,
            color: colors[Math.floor(Math.random()*colors.length)]
        });
    }

    let startTime = null;

    function drawRoundedRect(x, y, w, h, r){
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r);
        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h);
        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
        ctx.fill();
    }

    function animate(t){

        if(!startTime) startTime = t;
        const elapsed = t - startTime;

        ctx.clearRect(0,0,canvas.width,canvas.height);

        pieces.forEach(p => {

            p.vy += 0.01;   // soft gravity
            p.y += p.vy;
            p.x += p.vx + Math.sin(p.y * 0.01) * 0.3;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;

            drawRoundedRect(-p.w/2, -p.h/2, p.w, p.h, 3);

            ctx.restore();

            if(p.y > canvas.height + 30){
                p.y = -20;
                p.x = Math.random() * canvas.width;
                p.vy = Math.random() * 1.5 + 1.5;
            }
        });

        if(elapsed < duration){
            requestAnimationFrame(animate);
        }else{
            ctx.clearRect(0,0,canvas.width,canvas.height);
        }
    }

    requestAnimationFrame(animate);
}

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
