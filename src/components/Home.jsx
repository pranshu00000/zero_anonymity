import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full flex justify-center overflow-x-hidden">
      <span className="h-32 w-64 lg:w-[600px] z-0  bg-hero bg-contain bg-no-repeat bg-center absolute top-60 lg:top-48 fading" />

      <span className="leftslide1 h-28 lg:h-56 w-36 lg:w-80 bg-hindi bg-contain bg-no-repeat bg-center absolute -left-8 top-24 lg:top-24  lg:-left-20" />
      <span className="leftslide2 h-28 lg:h-56  w-36 lg:w-80 bg-japnese bg-contain bg-no-repeat bg-center absolute top-[520px] left-0  lg:top-[450px] lg:left-20" />
      <span className="rightslide2 h-28 lg:h-56 w-36 lg:w-80   bg-russian bg-contain bg-no-repeat bg-center absolute top-[500px]  lg:top-96 right-0" />
      <span className="rightslide1 h-28 lg:h-44 w-36 lg:w-80   bg-spanish bg-contain bg-no-repeat bg-center absolute top-32  lg:top-32 -right-10 lg:-right-32" />

      <span className="h-96 w-[350px] lg:w-[1000px] bg-trailExtended2 bg-contain bg-no-repeat bg-center absolute top-[206px] lg:top-[210px]" />

      <Link to="/enterUsername" className="absolute top-[470px] lg:top-[550px] border-2 bg-white border-black rounded-2xl px-8 py-3 lg:px-12 lg:py-4 cursor-pointer hover:translate-y-1 z-10"><div >
        Start texting
      </div></Link>
      <div className="absolute top-[480px] lg:top-[560px] border-2 border-black bg-black rounded-2xl px-8 py-3 lg:px-12 lg:py-4 cursor-pointer z-0">
        Start texting
      </div>
      <div className="absolute text-center top-[390px] text-[15px] lg:top-96 lg:text-4xl font-semibold">
        Connecting strangers around the world in a single click
      </div>
    </div>
  );
};

export default Home;
