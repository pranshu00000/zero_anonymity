//#region ----IMPORTS----
import React, { Component, useEffect, useRef, useState } from "react";
import RecievedMsg from "../components/RecievedMsg";
import SentMsg from "../components/SentMsg";
import UserList from "../components/UserList";
import { getChatsListener, getChatListListener, sendChat, getChats, getEarliestChatTimestamp, getChatsBeforeTimestamp, getSessionStorage } from "../../backend/src/functions";
import { Timestamp, serverTimestamp } from "firebase/firestore";

import { chameleon,  setUserSelected, spectatorMode, userSelected, user_1, user_2 } from "../../backend/src/GlobalValues";
import ChameleonMode from "../components/ChameleonMode";
import { FlatTree, motion, useAnimation } from "framer-motion";
import PulseLoader from "react-spinners/PulseLoader";
import HeroText from "../components/HeroText";
import DateCard from "../components/DateCard";

//#endregion

const Chats = () => {

  //#region ----USESTATE VARIABLES----
  const[chats,setChats]=useState(null);
  const[sendingChats, setSendingChats] = useState(new Map());

  const[chatList,setChatList]=useState(null);
  const [selectedUser,  setSelectedUser] = useState("")
  const [currentUser, setCurrentUser] = useState(user_1)
  const [showAnim, setShowAnim] = useState(false)
  const [chumma, setChumma] = useState(true)

  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [previousScrollHeight, setPreviousScrollHeight]  = useState(null)
  const [loadingMoreChats, setLoadingMoreChats] = useState(false);
  const chatContainerRef = useRef();
  const regex = /^[a-z_]*$/;
  
  //#endregion
  //TODO: chats loading everything everytime i click em
  //TODO: chumma ka kuch kar

  //#region ----FUNCTIONS----
      //#region ----ANIMATION----
      // Start the animation
    let animationTimeout;
    const startAnimation = () => {
      
      animationTimeout = setTimeout(() => {
        if(!getIsDataReceived()){
          //startAnimation();
          setChumma(!chumma)
        }
        else{
          setShowAnim(false)
          setTimeout(() => {
            const container = chatContainerRef.current;
            container.scrollTop = container.scrollHeight;
          }, 1);
        }
      }, 600);
    };
    //#endregion

      //#region ---- More Chats Available----
  const getChatAvailability = (user_2) =>{
    const storedArray = JSON.parse(sessionStorage.getItem('MoreChatsAvailable'));
    return (storedArray && storedArray.includes(user_2)) ? true : false;
  }

  const deleteChatAvailability = (user_2) => {
    let storedArray = JSON.parse(sessionStorage.getItem('MoreChatsAvailable'));

    const indexToDelete = storedArray.indexOf(user_2);
    if (indexToDelete !== -1) {
      storedArray.splice(indexToDelete, 1);
      sessionStorage.setItem('MoreChatsAvailable', JSON.stringify(storedArray));
    } 
  }
  //#endregion

      //#region ----LOAD MORE CHATS----
  const loadMoreChats = async () => {
    /*
      ->Gets the timestamp of the earliest message in session storage
        ->GETS THE TIMESTAMP OF THE EARLIEST MESSAGE IN SESSION STORAGE 
        ->RETREIVES FEW MORE DOCS FROM THE DB 
    */
    
    const data =  getSessionStorage(user_1+"+"+user_2);
    if(Object.keys(data).length !== 0){

      setLoadingMoreChats(true);
      //TODO: ADD A LOADING SCREEN
      //TODO: Check for null value in getEarliestChatTimestamp
    
      const timeStamp = await getEarliestChatTimestamp(user_1, user_2)
      await getChatsBeforeTimestamp(user_1, user_2, timeStamp, (formattedData) => {
        if(Object.keys(formattedData).length === 0){
          deleteChatAvailability(user_2)
        }
        setChats(prevState => ({...prevState,...formattedData}));
        setLoadingMoreChats(false); 
        //TODO: REMOVE THE LOADING SCREEN
      })
    }
    else{
      deleteChatAvailability(user_2)
    }
    
  } 
  //#endregion
  
      //#region ----HANDLE SCROLLING EVENTS----
  const handleScroll = async () => {
    /*
        -> CHECKS WHEN THE USER HAS SCROLLED TO TOP
    */
    const container = chatContainerRef.current;      
    
    if (container) {
      //Checks if the user has manually scrolled up (with some buffer of 70px)
      setUserScrolledUp((container.scrollHeight - (container.scrollTop + container.clientHeight)) > 70);
      
      //LOAD MORE CHATS ONLY IF:
      //1. USER HAS SCROLLED TO TOP 
      //2. CURRENTLY NO CHATS ARE BEING LOADED
      //3. THE TOTAL NUMBER OF CHATS EXCEED THE SCROLL VIEW
      //4. THERE ARE CHATS AVAILABLE IN THE DB
      console.log(container.scrollTop === 0 , !loadingMoreChats , container.scrollHeight >= container.clientHeight
      , getChatAvailability(user_2), selectedUser, user_2)
      if (container.scrollTop === 0 && !loadingMoreChats && container.scrollHeight >= container.clientHeight && getChatAvailability(user_2)) {
          setPreviousScrollHeight( container.scrollHeight );
          await loadMoreChats()
        }
    }
    
  };
  //#endregion
  
      // #region ----SEND MESSAGE-----
  const sendMsg = () => {
    const msgText = document.getElementById("messageInput").value;
    if(msgText!=""){
      document.getElementById("messageInput").value = '';
      const newID = new Date().toISOString() + '+' +user_1
      
      const createdAt = serverTimestamp()
      const newEntry = {
          "senderId": user_1,
          "message": msgText,
          "createdAt": createdAt
      };

      sendChat(user_1, user_2, msgText, newID, createdAt);
      setSendingChats(prevSendingChats => new Map(prevSendingChats.set(newID, newEntry)));
    }
  };
  //#endregion

      //#region ----SESSION STORAGE BOOLEAN - DATA RECEIVED FROM DB----
  const getIsDataReceived = () => {return sessionStorage.getItem('DataReceived') === 'true';}
  const setIsDataReceived = (value) => {sessionStorage.setItem('DataReceived', value);}

  const getPrevDate = () => {return sessionStorage.getItem('PrevDate');}
  const setPrevDate = (value) => {sessionStorage.setItem('PrevDate', value);}

  const getPrevSender = () => {return sessionStorage.getItem('PrevSender');}
  const setPrevSender = (value) => {sessionStorage.setItem('PrevSender', value);}

  //#endregion
  //#endregion
  

 
  //#region ----USEEFFECT - SNAPSHOT LISTENERS----

  // This runs only once and keeps calling itself unless user_2 is not mentioned
  useEffect(() => {
    setIsDataReceived(false)
    // Prevents user_1 to be empty by any chance
    const checkVariable = () => {
      if (user_1 === "") {
        console.log("running")
        setTimeout(checkVariable, 100);
      }
      
      else{
        setCurrentUser(user_1)
      }
    };

    checkVariable();
    return () => {
      clearTimeout(checkVariable);
    };
  }, []);

  // This useeffect is called at the start of the page load and on chameleon mode
  // This listener is for the chatcards ordering
  useEffect(() => {

    setChats(null);
    setSendingChats(new Map())

    if(user_1 !== ""){
      const unsubscribe = getChatListListener(user_1, (snapshotArray) => {
        setChatList(snapshotArray)  
        
        //Setting the chat list to session storage
        sessionStorage.setItem('MoreChatsAvailable', JSON.stringify(snapshotArray))
      });      

      return () => {
        unsubscribe();
      };
   }
  }, [currentUser])
  
  useEffect(()=>{
    if(userSelected){
      //console.log("Changed")
      startAnimation()
    }
  },[chumma])
  
    
  //this useeffect is called every time the user clicks on a chat card
  // this listener is for when the user clicks on a chat card and listens for new chats
  useEffect(() => {
    
    let unsubscribeFunction;
    
    const fetchData = async () => {
      //start the fade loader animation
      //startAnimation();

      // To get chats from DB or Session Storage when a chat card is first clicked
      await getChats(user_1, user_2, (formattedData) => {
      
        /*setTimeout(() => {
        JUST FOR DEBUGGING
        }, 3500);*/
        setIsDataReceived(true)
        setChats(formattedData)
      })
      // Adds a onSnapShot Listener to listen to new messages
      unsubscribeFunction = await getChatsListener(user_1, user_2, (formattedData) => {
        setChats(prevState => ({...formattedData, ...prevState}));
      });
    };

    if(user_1 !== "" && user_2 !== ""){
      setIsDataReceived(false)
      setShowAnim(true)
      fetchData();
      
      // Sets multiple variables to default values when a new chat card is clicked
      setUserScrolledUp(false)
      setLoadingMoreChats(false)
    }

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      clearTimeout(animationTimeout)
        if (unsubscribeFunction) {
          unsubscribeFunction();
        }
    };
  }, [selectedUser]);


  // This useeffect is called everytime there is a change in the chats array
  // This is to position the chats in correct order and place and also load more chats as necessary
  useEffect(() => {
    const container = chatContainerRef.current;
    setPrevDate(null)
    setPrevSender(null)

    if (container && chats !== null) {
      // Load more chats if the chats displayed do not completely fill the scrollable view
      if(container.scrollHeight <= container.clientHeight && getChatAvailability(user_2)){
        const loadMoreChatsAsync = async () => {await loadMoreChats()}
        loadMoreChatsAsync()
      }

      // To set the position of the scroll view after loading new chats
      if(previousScrollHeight !== null){
        const newChatsHeight = container.scrollHeight - previousScrollHeight;
        container.scrollTop += newChatsHeight;
      }

      // Scroll to the bottom on 2 conditions:
      // 1. The user has scrolled up manually and sends a text
      // 2. The user is roughly on the bottom of the screen (70 px buffer) and sends or receives a text
      if (!userScrolledUp) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [chats, sendingChats]);
  
  // This useeffect adds a scroll listener to the scrollable view
  // The listner handles loading chats when user scrolls to the top
  useEffect(() => {
    const container = chatContainerRef.current;
    container.addEventListener('scroll',  handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loadingMoreChats]);

  //#endregion

  
  //#region ----REACT RENDERING----
  return (

    <div className="h-[calc(100%-96px)] flex  mx-2 pt-2" >
      {chatList !== null && <UserList chatCardList = {chatList} updateSelectedUserFunc = {setSelectedUser} startAnimation={startAnimation}/>}
      <div className=" w-1 invisible lg:visible lg:w-5/6 px-2">

        <div className="bg-chatBG bg-cover flex h-[106%] flex-col rounded-lg relative">
          
          {showAnim &&
            <div className="bg-chatBG bg-cover flex h-[100%] flex-col rounded-lg absolute z-50 w-full"></div>
          }
          {!showAnim && chameleon &&
            <motion.div
              initial={{opacity:0}}
              animate={{opacity:1}}
              className=" bg-white h-[50px]  w-full items-center pl-4  border-b-[1px] rounded-t-lg border-black flex justify-between absolute">
              <div className="flex">
                <img
                  src="https://banner2.cleanpng.com/20180523/tha/kisspng-businessperson-computer-icons-avatar-clip-art-lattice-5b0508dc6a3a10.0013931115270566044351.jpg"
                  alt="I"
                  className="rounded-full h-8 w-8"
                />
                <span className="ml-4 text-lg font-semibold text-black ">{user_2}</span>
              </div>
              <ChameleonMode setCurrentUserFunc = {setCurrentUser}/>

            </motion.div>
          }
        {console.log("CHumma is", chumma)}
          {!chameleon &&
            <HeroText text="Z e r o - A n o n y m i t y" />
          }

          {showAnim && (chumma) && 
            <HeroText text="Z e r o - A n o n y m i t y" />
          }
          <div
            ref={chatContainerRef}
            className=" mt-12 m-3 mb-0 rounded-xl md:h-[85%]  p-2 overflow-y-auto chat-area no-scrollbar"
          >
            {/* <DateCard day="Yesterday"/>  : day me pass kr dena jo bhi date pas krna hoga today,yestuday,mon,tue etc. */}
            {getChatAvailability(user_2) && chatContainerRef.current.scrollHeight !== chatContainerRef.current.clientHeight &&
            <div style={{display:"flex", justifyContent: "center", alignItems: "center", height:"60px"}}><PulseLoader size={10}/></div>}
            {/* Messages */}
            {console.log()}
            {
              chats && 
              (Object.entries(chats).length === 0 
              ?
              <p>Hellooo</p>
              :              
              Object.entries(chats).reverse().map(([id, data], index, array) =>
              {
                let dateComponent = null;
                let brTag = null;
                const time = (new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds)).toDate()
                const hours = time.getHours().toString().padStart(2, '0');
                const minutes = time.getMinutes().toString().padStart(2, '0');
                const timeString = hours + ":" + minutes
              
                const formattedDate = `${time.getDate()} ${time.toLocaleString('en-US', { month: 'long' })} ${time.getFullYear()}`;
                

                if(index === 0){
                  dateComponent = <DateCard day={formattedDate} margin={"my-0"}/>
                  setPrevDate(formattedDate)
                }
                else if(getPrevDate() !== formattedDate || getPrevDate() === "null"){
                  dateComponent = <DateCard day={formattedDate}/>
                  setPrevDate(formattedDate)
                }

                if(getPrevSender() === "null"){
                  brTag = null
                  setPrevSender(data.senderId)
                }
                else if(getPrevSender() !== data.senderId){
                  brTag = <p style= {{height: "10px"}}/>
                  setPrevSender(data.senderId)
                }

                if(data.senderId === user_1){
                  if(sendingChats.has(id)){
                    const tempMap = sendingChats;
                    tempMap.delete(id);
                    setSendingChats(tempMap);
                  }
                  return (
                    <React.Fragment key={id}>
                      {dateComponent || brTag}
                      <SentMsg key={id} msg={data.message} time={timeString} sent={true}/>
                    </React.Fragment>
                  )
                }
                else{
                  return (
                    <React.Fragment key={id}>
                      {dateComponent || brTag}
                      <RecievedMsg key={id} msg={data.message} time={timeString}/>
                    </React.Fragment>
                  )
                }
              }))
            }
            
            {sendingChats.size !== 0 && Array.from(sendingChats.entries()).map(([id, data]) => 
              {
                let dateComponent = null;
                let brTag = null;
                const time = new Date() 
                const hours = time.getHours().toString().padStart(2, '0');
                const minutes = time.getMinutes().toString().padStart(2, '0');
                const timeString = hours + ":" + minutes

                const formattedDate = `${time.getDate()} ${time.toLocaleString('en-US', { month: 'long' })} ${time.getFullYear()}`;
                
                if(getPrevDate() !== formattedDate || getPrevDate() === "null"){
                  dateComponent = <DateCard day={formattedDate}/>
                  setPrevDate(formattedDate)
                }

                if(getPrevSender() === "null"){
                  brTag = null
                  setPrevSender(data.senderId)
                }
                else if(getPrevSender() !== data.senderId){
                  brTag = <p style= {{height: "10px"}}/>
                  setPrevSender(data.senderId)
                }

                return(
                  <React.Fragment key={id}>
                      {dateComponent || brTag}
                      <SentMsg key={id} msg={data.message} time={timeString} sent={false} /> 
                    </React.Fragment>
                );
              })
            }

          </div>

          {!showAnim && chameleon &&
          <motion.div 
          initial={{opacity:0}}
          animate={{opacity:1}}
          className="rounded-b-lg px-3 py-2  flex justify-center items-end ">

            {spectatorMode ? <input
              id="messageInput"
              type="text"
              readOnly
              className="w-[95%] h-[35px] rounded-lg p-4 text-center text-sm border-[1px] border-black"
              placeholder="You can't send any message in spectator mode"
            />:
            <input
              id="messageInput"
              type="text"
              className="w-[95%] h-[38px] max-h-[100px] rounded-lg p-4 text-sm border-[1px] border-black my-auto"
              placeholder="Message"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                    sendMsg();
                }}
            />}
            {!spectatorMode && <span className="flex bg-sendBtn h-16 w-16 bg-contain bg-no-repeat bg-center " 
            onClick={sendMsg}/>}
          </motion.div>}

        </div>
      </div>
    </div>
  );
  //#endregion
  
};

export default Chats;