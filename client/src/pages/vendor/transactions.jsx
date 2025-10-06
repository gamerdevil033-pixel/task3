import axios from 'axios'

import { useContext, useEffect,useState,useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GiSpectacleLenses } from "react-icons/gi";

import { authContext } from '../../contexts/authContext.jsx'
import '../../App.css'
import Loader from '../../components/loader.jsx'
import { TransactionElement } from '../../components/transactionElement.jsx'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const VendorTransactions = () => {
  const navigate = useNavigate();
  const { user, setUser} = useContext(authContext);

  let [data, setData] = useState([]);
  let [filteredData,setFilteredData] = useState([]);
  let [loading, setLoading] = useState(true);
  let [currentFilter,setCurrentFilter] = useState('all');
  let filters = ['all','successful','failed']


  const filterData = useCallback(() => {
    setLoading(true);
    const filtered = data.filter((d) => {
      if (currentFilter === 'successful') {
        return d.status === "PAID";
      } else if (currentFilter === 'failed'){
        return d.status === "FAILED";
      }
      return true;
    });

    console.log(filtered.reverse())
    setFilteredData(filtered.reverse());
    setLoading(false);
  }, [data, currentFilter]);

  useEffect(() => {
    filterData();
  }, [currentFilter, filterData]);


  useEffect(() => {
     axios
        .get(`${BASE_URL}/auth/find?id=${user._id}`)
        .then(res => {
          console.log(res.data.users.myTransactions)
          setData(res.data.users.myTransactions.slice(-5));
          setFilteredData(res.data.users.myTransactions);
          setLoading(false);
        })
        .catch(err => {})
  }, [])  

  return (
    <div className="backgroundDiv min-h-screen text-white">
       {loading ? <Loader/> : ( <div className="container flex flex-col gap-2">
           <div className="header w-full flex flex-col ">
             <div className="heading font-extrabold text-[30px] py-2">Transactions</div>
   
             <div className="balance py-2 flex flex-between px-4 w-full gap-8">
               <div className="amount"><span className="title font-bold">YOUR BALANCE : </span>{user.amountAvailable}</div>
   
               <div className="monthSummary">
                 <div className="amount"><span className="title font-bold">This Month : </span>{user.amountAvailable}</div>
               </div>
             </div>
   
           </div>
   
           <br />


        <div className="body flex gap-6 flex-col">
          <div className='filters flex justify-center items-center'>
            <div className='filtersContainer border-1 shadow-md shadow-black flex justify-around items-center gap-3 rounded-2xl border-[#929090] py-2 px-4 m-auto'>
              {filters.map((filter, idx) => {
                return (
                  <span
                    key={idx}
                    className={`rounded-2xl p-1 px-3 font-bold text-lg text-white cursor-pointer ${currentFilter === filter ? 'bg-[#4242FA]' : 'bg-transparent'
                      }`}
                    onClick={() => {
                      setCurrentFilter(filter)
                    }}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </span>
                )
              })}
            </div>
          </div>

                  {filteredData.length === 0 && 
            <div className='min-h-[70Vh] flex justify-center items-center'>
             <span className="text-xl font-extrabold text-red-500 flex flex-col justify-center items-center"><GiSpectacleLenses className="text-4xl"></GiSpectacleLenses>
             <span>No Transactions Found</span></span>
            </div>
            }

  
          {filteredData.length > 0 &&  <div className="transactions w-full flex justify-center items-center overflow-x-auto">
            <table className='py-[12px] px-[15px] text-start border-[1px] border-[#ddd]'>
              <thead>
                <tr className='bg-[#f8f9fa] text-black w-full text-[16px] md:text-[18px]'>
                 <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>S.No</th>
                  <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>TransactionId</th>
                  <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>Date</th>
                  <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>Paid By</th>
                  <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>Purpose</th>
                  <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>Amount</th>
                  <th className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((transaction, idx) => {
                  return (<tr className='py-[12px] px-[15px] text-start border-b-[1px] border-[#ddd] border-[1px]' key={idx}>
                    <td className='py-[12px] px-[15px] text-start border-b-[1px] border-[#ddd]'>{idx+1}</td>
                    <td className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>{transaction._id}</td>
                    <td className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>{transaction.metaData.date.split('T')[0]}</td>
                    <td className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>{transaction.user?.email}</td>
                    <td className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>{transaction.purpose.charAt(0).toUpperCase()+ transaction.purpose.slice(1)}</td>
                    <td className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>{transaction.amount}</td>
                    <td className='py-[12px] px-[18px] text-start border-b-[1px] border-[#ddd]'>{transaction.status}</td>
                  </tr>)})}
              </tbody>
            </table>
          </div>}
      </div>

   
         </div>)}
    </div>
  )
}

