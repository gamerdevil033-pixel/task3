import axios from 'axios'

import { createContext, useState,useEffect } from 'react';
import {useLocation} from 'react-router-dom';

export const authContext = createContext();

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL
const CLIENT_URL = import.meta.env.VITE_CLIENT_BASE_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [authLoading,setAuthLoading] = useState(true);
  const [authMessage,setAuthMessage] = useState('')
  const [refresh,setRefresh] = useState(false)

  const logout=()=>{
    setUser(null);
    localStorage.removeItem('token');
  }
  
  const fetchUserWithToken=()=>{
    const token = localStorage.getItem('token');
     if (token) {
        axios
          .get(`${BASE_URL}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
            console.log(res.data[0])
            setUser(res.data[0]);
          })
  }}


  const updateUser=(updateFields)=>{
    axios
      .put(`${BASE_URL}/auth/update?id=${user._id}`, {'updateFields':updateFields})
      .then(res => {
        console.log('updatedSuccessfully',res.data)
          setUser(res.data.user);
      })
      .catch(err => {});
  }

  const getLinkStatus = (user,setLoading,setPayData) =>{
    if(user && localStorage.getItem('link_id')){
      console.log('hello')
      axios
          .get(`${BASE_URL}/payment/verify?link_id=${localStorage.getItem('link_id')}`).then((res)=>{
            console.log(res)

            if(res.data.status === 'PAID'){
        axios
            .post(`${BASE_URL}/email/invoice?email=${user?.email}`,res.data)
            .then((res)=>{
              console.log('pdf send successfully')
            })
          }

            if(res.data.status==='PAID' || res.data.status==='FAILED'){
              console.log('beforeRemoved')
              localStorage.removeItem('link_id');
              console.log(res.data)
              setPayData(res.data)
              setLoading(false)
            }
          }).catch(err=>console.log(err))
    } else {
      location.href=CLIENT_URL;
    }

  }

   const createLink = (body) => {
    axios
      .post(`${BASE_URL}/payment/create-link?totalAmount=${body.amount}`,body)
      .then(res => {
        localStorage.setItem('link_id',res.data.link_id);
        console.log(res.data);
        window.location.href = res.data.link_url;
      })
  }

    useEffect(()=>{
    if (!user) {
      console.log('entered')
      const token = localStorage.getItem('token');
      if (token) {
        console.log('token exists')
        axios
          .get(`${BASE_URL}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
          console.log(res);
          if(!res.data[0].isSuspended){
          setUser(res.data[0]);setAuthLoading(false)
          }
          }).catch(err=>{
            console.log(err)
            if(err.status==401){
              setAuthMessage('Token Expired')
              logout();
            }
            setAuthLoading(false)
          })
      } else{setAuthLoading(false)};
    }
  },[]);

  return (
    <authContext.Provider value={{user,setUser,logout,authLoading,updateUser,createLink,getLinkStatus,authMessage,refresh,setRefresh}}>
      {children}
    </authContext.Provider>
  )
}