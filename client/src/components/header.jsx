import { FiMenu } from "react-icons/fi";
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import '../App.css';
import { authContext } from '../contexts/authContext';

import { TbLogout } from "react-icons/tb";
import { FaHome } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { MdLocalMovies } from "react-icons/md";
import { MdDirectionsRailway } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaBookmark } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiContactsFill } from "react-icons/ri";
import { GiCometSpark } from "react-icons/gi";

function Header() {
  const { user, logout, setAuthMessage } = useContext(authContext);
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);

  // Default links when no user
  const guestLinks = [
    { path: '/login', name: 'Login' },
    { path: '/signup', name: 'Signup' },
  ];

  const links = {
    client: [
      { path: '/home', name: 'Home' },
      { path: '/myBookings', name: 'My Bookings' },
      { path: '/recentTransactions', name: 'Transactions' },
      { path: '/changePassword', name: 'Change Password' },
      { path: '/contactUs', name: 'Contact Us' }
    ],
    admin: [
      { path: '/admin/home', name: 'Home' },
      { path: '/admin/dashboard', name: 'Dashboard' },
      { path: '/admin/movies', name: 'Movies' },
      { path: '/admin/concerts', name: 'Concerts' },
      { path: '/admin/trains', name: 'Trains' },
      { path: '/admin/transactions', name: 'Transactions' },
      { path: '/changePassword', name: 'Change Password' },
      { path: '/contactUs', name: 'Contact Us' }
    ],
    vendor: [
      { path: '/vendor/home', name: 'Home' },
      { path: '/vendor/dashboard', name: 'Dashboard' },
      { path: '/vendor/transactions', name: 'Transactions' },
      { path: '/changePassword', name: 'Change Password' },
      { path: '/contactUs', name: 'Contact Us' }
    ]
  };

  const icons = {
    Home: <FaHome />,
    'My Bookings': <FaBookmark />,
    'Change Password': <RiLockPasswordFill />,
    'Contact Us': <RiContactsFill />,
    Movies: <MdLocalMovies />,
    Trains: <MdDirectionsRailway />,
    Transactions: <GrTransaction />,
    Dashboard: <MdDashboard />,
    Concerts: <GiCometSpark />
  };

  useEffect(() => {
    setMenu(false);
    window.scroll(0, 0);
  }, [pathname]);

  return (
    <div className='header w-screen h-[65px] bg-black shadow-sm shadow-[#ffffff] fixed z-10 top-0 flex justify-center'>
      <div className='headerContainer flex justify-between items-center w-[85%]'>
        <div className='logoContainer text-white hover:text-[#4242FA] font-serif font-bold text-2xl cursor-pointer'>
          <FiMenu onClick={() => setMenu(true)} />
        </div>

        {/* <ul className='headerMiddle w-[50%] hidden md:flex text-white font-medium text-md lg:text-xl font-poppins justify-evenly items-center'>
          {user
            ? links[user.role].slice(0, 3).map((ele, idx) => (
                <NavLink key={idx} to={ele.path}>
                  <li>{ele.name}</li>
                </NavLink>
              ))
            : guestLinks.map((ele, idx) => (
                <NavLink key={idx} to={ele.path}>
                  <li>{ele.name}</li>
                </NavLink>
              ))}
        </ul> */}

        {user ? (
          <Link to={user.role === 'client' ? '/profile' : `/${user.role}/profile`} className='flex items-center gap-4'>
            {(user.role === 'client' || user.role === 'vendor') && (
              <div className="clientamount">
                <span className="amount border-1 border-gray-400 hover:border-[#eee] px-3 py-2 text-white rounded-xl">₹{user.amountAvailable}</span>
              </div>
            )}
            <div className='profileContainer'>
              <span className='profileImage'>
                <span className="verificationbox relative size-8 -right-8">
                  {user.isVerified
                    ? <span className="greendot size-2 bg-green-600 animate-ping absolute rounded-full"></span>
                    : <span className="reddot size-2 bg-red-600 animate-ping absolute rounded-full"></span>}
                </span>
                <img src={user.profileImageUrl} className='h-10 w-10 text-white rounded-full' />
              </span>
            </div>
          </Link>
        ) : (
          <Link to='/login' className='text-white font-bold hover:text-[#EA454c]'>
            Login
          </Link>
        )}
      </div>

      {menu && (
        <div className="menuContainer fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenu(false)}
          ></div>

          <div className="relative bg-[#12101D] w-64 md:w-80 lg:w-1/4 h-full p-6 flex flex-col gap-6 transition-transform duration-300 ease-in-out">
            {user && (
              <div className="flex items-center gap-4">
                <img src={user.profileImageUrl} className="h-10 w-10 rounded-full" />
                <div className="flex flex-col">
                  <span className="font-bold text-white">{user.username}</span>
                  <span
                    className="text-sm text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => {
                      logout();
                      setAuthMessage("Logout Successfully");
                      setMenu(false);
                    }}
                  >
                    Logout
                  </span>
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-2 mt-4">
              {user
                ? links[user.role].map((ele, idx) => (
                    <NavLink
                      key={idx}
                      to={ele.path}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-[#1E1A31]"
                      onClick={() => setMenu(false)}
                    >
                      <span className="icon">{icons[ele.name]}</span>
                      <span className="name">{ele.name}</span>
                    </NavLink>
                  ))
                : guestLinks.map((ele, idx) => (
                    <NavLink
                      key={idx}
                      to={ele.path}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-[#1E1A31]"
                      onClick={() => setMenu(false)}
                    >
                      <span className="name">{ele.name}</span>
                    </NavLink>
                  ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
