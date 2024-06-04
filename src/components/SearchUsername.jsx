import React from "react";

const SearchUsername = () => {
  return (
    <div className=" flex flex-col py-10 px-4 border-[1px] border-gray-500 rounded-2xl mx-1 mt-1">
          <p className=" text-lg font-semibold ml-8">Start a new chat :</p>
          <input type="text" className="bg-[#00000000] border-[2px] border-gray-500 h-12 w-5/6   rounded-xl pl-2 mx-auto mb-5 mt-1" placeholder="Enter Username" />
          <button className="bg-[#00000000] border-[2px] border-blue-800 w-1/3 h-12 rounded-lg mx-auto">Begin Chat</button>
    </div>
  );
};

export default SearchUsername;
