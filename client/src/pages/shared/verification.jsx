import axios from 'axios'

import {useState,useEffect,useContext} from 'react'
import { authContext } from './../../contexts/authContext';

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export function EmailVerification(){
  let {user,setUser} = useContext(authContext);

  useState(()=>{})

  const handleSubmit=(event)=>{

    console.log(event)
    event.preventDefault();
    axios
      .put(`${BASE_URL}/auth/changePassword?userId=${user._id}`,form)
      .then(res => {
        alert(res.data.message);
        console.log(res.data);
        setForm({currentPassword:'',newPassword:''})
        })
      .catch(err => {alert(err.response.data.message);console.log(err);})
  }



  return (
    <div className="backgroundDiv bg-[#ebebeb]">
      <div className="container flex flex-col gap-4 min-h-screen">

        <div className="passwordChange p-4 bg-gray-900 rounded-md">
        <div className="header flex justify-between items-center font-bold text-white pb-4">
          <span className="heading">Change Password</span>
          <span className="back btn">Go Back</span>
        </div>

        <div className="passwordContainer text-white flex flex-col gap-4 ">

          <div className="current text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label htmlFor="currentPassword">Enter Current Password : </label>
          <input type="password" name="currentPassword" id="currentPassword" value={form.currentPassword} placeholder='Enter Current Password' className='border-1 py-1 px-2 rounded-md' pattern='^[a-zA-Z0-9]+$'
         onChange={(e)=>{setForm(pre=>({...pre,[e.target.name]:e.target.value}))}}/>
          </div>

          <div className="newPassword text-white  flex flex-col sm:flex-row items-start sm:items-center  gap-4">
          <label htmlFor="newPassword">Enter New Password : </label>
          <input type="password" name="newPassword" id="newPassword" value={form.newPassword} placeholder='Enter New Password' className='border-1 py-1 px-2 rounded-md' onChange={(e)=>{setForm(pre=>({...pre,[e.target.name]:e.target.value}))}}/>
          </div>

        </div>
        <div className="footer flex justify-between items-center text-white pt-6">
          <span className="cancel btn">Cancel</span>
          <span className='confirm btn' onClick={handleSubmit}>Confirm</span>
          </div>
        </div>
      </div>
    </div>
  )
}