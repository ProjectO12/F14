import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInAnonymously } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAo2PlDvTAm3p_r6AxjPu9REznEaUb50pc",
    authDomain: "project012-72667.firebaseapp.com",
    databaseURL: "https://project012-72667-default-rtdb.firebaseio.com",
    projectId: "project012-72667",
    storageBucket: "project012-72667.appspot.com",
    messagingSenderId: "1015186451511",
    appId: "1:1015186451511:web:86adc349360eef195923b2"
};


const ROOM = "hug-room-1";

/*
  IMPORTANT:
  on your device -> charan
  on her device -> iswarya
*/
const USER = "charan";

/* ---------------------------
   INIT
--------------------------- */

const app  = initializeApp(firebaseConfig);
const db   = getDatabase(app);
const auth = getAuth(app);

await signInAnonymously(auth);

const roomRef = ref(db, "hugRooms/" + ROOM);

/* ---------------------------
   hook from six.js
--------------------------- */

window.__hug.sendProgress = function(p){

    update(roomRef, {
        [USER]: p
    });

};

/* ---------------------------
   listen to other side
--------------------------- */

let otherProgress = 0;

onValue(roomRef, snap => {

    const data = snap.val();
    if(!data) return;

    if(USER === "charan"){
        otherProgress = data.iswarya || 0;
    }else{
        otherProgress = data.charan || 0;
    }

    checkBoth();
});


function checkBoth(){

    const my = window.__hug.myProgress || 0;

    if(my >= 1 && otherProgress >= 1){

        if(window.__hug.onBothHugged){
            window.__hug.onBothHugged();
        }
    }
}