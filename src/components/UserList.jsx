import React, { useEffect, useState } from "react";
import UserlistItem from "./UserlistItem";
import { setUser_2, spectatorMode, user_1 } from "../../backend/src/GlobalValues";
import {motion, useAnimate, useAnimation} from "framer-motion"

import { createChat } from "../../backend/src/functions";
import { query } from "firebase/firestore";


const UserList = ({chatCardList, updateSelectedUserFunc, startAnimation}) => {
  
  const [serachPanelVisiblity,setSearchPanelVisiblity] = useState(false);
  const [newUsername, setNewUsername] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredArray, setFilteredArray] = useState(null);
  const[usernamePerm,setUsernamePerm]=useState(false);
  const regex = /^[a-z_]*$/;
  // const [chatStatus,setChatStatus] = useState(false);
  const addNewChatControls = useAnimation()
  const chatCardControls = useAnimation()
  const newButton = useAnimation()
  const findAChat = useAnimation()

  // Checks if a chat in db exists between the users
  const checkChatExistence = async () => {
    if(chatCardList.includes(newUsername)){
      // Chat Exists, just open that chat
      console.log("Yems", chatCardList)
      usernamePerm && await setUser_2(newUsername);
      usernamePerm && updateSelectedUserFunc(newUsername)
    }
    else{
      console.log("No", chatCardList)
      usernamePerm && await createChat(user_1, newUsername);
      usernamePerm && await setUser_2(newUsername);
      usernamePerm && updateSelectedUserFunc(newUsername)
    }
  }


  useEffect(()=>{
    addNewChatControls.set({scaleY:0, originY: 0});
  }, [])


  useEffect(()=>{
    if(serachPanelVisiblity){
      console.log("Chat is", getChatExists(), sessionStorage.getItem("ChatExists"))
      if(getChatExists()){
        addNewChatControls.set({scaleY:0, originY: 0, y:0});
        addNewChatControls.start({scaleY:1, transition:{type: "stiff", ease: "easeInOut", duration: 0.3}})
      }
      else{
        addNewChatControls.set({scaleY:0, originY: 0, y: -150});
        addNewChatControls.start({scaleY:1, transition:{type: "stiff", ease: "easeInOut", duration: 0.3, delay: 0.3}})
      }
      chatCardControls.set({y: -240})
      chatCardControls.start({y:0, transition:{type: "stiff", ease: "easeInOut", duration: 0.3}})
      newButton.set({y: 0, x:0})
      newButton.start({y:-150, x: 110, transition:{type: "stiff", ease: "easeInOut", duration: 0.3}})
      findAChat.set({y: 0, x:0})
      findAChat.start({y:-100, x: -80, transition:{type: "stiff", ease: "easeInOut", duration: 0.3}})
    }
    else{
      addNewChatControls.start({scaleY:0, transition:{type: "stiff", ease: "easeInOut", duration: 0.3}})
      chatCardControls.start({y:-240, transition:{type: "stiff", ease: "easeInOut", duration: 0.3}})
      newButton.start({y:0, x: 0, transition:{type: "stiff", ease: "easeInOut", duration: 0.3, delay: 0.3}})
      findAChat.start({y:0, x: 0, transition:{type: "stiff", ease: "easeInOut", duration: 0.3, delay: 0.3}})
    }
  }, [serachPanelVisiblity])

  useEffect(()=>{

    setFilteredArray(chatCardList)
    if(chatCardList.length === 0) setChatExists(false)
    else setChatExists(true)
    console.log(chatCardList)
  }, [chatCardList])

  useEffect(()=> {
    setFilteredArray(chatCardList.filter(item => item.includes(searchQuery)));
  }, [searchQuery])

  useEffect(()=>{
    if(regex.test(newUsername))
  { 
    if(newUsername!==""){
    setUsernamePerm(true);
    console.log("allowed")}
    else{
      setUsernamePerm(false);
      console.log("not allowed")
    }
  }else{
    setUsernamePerm(false);
    console.log("not allowed")
  }
  },[newUsername])
  

  const getChatExists = () => {return sessionStorage.getItem('ChatExists') === 'true'}
  const setChatExists = (value) => {sessionStorage.setItem('ChatExists', value)}

  return (

    // <div className="bg-white rounded-t-xl  w-full ml-[2px] lg:ml-0 lg:w-1/3 p-2 flex flex-col gap-1 overflow-auto no-scrollbar shadow-gray-900 shadow-2xl h-[110%]">
      //{chatExist && <p className="text-black align-middle text-center  text-2xl mt-3 font-semibold">Recent Chats</p>}
      //<div className={` flex flex-col gap-2 ${!chatExist && 'mt-[65%]'}`}>
        //{!chatExist && <p className="text-lg mx-auto font-semibold ">Find a chat to get started</p>}
        //<div className={"flex justify-evenly gap-1 px-1 mb-2"}>
        //   {chatExist && spectatorMode ? 
        //     <input type="text" className="bg-[#00000000] border-[1px] border-gray-500 h-12 w-11/12 rounded-xl pl-2" placeholder="Search"
        //   onChange={(e)=>setSearchQuery(e.target.value)} id="newChatUsername"
        //   />:
          
        //   <input type="text" className="bg-[#00000000] border-[1px] border-gray-500 h-12 w-2/3 rounded-xl pl-2" placeholder="Search"
        //   onChange={(e)=>setSearchQuery(e.target.value)} id="newChatUsername"
        //   />
        // }

          // {chatExist ? 
          //   !spectatorMode && <button className="bg-[#006ea7] h-12 w-1/3 rounded-b-xl rounded-tl-xl font-semibold text-white" onClick={()=>{setSearchPanelVisiblity(!serachPanelVisiblity); onAnimate()}}>+ Start new chat</button> : 
            
          //   !spectatorMode &&<button className="bg-white h-[44px] w-1/3 rounded-xl border-[2px] border-slate-400 font-semibold text-blue-700 mt-2" onClick={()=>{setSearchPanelVisiblity(!serachPanelVisiblity);}}>+Add new chat</button>}

    <div className="bg-white rounded-t-xl  w-full ml-[2px] lg:ml-0 lg:w-1/3 p-2 flex flex-col gap-1 overflow-auto no-scrollbar shadow-gray-900 shadow-2xl h-[110%]">
      {getChatExists() && <p className="text-black align-middle text-center  text-2xl mt-3 font-semibold">Recent Chats</p>}      
      <div className={` flex flex-col gap-2 ${!getChatExists() && 'mt-[65%]'}`}>
        {!getChatExists() && 
        <motion.p animate={findAChat} className="text-lg mx-auto font-semibold">Find a chat to get started</motion.p>}
        <div className={"flex justify-evenly gap-1 px-1 mb-2"}>
          
          {getChatExists() && spectatorMode ? 
          
            <input type="text" className="bg-[#00000000] border-[1px] border-gray-500 h-12 w-11/12 rounded-xl pl-2" placeholder="Search"
            onChange={(e)=>setSearchQuery(e.target.value)} id="newChatUsername"
            />:
            
            <input type="text" className="bg-[#00000000] border-[1px] border-gray-500 h-12 w-2/3 rounded-xl pl-2" placeholder="Search"
            onChange={(e)=>setSearchQuery(e.target.value)} id="newChatUsername"
            />
          }

          {getChatExists() ? 
          
          !spectatorMode && <button className="bg-[#006ea7] h-12 w-1/3 rounded-b-xl rounded-tl-xl font-semibold text-white" onClick={()=>{setSearchPanelVisiblity(!serachPanelVisiblity);}}>
            + Start new chat
          </button> : 
          
          !spectatorMode && <motion.button 
          animate={newButton}
          className="bg-white h-[44px] w-1/3 rounded-xl border-[2px] border-slate-400 font-semibold text-blue-700 mt-2" onClick={()=>{setSearchPanelVisiblity(!serachPanelVisiblity);}}>
            +Add new chat
          </motion.button>}

          {/* {console.log(serachPanelVisiblity)} */}
        </div>
        </div>
        {
          //TODO: div initially animates to 0. gotta prevent that
          //serachPanelVisiblity && 
        <motion.div 
        className=" flex flex-col py-10 px-4 border-[1px] border-gray-500 rounded-2xl mx-1 my-1"
          animate={addNewChatControls}
        >
          <p className=" text-lg font-semibold ml-8">Start a new chat :</p>
          <input type="text" className="bg-[#00000000] border-[2px] border-gray-500 h-12 w-5/6   rounded-xl pl-2 mx-auto mb-2 mt-1" placeholder="Enter Username" 
            onChange={(e)=>setNewUsername(e.target.value)}
          />
          {newUsername !=="" && !usernamePerm && <p className="bg-[#00000000] mt-2 text-sm text-red-700 mb-5 mx-auto">*You can only use lowercase alphabets and underscore(_)</p>}
          <button className="bg-[#00000000] border-[2px] border-blue-800 w-1/3 h-12 rounded-lg mx-auto" 
            onClick={() => {
              checkChatExistence();
              addNewChatControls.set({scaleY:0}) 
              setSearchPanelVisiblity(!serachPanelVisiblity)
            }}
          >Begin Chat</button>
        </motion.div>
        
        }

        <motion.div animate={chatCardControls}>
          { 
            (filteredArray !== null ? filteredArray : chatCardList).map((item) => {
              const username = item;
              return <UserlistItem username={username} updateSelectedUserFunc = {updateSelectedUserFunc} startAnimation={startAnimation}/>;
            })
          }
        </motion.div>
    </div>
  );
};
export default UserList;
