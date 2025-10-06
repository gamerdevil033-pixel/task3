import axios from 'axios'

import { useNavigate,Link } from "react-router-dom";
import {useContext,useEffect,useRef,useState,useMemo} from 'react'

  import '../../App.css'
  
  import Loader from '../../components/loader.jsx'
  import { authContext } from '../../contexts/authContext.jsx'

     let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export function VendorDashboard(){
  let navigate = useNavigate()
  let { user, setUser } = useContext(authContext)
  let [usersData, setUsersData] = useState([])
  let [transactionsData, setTransactionsData] = useState([])
  let [loading, setLoading] = useState(true)

 
 const {
  totalTransactions,
  totalAmount,
  totalSuccessfulTransactions,
  totalSuccessfulAmount,
  totalFailedTransactions,
  totalFailedAmount,
  totalClients,
  totalVerifiedClients,
  totalVendors,
  totalVerifiedVendors,
} = useMemo(() => {
  let tTransactions = transactionsData.length;
  let tAmount = 0;
  let tSuccess = 0;
  let tSuccessAmount = 0;
  let tFailed = 0;
  let tFailedAmount = 0;

  transactionsData.forEach(({ amount, status }) => {
    tAmount += amount;
    if (status === 'FAILED') {
      tFailed++;
      tFailedAmount += amount;
    } else {
      tSuccess++;
      tSuccessAmount += amount;
    }
  });

  let cClients = 0, vClients = 0, cVendors = 0, vVendors = 0;
  usersData.forEach(({ role, isVerified }) => {
    if (role === 'client') {
      cClients++;
      if (isVerified) vClients++;
    } else if (role === 'vendor') {
      cVendors++;
      if (isVerified) vVendors++;
    }
  });

  return {
    totalTransactions: tTransactions,
    totalAmount: tAmount,
    totalSuccessfulTransactions: tSuccess,
    totalSuccessfulAmount: tSuccessAmount,
    totalFailedTransactions: tFailed,
    totalFailedAmount: tFailedAmount,
    totalClients: cClients,
    totalVerifiedClients: vClients,
    totalVendors: cVendors,
    totalVerifiedVendors: vVendors,
  };
}, [transactionsData, usersData]);


  useEffect(() => {
        setLoading(true)
 
     axios
        .get(`${BASE_URL}/transaction/find`)
        .then(res => {
          setTransactionsData(res.data);
          axios
         .get(`${BASE_URL}/auth/find?role=all`)
         .then(r => {
            setUsersData(r.data.users);
              setTimeout(()=>{
              setLoading(false);
              },500)
            })
            .catch(err => {})
      }).catch(err => {})

        },[])

      
  return (
   <div className="backgroundDiv min-h-screen">
    <div className="container ">
      <div className="header py-4 bg-blue-300 text-white font-bold pl-2">Dashboard</div>

      <br/>

     {loading?<Loader/>:(
            <div className="body flex gap-4 flex-col">

        <div className="transactionsBox border-amber-100 border-1 bg-gray-900 text-white">

          <div className="header flex justify-between p-4 border-b-2">
           <span className="heading">Transactions</span>
           <Link to='/admin/transactions' className="viewAll cursor-pointer">View All</Link>
          </div>

           <div className="transactions flex flex-wrap justify-between items-center gap-4 py-4 px-6">

            <span className="total flex">
              <span className="right flex flex-col items-start gap-2">
              <span className="totalTransactions">
               Total Transactions : {totalTransactions}
              </span>
              <span className="totalAmount">
               Total Amount : {totalAmount}
              </span>
            </span>
            </span>

            <span className="successful">
              <span className="right flex flex-col items-start gap-2">
              <span className="totalTransactions">
                Successful Transactions :{totalSuccessfulTransactions}
              </span>
              <span className="totalAmount">
                Total Amount : {totalSuccessfulAmount}
              </span>
            </span>
            </span>

            <span className="failed">
              <span className="right flex flex-col items-start gap-2">
              <span className="totalTransactions">
                  Failed Transactions :  {totalFailedTransactions}
              </span>
              <span className="totalAmount">
                Total Amount : {totalFailedAmount}
              </span>
             </span>
            </span>
           </div>

        </div>

        <div className="usersBox border-amber-100 border-1 bg-gray-900 text-white">

          <div className="header flex flex-wrap justify-between p-4 border-b-2">
           <span className="heading">Users</span>
           <span className="viewAll cursor-pointer" onClick={()=>{navigate('/admin/home')}}>View All</span>
          </div>

           <div className="transactions flex justify-between items-center gap-4 py-4 px-6">

            <span className="total flex flex-col items-start">
              <span className="totalClients">
               Total Clients : {totalClients}
              </span>
              <span className="totalAmount">
               Total Verified Clients : {totalVerifiedClients}
            </span>
            </span>

           </div>

        </div>

      </div>
     )}

    </div>
   </div>
  )
}