const RecievedMsg = (props) => {
    return (
        <div className=" my-[4px] flex justify-start">
            <img src="https://banner2.cleanpng.com/20180523/tha/kisspng-businessperson-computer-icons-avatar-clip-art-lattice-5b0508dc6a3a10.0013931115270566044351.jpg" alt="I" className="h-9 w- mr-2 rounded-full" />
            <div className="bg-[#228fcb] rounded-t-xl rounded-br-xl flex flex-col max-w-[55%]">
            <span className=" pt-1  pl-3 pr-6 text-white font-semibold  align-middle  h-auto text-left">
                {props.msg}
                </span>
            <span className="pr-3  text-[10px] text-white text-right ">{props.time}</span>
            </div>
        </div>
    );
  };
  
  export default RecievedMsg;