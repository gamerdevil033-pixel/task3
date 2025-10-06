import axios from 'axios'

import { Outlet, useLocation, Navigate,useNavigate } from 'react-router-dom'
import { useEffect, useContext } from 'react'

import { authContext } from '../contexts/authContext'

import Header from '../components/header'
import Footer from '../components/footer'
import Loader from '../components/loader'

// import jwt from "jsonwebtoken";

export function ProtectedRoute({ allowedRoles }) {
  const { user, authLoading } = useContext(authContext);
  const location = useLocation();

  if (authLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return ( <>
       <Header/>
       <Outlet/>
       <Footer/>
      </>)
}

