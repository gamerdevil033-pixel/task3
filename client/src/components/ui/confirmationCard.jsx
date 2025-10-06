import './../../App.css'

import {useState} from 'react'

export const Confirmation = ({setMaxSeatCount,setConfirmationOver})=>{
 
  let max = 4;
  let [count,setCount] = useState(0);

return(
  <div className="background w-screen h-screen fixed z-4 overflow-hidden flex justify-center items-center left-0">
    <div className="w-[30%] h-[40%] rounded-xl border-2 border-[#97D0ED] p-1 md:p-2 xl:p-3 flex flex-col justify-between gap-1 items-center bg-black">
      <h1 className="mainTitle align-center text-2xl font-bold">Select no of seats</h1>
      <h2 className="subtitle text-lg font-medium">seats</h2>
      <div className="seatsSelectionContainer w-full flex gap-1 flex-wrap justify-around">
        {Array(max).fill(null).map((val,idx)=>{
            return <span key={idx} className={`h-10 w-10 rounded-xl border-1 border-[#636363] cursor-pointer hover:border-white transition duration-200 flex items-center justify-center ${idx+1==count?'bg-[#4242FA]':''}`} onClick={()=>{setCount(idx+1)}}><span className='pointer-events-none'>{idx+1}</span></span>
        })}
      </div>
      <button className="btn confirm font-medium text-white text-sm md:text-md xl:text-xl" onClick={()=>{setMaxSeatCount(count);setConfirmationOver(true);}}>Confirm</button>
    </div>
  </div>
)
}

