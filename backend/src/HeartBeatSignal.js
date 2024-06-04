import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { heartBeatFrequency } from "./GlobalValues";



export const startHeartbeat = (user_id) => {
    // Send heartbeat signal every hour
    const intervalId = setInterval(() => {
      sendHeartbeatSignal(user_id);
    }, heartBeatFrequency); // 1 hour in milliseconds
    
    return intervalId; // Return intervalId for later use
};

export const stopHeartbeat = (intervalId) => {
    // Stop sending heartbeat signal
    clearInterval(intervalId);
    console.log("Stopped heartbeat")
};

export const sendHeartbeatSignal = async (user_id) => {
    // Update timestamp document in Firestore
    try{
        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef, user_id);
        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, {
            lastActive: new Date().toISOString()
        })
        console.log("Sent heartbeat")
    }
    catch(e){
        console.error("Error adding document: ", e);
    }
};

