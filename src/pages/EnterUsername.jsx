import { useEffect, useState } from "react";
import UsernameInUse from "../components/UsernameInUse";
import { login } from "../../backend/src/functions";
import {  spectatorMode } from "../../backend/src/GlobalValues";
import { useNavigate } from "react-router-dom";
// var isIdActive = require("./GlobalValues");

const EnterUsername = () => {
 
    const navigateTo = useNavigate();
    function ToChatPage() {
      navigateTo("/Chats");
    }
    const [usernameActiveStatus,setUsernameActiveStatus] = useState(false);
    const[userId,setUserId]=useState("");
    const[access,setAccess]=useState(false);
    const[usernamePerm,setUsernamePerm]=useState(false);
    const regex = /^[a-z_]*$/;

      const GoBtnPressed=async ()=>{
        {usernamePerm && await login(userId);}
        {usernamePerm && checkStatus() ;}
      }
      var checkStatus = ()=>{
        if(spectatorMode){
          setUsernameActiveStatus(true);
          setAccess(true)
          {access && ToChatPage(); }
        }else{
          setUsernameActiveStatus(false);
          {ToChatPage();}
          // window.location.href='/chats';
          // event.preventDefault();
        }
      }

      useEffect(()=>{
        if(regex.test(userId))
      { 
        if(userId!==""){
        setUsernamePerm(true);
        console.log("allowed")}
        else{
          setUsernamePerm(false);
          const emptyUsername = true;
          console.log("not allowed")
        }
      }else{
        setUsernamePerm(false);
        console.log("not allowed")
      }
      },[userId])
      // const successLogin=()=>{
      //   window.location.href='/chats';
      // }   
    //for bakchodi
    // database se fetch krna pdega ki username active ya nhi or uske baad idhr show or hide kr denge.   
    return (
        <div className=" flex justify-center items-center h-5/6 md:h-4/5 flex-col ">
                <span className=" text-3xl font-bold align-middle">Enter Username:</span>
                <div className="flex justify-around items-center mt-4 w-11/12 sm:w-2/3 md:w-[450px] h-12">
                    <input className="bg-gray-200 border-[1px] text-base border-black rounded-xl h-10 sm:h-12 px-2 sm:px-4 py-2 w-4/5 mx-2" placeholder="I am..." id="UsernameInput" onChange={(e)=>setUserId(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter")
                    GoBtnPressed();
                    }}
                    />
                    <button className="bg-black text-white w-1/5 rounded-2xl h-10 sm:h-12" onClick={()=>(GoBtnPressed())}>Go</button>
                </div>
                {userId !=="" && !usernamePerm && <p className="bg-[#00000000] mt-2 text-red-700">*You can only use lowercase alphabets and underscore(_)</p>}
                {usernameActiveStatus && <div className="text-center flex flex-col">
                    <span className="font-bold text-lg mt-8">Oops, this username is already being used.</span>
                    <span className="mt-4 font-semibold text-lg">Wait until it is available <br/> or <br/> Spectate the user</span>
                   <div className=" w-11/12 mx-auto  md:w-full  flex flex-col justify-evenly mt-8 p-4 border-2 border-black rounded-lg">
                        {/* <p className="text-lg font-bold mt-4">Enter Spectator mode ?</p> */}
                        <div className=" flex flex-col justify-evenly items-center mt-6 gap-5 mb-4">
                            <button className="bg-black text-white font-semibold w-4/6 h-10 rounded-lg" 
                            onClick={async () => {await login(userId); checkStatus()
                            }}>Enter Spectator Mode</button>
                            <button className="bg-white text-black font-semibold w-4/6 h-10 rounded-lg border-2 border-black">Pick Random Username</button>
                      </div>
                   </div>
                </div> }
        </div>
    );
  };
  
export default EnterUsername;