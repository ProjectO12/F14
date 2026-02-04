/*const cards = document.querySelectorAll(".rose-card");

const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
},{
    threshold:0.6
});

cards.forEach(card=>{
    observer.observe(card);
});*/


const cards = document.querySelectorAll(".rose-card");
const dots  = document.querySelectorAll(".week-progress .dot");

const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
        if(entry.isIntersecting){

            entry.target.classList.add("show");

            const index = [...cards].indexOf(entry.target);

            dots.forEach(d => d.classList.remove("active"));
            if(dots[index]){
                dots[index].classList.add("active");
            }
        }
    });
},{
    threshold: 0.6
});

cards.forEach(card=>{
    observer.observe(card);
});

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
