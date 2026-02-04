window.__hug = {
    myProgress: 0,
    onBothHugged: null,
    sendProgress: null
};

const hugArea = document.getElementById("hugArea");
const you = document.getElementById("you");
const her = document.getElementById("her");
const message = document.getElementById("message");
const hint = document.getElementById("hint");

let holding = false;
let progress = 0;
let raf = null;

const HOLD_TIME = 2500; // ms to complete the hug

function startHold(){

    if(message.classList.contains("show")) return;

    holding = true;
    let last = performance.now();

    function step(now){

        if(!holding){
            raf = null;
            return;
        }

        const delta = now - last;
        last = now;

        progress += delta;

        const p = Math.min(1, progress / HOLD_TIME);

        movePeople(p);
        
        window.__hug.myProgress = p;
        window.__hug.sendProgress && window.__hug.sendProgress(p);


        if(p >= 1){
            holding = false;
            return;
        }

        raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
}

function stopHold(){

    if(message.classList.contains("show")) return;

    holding = false;
    if(raf) cancelAnimationFrame(raf);

    // soften the return
    progress *= 0.5;
    movePeople(progress / HOLD_TIME);
    const p = Math.min(1, progress / HOLD_TIME);
    window.__hug.myProgress = p;
    window.__hug.sendProgress && window.__hug.sendProgress(p);

}

function movePeople(p){

    const areaWidth = hugArea.clientWidth;
    const personWidth = you.offsetWidth;

    const minGap = 6;
    const maxTravel =
        (areaWidth - personWidth * 2 - minGap) / 2;

    const move = maxTravel * p;

    you.style.left = move + "px";
    her.style.right = move + "px";

    you.style.transform = `translateY(-50%) scale(${1 + p*0.05})`;
    her.style.transform = `translateY(-50%) scale(${1 + p*0.05})`;
}

function finishHug(){

    holding = false;

    const gap = 6;
    const center =
        (hugArea.clientWidth - you.offsetWidth) / 2;

    you.style.left = center - gap/2 + "px";
    her.style.right = center - gap/2 + "px";

    hint.style.display = "none";
    message.classList.add("show");
}

/* mouse */
hugArea.addEventListener("mousedown", startHold);
window.addEventListener("mouseup", stopHold);

/* touch */
hugArea.addEventListener("touchstart", e=>{
    e.preventDefault();
    startHold();
},{passive:false});

window.addEventListener("touchend", stopHold);
window.__hug.onBothHugged = finishHug;
