import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Navigate
} from 'react-router-dom'
import { useContext, useEffect } from 'react'


import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


import { ProtectedRoute } from './routes/protectedRoute.jsx'
import { PublicRoute } from './routes/publicRoute.jsx'
//client
import {Home} from './pages/client/home.jsx'
import MoviesInfo from './pages/client/entityInfo.jsx'
import TicketSelection from './pages/client/ticketSelection.jsx'
import { ContactUs } from './pages/client/contactus.jsx'
import {SeatSelection} from './pages/client/seatSelection.jsx'
import { TrainBooking } from './pages/client/trainBooking.jsx'
import { RecentTransactions } from './pages/client/recentTransactions.jsx'
import {MyBookings} from './pages/client/mybookings.jsx'
// import { TicketSummary } from './pages/client/ticketSummary'

//admin
import { AdminHome} from './pages/admin/home.jsx'
import { Movies } from './pages/admin/movies.jsx'
import { Concerts } from './pages/admin/concerts.jsx'
import { Trains } from './pages/admin/trains.jsx'
import { AdminDashboard } from './pages/admin/dashboard.jsx'
import { Transactions } from './pages/admin/transactions.jsx'
import { VendorEvents } from './pages/admin/vendorEvents.jsx'



//vendor
import { VendorDashboard } from './pages/vendor/dashboard.jsx';
import { VendorHome } from './pages/vendor/home.jsx';
import { VendorTransactions } from './pages/vendor/transactions.jsx';



//shared
import {Unauthorized} from './pages/shared/unauthorized.jsx'
import { ChangePassword } from './pages/shared/changePassword.jsx'
import { ForgotPassword,ResetPassword } from './pages/shared/forgotPassword.jsx'
import { Login, Signup } from './pages/shared/register.jsx'
import { Profile } from './pages/shared/profile.jsx'
import PageNotFound from './pages/shared/pageNotFound.jsx'
import {PaymentRedirecting} from './pages/shared/paymentRedirecting.jsx'
import { ShowsInfo } from './pages/shared/showsInfo.jsx'
import { Shows } from './pages/shared/shows.jsx';

// import { SocketProvider } from './contexts/socketContext.jsx'



let router = createBrowserRouter([
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgotPassword',
    element: <ForgotPassword />
  },
  {
    path: '/resetPassword/:email',
    element: <ResetPassword />
  },
  {
    path: '/admin',
    children: [
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            index:true,
            element : <Navigate to='/admin/dashboard'/>
          },
          {
            path:'home',
            element: <AdminHome />
          },
          {
            path: 'dashboard',
            element: <AdminDashboard />
          },
          {
            path: 'movies',
            element: <Movies />
          },
          {
            path: 'concerts',
            element: <Concerts />
          },
          {
            path: 'show/:entityType/:showId',
            element: <ShowsInfo/>
          },
          {
            path: 'shows/:entityType/:entityId',
            element: <Shows />
          },
          {
            path: 'trains',
            element: <Trains />
          },
          {
            path: 'events/:vendorId',
            element: <VendorEvents />
          },
          {
            path: 'contactus',
            element: <ContactUs />
          },
          {
            path: 'changePassword',
            element: <ChangePassword />
          },
          {
            path: 'transactions',
            element: <Transactions />
          },
          {
            path: 'profile',
            element: <Profile />
          }
        ]
      }
    ]
  },
  {
    path: '/vendor',
    children: [
      {
        element: <ProtectedRoute allowedRoles={['vendor']} />,
        children: [
          {
            index:true,
            element : <Navigate to='/vendor/dashboard'/>
          },
          {
            path: 'home',
            element: <VendorHome />
          },
          {
            path: 'shows/:entityType/:entityId',
            element: <Shows />
          },
          {
            path: 'show/:entityType/:showId',
            element: <ShowsInfo />
          },
          {
            path: 'dashboard',
            element: <VendorDashboard />
          },
          {
            path: 'contactus',
            element: <ContactUs />
          },
          {
            path: 'changePassword',
            element: <ChangePassword />
          },
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'transactions',
            element: <VendorTransactions />
          }
        ]
      }
    ]
  },
 {
    path: '/',
    element: <PublicRoute/>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: ':entityType/:_id',
        element: <MoviesInfo />
      },
    ]
  },
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={['client']} />,
    children: [
      {
        path: ':entityType/:_id/:type',
        element: <TicketSelection />
      },
      {
        path: ':entityType/:_id/:type/:showId',
        element: <SeatSelection />
      },
      {
        path: 'train/:trainId',
        element: <TrainBooking />
      },
      {
        path: 'myBookings',
        element: <MyBookings />
      },
      {
        path: 'recentTransactions',
        element: <RecentTransactions />
      },
      {
        path: 'paymentRedirecting',
        element: <PaymentRedirecting />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'changePassword',
        element: <ChangePassword />
      },
      {
        path: 'contactus',
        element: <ContactUs />
      }
    ]
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  {
    path: '*',
    element: <PageNotFound />
  }
])

function App () {

  return (
    // <SocketProvider>
      <RouterProvider router={router}>
        <ToastContainer position="top-right" autoClose={3000} />
      </RouterProvider>
    // </SocketProvider>
  )
}

export default App
