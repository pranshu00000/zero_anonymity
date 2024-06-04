import { FaRegClock } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
const SentMsg = (props) => {

    return (
        <div className=" my-1 flex justify-end " id={props.id} >
            <span className="bg-white pt-1 rounded-t-xl rounded-bl-xl px-4  font-semibold align-middle max-w-[55%] h-auto text-left flex flex-col">
                {props.msg}
                <span className=" flex justify-end">
                    {/* replace time with timestamp of msg from firebase */}
                <span className="pr-[2px]  text-[10px] text-black text-right ">{props.time}</span>
            {!props.sent ? <FaRegClock className="text-[10px] mt-[3px] font-extrabold"/>
            :<TiTick className="text-[12px] mt-[1.5px] "/>}
                </span>
            </span>
            
        </div>
    );
  };
  
  export default SentMsg;
  



