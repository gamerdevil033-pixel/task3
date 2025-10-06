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


const getLinkStatus = async (user, setLoading, setPayData, navigate) => {
  if (!user) {
    console.log('No user found, exiting getLinkStatus');
    setLoading(false);
    return;
  }

  const linkId = localStorage.getItem('link_id');
  if (!linkId) {
    console.log('No link_id found in localStorage, navigating home');
    setLoading(false);
    navigate('/home');
    return;
  }

  setLoading(true);
  console.log('Starting payment verification for linkId:', linkId);

  try {
    const { data } = await axios.get(`${BASE_URL}/payment/verify?link_id=${linkId}`);

    console.log('Payment verification data:', data);

    if (data.status === 'PAID') {
      await axios.post(`${BASE_URL}/email/invoice?email=${user.email}`, data);
      console.log('Invoice sent successfully');
    }

    if (['PAID', 'FAILED'].includes(data.status)) {
      localStorage.removeItem('link_id');
      setPayData(data);
    } else {
      setPayData({});
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    setPayData({ status: 'ERROR', message: 'Failed to verify payment. Please try again.' });
  } finally {
    console.log('Payment verification complete, stopping loader');
    setLoading(false);
  }
};



   const createLink = (body) => {
    axios
      .post(`${BASE_URL}/payment/create-link?totalAmount=${body.amount}`,body)
      .then(res => {
        localStorage.setItem('link_id',res.data.link_id);
        console.log(res.data);
        window.location.href = res.data.link_url;
      })
  }

useEffect(() => {
  if (!user) {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (!res.data[0].isSuspended) {
            setUser(res.data[0]);
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            setAuthMessage('Token Expired');
            logout();
          }
        })
        .finally(() => setAuthLoading(false)); // MUST be called always
    } else {
      setAuthLoading(false); // no token, so no user
    }
  }
}, []);



  return (
    <authContext.Provider value={{user,setUser,logout,authLoading,updateUser,createLink,getLinkStatus,authMessage,refresh,setRefresh}}>
      {children}
    </authContext.Provider>
  )
}