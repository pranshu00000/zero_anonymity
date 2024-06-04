import { setChameleon, setUserSelected, setUser_2, user_2 } from "../../backend/src/GlobalValues";
import { login } from "../../backend/src/functions";
import { useNavigate } from "react-router-dom";

const ChameleonMode = ({setCurrentUserFunc}) => {
    const navigateTo = useNavigate();

    const handleClick = async () => {
        await login(user_2); 
        setCurrentUserFunc(user_2) ;
        setUser_2("")
        setChameleon(false);
        setUserSelected(false);
    } 

    return(
          <button className=" my-auto mr-20 h-[36px] flex justify-center items-center px-2 rounded-xl border-[2px] border-blue-600" onClick={handleClick}>
            <p className=" font-bold text-blue-600">Chameleon Mode</p>
          </button>

    )
}

export default ChameleonMode;