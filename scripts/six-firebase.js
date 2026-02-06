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


const ROOM = "presence-room-1";

/*
  your device  -> charan
  her device   -> iswarya
*/
const USER = "charan";

const app  = initializeApp(firebaseConfig);
const db   = getDatabase(app);
const auth = getAuth(app);

await signInAnonymously(auth);

const roomRef = ref(db, "presenceRooms/" + ROOM);

/* send my state */
window.__presence.sendState = function(isHolding){

    update(roomRef,{
        [USER]: isHolding
    });
};


/* listen other side */
onValue(roomRef, snap=>{

    const data = snap.val();
    if(!data) return;

    let other;

    if(USER === "charan"){
        other = data.iswarya;
    }else{
        other = data.charan;
    }

    if(typeof other === "boolean"){
        window.__presence.onRemoteState &&
        window.__presence.onRemoteState(other);
    }
});
