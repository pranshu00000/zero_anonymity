//#region ----IMPORTS----
import { FieldPath, Firestore, Timestamp, addDoc, arrayUnion, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import {db} from "./firebase"
import { startHeartbeat } from "./HeartBeatSignal";
import { setSpectatorMode, setUser_1, spectatorMode, timeOutValue, user_1, user_2 } from "./GlobalValues";

export let heartBeatId;
//#endregion

//#region ----- HELPER FUNCTIONS -----

// Returns the Chat ID between two users in alphabetical order
const chatIdOrder = async (user_1, user_2) =>{ 
    if(user_1>user_2){
        [user_1, user_2] = [user_2, user_1];
    }
    return user_1 + '+' + user_2;
}
//TODO: infinity running on reload
// Function to get data from session storage
export const getSessionStorage = (key) => {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting data from session storage:', error);
      return null;
    }
  };
  
// Function to set data in session storage
const setSessionStorage = (key, value) => {
try {
    sessionStorage.setItem(key, JSON.stringify(value));
} catch (error) {
    console.error('Error setting data in session storage:', error);
}
};

//#endregion

//#region LOGIN-LOGOUT
export const login = async (user_id) => {
    
    try {
        
        const collectionRef = collection(db, "users");
        const docID = user_id;
        const docRef = doc(collectionRef, docID);
        const docSnap = await getDoc(docRef);

        const userFullAccess = async () => {
            // function to give full access to user while log in
            setSpectatorMode(false)
            setUser_1(user_id)
            await updateDoc(docRef, {
                isActive: true,
                lastActive: new Date().toISOString()
            })
                        //TODO: Enable Heartbeat signals
            //start heartbeat signals upon successful login
            //heartBeatId = startHeartbeat(user_id);
        }
        const userPartialAccess = async () => {
            // function to give partial access to user while log in
            setUser_1(user_id)
            setSpectatorMode(true)
        }


        if(docSnap.exists()){
            //if user exists, check for spectator mode
            if(docSnap.data().isActive){
                //get the last login timestamp to check if it is still active
                const lastLoginDate = new Date(docSnap.data().lastActive);
                const currentDate = new Date();
                const timeDiff = (currentDate-lastLoginDate) / (1000*60);

                //timeout if prev user foes not logout and his browser crashed or sum
                if(timeDiff > timeOutValue){
                    //user has full access
                    await userFullAccess();
                }
                else{
                    //user can only spectate
                    userPartialAccess();
                }
            }
            else{
                //user has full access
                await userFullAccess();
            }
        }
        else{
            //CREATE USER
            //create a doc in firestore if user does not already exist
            await setDoc(docRef, {
                isActive: true,
                lastActive: new Date().toISOString(),
                chatList: []
            });
            setSpectatorMode(false)
            setUser_1(user_id)
        }
        
    }
    catch (e) {
        console.error("Error adding document: ", e);
    }    
}

export const logout = async (user_id) => {
    try{
        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef,  user_id)
        const docSnap = await updateDoc(docRef, {
            isActive: false
        })

        setUser_1("")
    }
    catch (e) {
        console.error("Error adding document: ", e);
        
    }  
}
//#endregion

//#region CREATE CHAT

// Adds user_1 to the ChatList of user_2
const addUserToChatList = async (user_1, user_2) => {
    try{
        const collectionRef = collection(db, "users");
        const docRef = doc(collectionRef, user_1);
        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){
            //CREATE USER
            //create a doc in firestore if user does not already exist
            await setDoc(docRef, {
                isActive: true,
                lastActive: new Date().toISOString(),
                chatList: {}
            });
        }
        await setDoc(docRef, {
            chatList:{
                [user_2] : serverTimestamp()
            }
        }, { merge: true })
    }
    catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Create a chat record between two users in DB
export const createChat = async (user_1, user_2) => {
    
    // Adding user_2 to chatList of user_1
    addUserToChatList(user_1, user_2)

    // Adding user_1 to chatList of user_2
    addUserToChatList(user_2, user_1)

    //Creating a chat record between the two users.
    try{
        const collectionRef = collection(db, "chats");
        const docRef = doc(collectionRef, await chatIdOrder(user_1, user_2) )
        const docSnap = await setDoc(docRef, {
            user_1: user_1,
            user_2: user_2,
            unopened_msgs: 0 
        });
    }
    catch (e) {
        console.error("Error adding document: ", e);
    }    
}
//#endregion

//#region SEND CHAT

// Sets the chat document
const setChatDocument = async (user_1, user_2, message, messageId, createdAt ) =>{
    try{
        const chatId = await chatIdOrder(user_1, user_2)
        const collectionRef = collection(db, 'chats', chatId, 'messages');
        const docRef = doc(collectionRef, messageId);

        const docSnap = await setDoc(docRef, {
            message: message,
            senderId: user_1,
            createdAt: createdAt
        });
    }
    catch(e){
        console.error("Error adding document: ", e);
    }
}

// Sets the timestamp of last message 
const setCreatedAt = async (user_1, user_2, createdAt) =>{
    try{
        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, user_1);
        const docSnap = await setDoc(docRef, {
            chatList: {[user_2]: createdAt}
        }, { merge: true });
    }
    catch(e){
        console.error("Error adding document: ", e);
    }
}

// Caller function - sends the chat
export const sendChat = async (user_1, user_2, message, messageId, createdAt ) => {
    setChatDocument(user_1, user_2, message, messageId, createdAt );
    setCreatedAt(user_1, user_2, createdAt);
    setCreatedAt(user_2, user_1, createdAt);
}
//#endregion

//#region RETRIEVING CHATS & CHATLISTS BETWEEN FROM DB

// Get the timestamp of the earliest chat in a convo
export const getEarliestChatTimestamp = async (user_1, user_2) => {
    const chatId = user_1+'+'+user_2
    const chats = getSessionStorage(chatId);
    const lastKey = Object.keys(chats).pop(); // Get the last property name
    const lastValue = chats[lastKey];
    return lastValue.createdAt
}

// Get the chats BEFORE a certain timestamp
export const getChatsBeforeTimestamp = async (user_1, user_2, timeStampJSON, callback) =>{
    try {
        /*
            -> RETRIEVES ALL THE DOCUMENTS OF A COLLECTION AFTER THE GIVEN TIMESTAMP
            -> CALLED WHENEVER THERE A CHAT CARD IS CLICKED TO FETCH NEW CHATS FROM THE DB IF ANY
        */
       
        const   timeStamp = new Timestamp(timeStampJSON.seconds, timeStampJSON.nanoseconds)
        const chatCollection = collection(db, 'chats', await chatIdOrder(user_1, user_2), 'messages');
        const q = query(chatCollection, orderBy('createdAt', 'desc'),where('createdAt', '<', timeStamp), limit(5));
        const querySnapshot = await getDocs(q);
        
        const formattedData = querySnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
        }, {}); 

        const ss_chats = getSessionStorage(user_1+'+'+user_2);
        const mergedData = Object.assign(ss_chats, formattedData)
        setSessionStorage(user_1 + '+' + user_2, mergedData)
        
        callback(formattedData)

      } catch (error) {
        console.error('Error fetching chats:', error);
      }
}

// Get the conversation history 
export const getChats = async (user_1, user_2 ,callback) =>{
    try {
        /*
            -> FIRST CHEKCS IF ANY CHAT CONVO IS AVAILABLE IN SESSION STORAGE
            -> IF YES, RETURNS DATA FROM SESSION STORAGE
            -> IF NO, REQUESTS AND RETURNS DATA FROM FIRESTORE
        */
        const storedChats = getSessionStorage(user_1+'+'+user_2);
        if (storedChats) {
          callback(storedChats)
          return;
        }

        const chatCollection = collection(db, 'chats', await chatIdOrder(user_1, user_2), 'messages');
        const q = query(chatCollection,orderBy('createdAt', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);

        const formattedData = querySnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
        }, {}); 
        
        setSessionStorage(user_1+'+'+user_2, formattedData);
        callback(formattedData)

      } catch (error) {
        console.error('Error fetching chats:', error);
      }
}

// Get the chats AFTER a certain timestamp
const getChatsAfterTimestamp = async (user_1, user_2, timeStampJSON) =>{
    try {
        /*
            -> RETRIEVES ALL THE DOCUMENTS OF A COLLECTION AFTER THE GIVEN TIMESTAMP
            -> CALLED WHENEVER THERE A CHAT CARD IS CLICKED TO FETCH NEW CHATS FROM THE DB IF ANY
        */
        const   timeStamp = new Timestamp(timeStampJSON.seconds, timeStampJSON.nanoseconds)
        const chatCollection = collection(db, 'chats', await chatIdOrder(user_1, user_2), 'messages');
        const q = query(chatCollection, orderBy('createdAt', 'desc'),where('createdAt', '>', timeStamp));
        const querySnapshot = await getDocs(q);
        
        const formattedData = querySnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
        }, {}); 

        const ss_chats = getSessionStorage(user_1+'+'+user_2);
        const mergedData = Object.assign({},formattedData, ss_chats)
        setSessionStorage(user_1 + '+' + user_2, mergedData)
        
        return formattedData

      } catch (error) {
        console.error('Error fetching chats:', error);
      }
}

// Listens to Chat List updates
export const getChatListListener = (user_1, callback) => {
    try{
        /* 
            ->THIS SECTION JUST ADDS A LISTENER TO THE CHAT LIST AND 
                UPDATES EVERY TIME THERE IS A NEW MESSAGE FROM ANYONE
        */
       console.log("User user", user_1)
        const docRef = doc(db, 'users', user_1);
        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if(docSnapshot.exists()){
                const dataArray = Object.entries(docSnapshot.data().chatList);
                dataArray.sort((a, b) => {
                    const aSeconds = a[1];
                    const bSeconds = b[1];
                    if (aSeconds === null && bSeconds === null) {
                        return 0;
                    } else if (aSeconds === null) {
                        return -1;
                    } else if (bSeconds === null) {
                        return 1;
                    } else {
                        return bSeconds - aSeconds;
                    }
                });
                // Extract names from sorted array
                const sortedNames = dataArray.map(([name, _]) => name);
                callback(sortedNames); 
            }
        });
        // Return the unsubscribe function to allow cleanup when component unmounts
        return unsubscribe;
    }catch (error) {
        console.error('Error fetching chats:', error);
    }
  };

// Listens to new chats - shd integrate it 
export const getChatsListener = async (user_1, user_2, callback) => {
    try{
        /* 
            ->THIS SECTION CHECKS IF A CHAT CONVO IS STORED IN SESSION STORAGE 
            ->IF YES, IT RETRIEVES DOCUMENTS (CHATS) CREATED AFTER THE LATEST CHAT STORED IN SESSION STORAGE 
        */
        const storedChats = getSessionStorage(user_1+'+'+user_2);
        if (storedChats && Object.keys(storedChats).length !== 0 ) {
            const latestChatKey = Object.keys(storedChats)[0]
            const lastTimestamp = storedChats[latestChatKey].createdAt
            const formattedData = await getChatsAfterTimestamp(user_1, user_2, lastTimestamp);
            callback(formattedData)
        }

        /* 
            ->THIS SECTION JUST ADDS A LISTENER TO THE CURRENT CHAT CARD 
        */
        const chatId = await chatIdOrder(user_1, user_2);
        const q = query(collection(db, "chats", chatId, "messages"), orderBy('createdAt', 'desc'), where('createdAt', '>', new Date()));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            
            let formattedData
            const lastDoc = snapshot.docs[0];
            if(lastDoc !== undefined){
                formattedData = {
                    [lastDoc.id]: lastDoc.data()
                };
            }
            const ss_chats = getSessionStorage(user_1+'+'+user_2);
            const mergedData = Object.assign({},formattedData, ss_chats)
            setSessionStorage(user_1+'+'+user_2,mergedData)
            
            callback(formattedData)   
            
        });
        return unsubscribe;
    }catch (error) {
        console.error('Error fetching chats:', error);
    }
};

//#endregion
