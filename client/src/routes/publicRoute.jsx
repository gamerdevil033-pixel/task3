import axios from 'axios'

import { Outlet, useLocation, Navigate,useNavigate } from 'react-router-dom'
import { useEffect, useContext } from 'react'

import { authContext } from '../contexts/authContext'

import Header from '../components/header'
import Footer from '../components/footer'
import Loader from '../components/loader'
// import jwt from "jsonwebtoken";

export function PublicRoute () {
  const { user, setUser,authLoading} = useContext(authContext)

  console.log(authLoading)

    return(
    <div className='bg-black w-screen'>
      {authLoading?<Loader/>:
      <>
       <Header/>
       <Outlet/>
       <Footer/>
      </>
      }

    </div>)
}
