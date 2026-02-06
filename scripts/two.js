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

const letterEl = document.getElementById("letter");
const replyBtn = document.getElementById("replyBtn");
const popper = document.getElementById("popper");

/* --------------------------------------
   Your love letter (edit freely)
--------------------------------------- */

const letterText =
`
Neevu achata kushalama, nenu ichata kushalamey.
Neeku chaala vishyalu cheppali (cinema nunchi inspire aina kavithalu included)
Kaani, naa manasu ninnu choodaganey yem cheppalo marchipothondhi. Ninnu first time kalisinappati nunchi ippati varaku naalo yenno maarpulu gamaninchanu.
Naaku anipisthu undedhi yevarra antha time teeskoni pani paata aapukoni kavithalu raasedhi ani
kaani ninnu choosakey telisindhi kavaithaley neekosam puttay ani.

Konchem over ga undhi kadha, matter yenti antey naaku ee love letter raayatam raavatledhey. Kaani naaku nee meedha unna feelings expresss chestha vinuko.
Newton ey malli pudithey bhoomi kantey adhika gravity nee kallallo undhi ani chepthadey.
Antharikshamlo chandrudi chuttu tirigey satellites ki nee gurinchi telisthey ventaney return trip ippudey ochesthaye.
Bangaraniki pranam undi ninnu choosthey, tirigi aa bhoomilokey vellipokunda untundha?
Inka chaala cheppali kaani, ila chepthu untey neeku alasata osthadhi adhi choosi nen alispolenu kabatti ilantivi kaavaalney inka chaaala unnay avi neeku nachavu kabatti cheppatledhu kaani nuv oo anu wikipedia laga veetikantu oka datacenter ey kattisthaney ninnu prapanchaniki parichayam chesthu.

Kani, nuv aanadham ga untey ne maaku andhariki kuda anandham ga untundhi. Ninnu aa navvulo choosthu kaalam kuda karigipothadhey. 
Allari chesey ee charan kosam intha dooram ochina maharanini adagalanukuntondhi yenti ani antey

Mee manasuloki naaku anumathi isthara?

—itlu mee Charan Cherry 🍒
`;

/* -------------------------------------- */

let i = 0;

function typeLetter(){

    if(i < letterText.length){

        letterEl.innerHTML += letterText.charAt(i);

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
// letterEl.innerHTML = letterText;

/* --------------------------------------
   CLICK → notify + popper
--------------------------------------- */

replyBtn.addEventListener("click", () => {

    showPopper();
    startConfetti();
    sendWaitingFromB();

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