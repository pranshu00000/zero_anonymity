
import { setChameleon, setUserSelected, setUser_2, user_2 } from "../../backend/src/GlobalValues";
import { FlatTree, motion, useAnimation } from "framer-motion";
const UserlistItem = ({username, updateSelectedUserFunc, startAnimation}) => {

    const controls = useAnimation();

    const handleClick = async () => {    
      if(username !== user_2){    
        await setUser_2(username);
        startAnimation();
        setUserSelected(true);
        updateSelectedUserFunc(username);
        setChameleon(true);
        controls.set({backgroundColor: "#0000FF"})
      }
    }

    const onHoverEnter = () => {
      controls.start({backgroundColor: ["#FFFFFF", "#FF0000"]})
    }
    const onHoverExit = () => {
      controls.start({backgroundColor: ["#FF0000", "#FFFFFF"]})
    }

    return (

        <motion.div 
        animate={controls}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverExit}
        className=" border-[1px] border-gray-600 flex rounded-bl-[30px] rounded-tr-[30px] rounded-tl-xl rounded-br-xl  items-center pl-8 py-3 my-[4px] cursor-pointer" onClick={()=>{handleClick();}}>

        <img
            src="https://banner2.cleanpng.com/20180523/tha/kisspng-businessperson-computer-icons-avatar-clip-art-lattice-5b0508dc6a3a10.0013931115270566044351.jpg"
            alt="I"
            className="rounded-full h-12 w-12 "
          />
          <span className="ml-4 text-lg  font-bold text-black">{username}</span>
        </motion.div>
    );
  };
  
  export default UserlistItem;