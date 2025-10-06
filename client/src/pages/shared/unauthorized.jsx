import { Link,Navigate } from 'react-router-dom';
import {useContext} from 'react';

import {authContext} from '../../contexts/authContext'

export function Unauthorized(){
   let {user} = useContext(authContext);

   if(!user){
    return <Navigate to='/login'/>
   }

  return(
    <div className="pageNOtFoundContainer w-screen h-screen fixed z-200 text-xl text-white bg-[#0D0F12] flex justify-center items-center">
      <div className="box p-4 flex flex-col justify-center items-center gap-4 ">
       <span className="title text-[24px]">(401)Unauthorized Page</span>
       <Link to={user.role==='client'?'/':`/${user.role}`}>
      <button className="home px-2 py-4 border-2 rounded-xl active:bg-blue-600 transition-all duration-300 text-[24px] cursor-pointer">Home</button>
       </Link>
      </div>
    </div>
  )
}