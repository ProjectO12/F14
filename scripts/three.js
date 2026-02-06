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

const container = document.getElementById("slideSection");
const chocoBg = document.getElementById("chocoBg");

function updateChocolateFill(){

    const max =
        container.scrollHeight - container.clientHeight;

    if(max <= 0){
        chocoBg.style.height = "0%";
        return;
    }

    const progress = container.scrollTop / max;

    const percent = Math.min(100, Math.max(0, progress * 100));

    chocoBg.style.height = percent + "%";
}

container.addEventListener("scroll", updateChocolateFill);
updateChocolateFill();
