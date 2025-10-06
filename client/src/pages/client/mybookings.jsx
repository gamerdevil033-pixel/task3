import axios from 'axios'

import { useContext, useEffect,useState,useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GiSpectacleLenses } from "react-icons/gi";

import { authContext } from '../../contexts/authContext.jsx'
import '../../App.css'
import Loader from '../../components/loader.jsx'
import { TransactionElement } from '../../components/transactionElement.jsx'

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const MyBookings = () => {
  const navigate = useNavigate();
  const { user, setUser} = useContext(authContext);

  let [filteredData,setFilteredData] = useState([]);
  let [loading, setLoading] = useState(true);

 
  const filterData = (data) => {
    const filtered = data.filter((d) => {
        return d.status === "PAID";
    });
    setFilteredData(filtered);
    console.log(filtered)
    setLoading(false);
  }

  function cancelTicket(transactionId){
        setLoading(true);
    axios
        .post(`${BASE_URL}/transaction/cancel?transactionId=${transactionId}`)
        .then(res => {
        console.log(res.data)
         setTimeout(()=>fetchData(),1000)})
        .catch(err => {})
  }



  function fetchData(){
     axios
        .get(`${BASE_URL}/auth/find?id=${user._id}`)
        .then(res => {
        const filtered = res.data.users.myTransactions.filter((d) => {
        return d.status === "PAID";
         });
          setFilteredData(filtered);
          console.log(filtered)
          setLoading(false);
        }).catch(err => {})
  }

  useEffect(() => {
    setLoading(true);
    fetchData()
  }, [])  

  return (
    <div className="backgroundDiv min-h-screen text-white">
      <div className="container">

        <div className="header">
          <div className="heading font-extrabold text-xl">My Bookings</div>
        </div>

<br/>

          {loading ? <Loader/> : (<div className="transactions flex flex-col gap-4">
                        {filteredData.length === 0 && 
            <div className='min-h-[70Vh] flex justify-center items-center'>
             <span className="text-xl font-extrabold text-red-500 flex flex-col justify-center items-center"><GiSpectacleLenses className="text-4xl"></GiSpectacleLenses>
             <span>No Bookings Found</span></span>
            </div>
            }
               {filteredData.length > 0 && filteredData.map((transaction,idx)=>{
            return <BookingsElement transaction={transaction} cancelTicket={cancelTicket} key={idx}/>})}
        </div>)}
      </div>
    </div>
  )
}


function BookingsElement({transaction,cancelTicket}){

  function downloadHandler(link_id){
    console.log(link_id)
   axios.get(`http://localhost:5000/pdf/download?link_id=${link_id}`,{
    responseType: 'arraybuffer'
   }).then(res=>{
    const url = URL.createObjectURL(new Blob([res.data],{type:'application/pdf'}))
    const a = document.createElement('a');
    a.href=url;
    a.download = 'invoice.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
   })
  }
 
  if(transaction.purpose==='movie'){
  return(
    <div className="transactionContainer border-2 border-white text-white rounded-lg">
        
        <div className="header flex justify-between py-2 bg-blue-400 border-b-2 border-white text-black">
        <span className="bookedAt text-lg font-extrabold px-2">Booked on : <span className="bookedAt text-lg font-normal">{transaction.createdAt.split('T')[0]}</span></span>
        <span className={`totalAmount font-bold text-lg px-2`}>Amount paid : <span className="bookedAt text-lg font-normal">₹{transaction.amount}</span></span>
        </div>

      <span className="leftContainer flex flex-col gap-2 bg-white text-black px-2">
        <span className="bookedAt text-lg font-extrabold">Date : <span className="bookedAt text-lg font-normal">{transaction.metaData.date.split('T')[0]}</span></span>
        <span className="bookedAt text-lg font-extrabold">slot : <span className="bookedAt text-lg font-normal">{transaction.metaData.slot}</span></span>
        <span className="entityType text-lg font-extrabold">ShowId : <span className="bookedAt text-lg font-normal">{transaction.metaData.showId}</span></span>
        <span className="entityType text-lg font-extrabold">Movie : <span className="bookedAt text-lg font-normal">{transaction.metaData.movie}</span></span>
        <span className="entityType text-lg font-extrabold">Theater : <span className="bookedAt text-lg font-normal">{transaction.metaData.theater}</span></span>
        <span className="entityType text-lg font-extrabold">seatsBooked : <span className="bookedAt text-lg font-normal">{transaction.metaData.seatsBooked.toString()}</span></span>
      </span> 
  

      <div className="footer flex justify-between bg-white text-black py-3 px-2">
        <span className="btn" onClick={()=>{cancelTicket(transaction._id)}}>Cancel Booking</span>
         <span className="btn" onClick={()=>{console.log('helo');downloadHandler(transaction.link_id)}}>Download Ticket</span>
      </div>
    </div>
  )}

  if(transaction.purpose==='concert'){
  return(
    <div className="transactionContainer border-2 border-white text-white rounded-lg">
        
        <div className="header flex justify-between py-2 bg-blue-400 border-b-2 border-white text-black">
        <span className="bookedAt text-lg font-extrabold px-2">Booked on : <span className="bookedAt text-lg font-normal">{transaction.createdAt.split('T')[0]}</span></span>
        <span className={`totalAmount font-bold text-lg px-2`}>Amount paid : <span className="bookedAt text-lg font-normal">₹{transaction.amount}</span></span>
        </div>

      <span className="leftContainer flex flex-col gap-2 bg-white text-black px-2">
        <span className="bookedAt text-lg font-extrabold">Date : <span className="bookedAt text-lg font-normal">{transaction.metaData.date.split('T')[0]}</span></span>
        <span className="bookedAt text-lg font-extrabold">slot : <span className="bookedAt text-lg font-normal">{transaction.metaData.slot}</span></span>
        <span className="entityType text-lg font-extrabold">ShowId : <span className="bookedAt text-lg font-normal">{transaction.metaData.showId}</span></span>
        <span className="entityType text-lg font-extrabold">Concert : <span className="bookedAt text-lg font-normal">{transaction.metaData.concert}</span></span>
        <span className="entityType text-lg font-extrabold">Stadium : <span className="bookedAt text-lg font-normal">{transaction.metaData.stadium}</span></span>
        <span className="entityType text-lg font-extrabold">seatsBooked : <span className="bookedAt text-lg font-normal">{transaction.metaData.seatsBooked.toString()}</span></span>
      </span> 
  

      <div className="footer flex justify-between bg-white text-black py-3 px-2">
        <span className="btn" onClick={()=>{cancelTicket(transaction._id)}}>Cancel Booking</span>
         <span className="btn" onClick={()=>{console.log('helo');downloadHandler(transaction.link_id)}}>Download Ticket</span>
      </div>
    </div>
  )}

    if(transaction.purpose==='train'){
  return(
    <div className="transactionContainer border-2 border-white text-white rounded-lg">
        
        <div className="header flex justify-between py-2 bg-blue-400 border-b-2 border-white text-black">
        <span className="bookedAt text-lg font-extrabold px-2">Booked on : <span className="bookedAt text-lg font-normal">{transaction.createdAt.split('T')[0]}</span></span>
        <span className={`totalAmount font-bold text-lg px-2`}>Amount paid : <span className="bookedAt text-lg font-normal">₹{transaction.amount}</span></span>
        </div>

      <span className="leftContainer flex flex-col gap-2 bg-white text-black px-2">
        <span className="bookedAt text-lg font-extrabold">Date : <span className="bookedAt text-lg font-normal">{transaction.metaData.journeyDate.split('T')[0]}</span></span>
        <span className="entityType text-lg font-extrabold">Train Name : <span className="bookedAt text-lg font-normal">{transaction.metaData.trainName}(#{transaction.metaData.trainNumber})</span></span>
        <span className="bookedAt text-lg font-extrabold">From : <span className="bookedAt text-lg font-normal">{transaction.metaData.from}</span></span>
        <span className="entityType text-lg font-extrabold">To : <span className="bookedAt text-lg font-normal">{transaction.metaData.to}</span></span>
        <span className="entityType text-lg font-extrabold">Duration : <span className="bookedAt text-lg font-normal">{transaction.metaData.duration}</span></span>
        <span className="entityType text-lg font-extrabold">Arrival Time: <span className="bookedAt text-lg font-normal">{transaction.metaData.arrivalTime}</span></span>
        <span className="entityType text-lg font-extrabold">Destination Time : <span className="bookedAt text-lg font-normal">{transaction.metaData.arrivalTime}</span></span>
      </span> 
  

      <div className="footer flex justify-between bg-white text-black py-3 px-2">
        <span className="btn" onClick={()=>{cancelTicket(transaction._id)}}>Cancel Booking</span>
        <span className="btn" onClick={()=>{console.log('helo');downloadHandler(transaction.link_id)}}>Download Ticket</span>
      </div>
    </div>
  )}
}