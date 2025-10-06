import axios from 'axios'

import { useParams, useLocation, useNavigate,Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'

import Loader from '../../components/loader.jsx'
import { authContext } from '../../contexts/authContext.jsx'

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const PaymentRedirecting = () => {
  let { user, setUser,getLinkStatus} = useContext(authContext)
  let navigate = useNavigate();
  let [loading,setLoading] = useState(true);
  let [status, setStatus] = useState('success');
  let [payData,setPayData] = useState({});


  useEffect(() => {
    console.log('came')
    getLinkStatus(user,setLoading,setPayData);
  }, [user])

  function downloadHandler(link_id){
   axios.get(`http://localhost:5000/pdf/download?link_id=${link_id}`,{
    responseType:'blob',
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

  return (
    <div className='backgroundDiv min-h-screen'>
      {loading ? (
        <Loader />
      ) : (
        <div className='container'>
          {payData.status === 'PAID' && <SuccessPage payData={payData} downloadHandler={downloadHandler}/>}
          {payData.status === 'FAILED' && <FailedPage/>}
        </div>
      )}
    </div>
  )
}

function SuccessPage({payData,downloadHandler}) {
  console.log(payData)
  return (
  <div className="Container text-white flex gap-4 flex-col">
    <div className={`header text-xl ${payData.status==='PAID'?'text-green-600':'text-red-600'} font-bold flex place-content-center p-2`}>{payData.status==='PAID'?'PAYMENT SUCCESSFUL':'PAYMENT FAILED'}</div>

    {(payData.purpose === 'movie') &&
    <div className="transactionContainer flex flex-col border-2 border-gray text-white p-2">

      <span className="topContainer flex justify-between px-2">
        <span className="bookedAt text-lg font-extrabold">Booked on : <span className="bookedAt text-lg font-normal">{payData.createdAt}</span>
        </span>
        <span className={`totalAmount font-bold text-lg`}>₹{payData.amount}</span>
        </span> 
 
        <div className="middle md:p-2 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col list-none">
          <li className="duration pb-1"><strong>Date : </strong>{payData.metaData.date.split('T')[0]}</li>
          <li className="languages pb-1"><strong>Slot : </strong>{payData.metaData.slot}</li>
          <li className="trainNumber pb-1"><strong>Movie :</strong>{payData.metaData.movie}</li>
          <li className="title pb-1"><strong>Theater :</strong>{payData.metaData.theater}</li>
        </div>
    </div>
    }

        {(payData.entityType === 'concert') &&
    <div className="transactionContainer flex flex-col border-2 border-gray text-white p-2">

      <span className="topContainer flex justify-between px-2">
        <span className="bookedAt text-lg font-extrabold">Booked on : <span className="bookedAt text-lg font-normal">{payData.createdAt}</span>
        </span>
        <span className={`totalAmount font-bold text-lg`}>₹{payData.amount}</span>
        </span> 
 
        <div className="middle md:p-2 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col list-none">
          <li className="duration pb-1"><strong>Date : </strong>{payData.metaData.date.split('T')[0]}</li>
          <li className="languages pb-1"><strong>Slot : </strong>{payData.metaData.slot}</li>
          <li className="trainNumber pb-1"><strong>Concert :</strong>{payData.metaData.concert}</li>
          <li className="title pb-1"><strong>Stadium :</strong>{payData.metaData.stadium}</li>
        </div>
    </div>
    }

    {payData.purpose === 'train' &&
      <div className='border-2 border-[#eee] px-3 py-1'>
        <div className='header text-white flex flex-col gap-2'>
          <div className='trainDetails flex justify-between items-center'>
            <div className='trainName font-bold'>{payData.metaData.trainName}</div>
            <span className='trainNumber text-[#757575]'>
              #{payData.metaData.trainNumber}
            </span>
          </div>

          <div className='stations flex justify-between items-center'>
            <span className='fromDetails'>
              <div className='stationName font-medium text-lg'>{payData.metaData.from}</div>
              <div className="arrivalTime">{payData.metaData.departureTime}</div>
            </span>

            <span className='duration'>{payData.metaData.duration}</span>

            <span className='toDetails'>
              <div className='stationName font-medium text-lg'>{payData.metaData.to}</div>
            <div className="departureTime">{payData.metaData.arrivalTime}</div>
            </span>
          </div>
        </div>

        <div className="travellerDetails pb-3">
          <div className='travellers'>
            <br />
            {payData.metaData.travellers.map((traveller, idx) => {
                return (
                  <div
                    className='travellerContainer text-white flex justify-between items-center my-2 py-2 border-1 px-4'
                    key={idx}
                  >
                    <div className='left flex'>
                      {idx+1}
                      <li className="number pl-2"></li>
                      <div className='details'>
                        {traveller.name},{traveller.gender},{traveller.age}
                      </div>
                      <div className='preference'>
                        <div className='berth'>{traveller.berthPreference}</div>
                      </div>
                    </div>

                  </div>)
              })}

                   {payData.status==='PAID' && <div className="bottom">
                              <span className={`totalAmount font-bold text-lg flex place-content-center pt-2 text-blue-400`}>AMOUNT PAID :₹{payData.amount}</span>
                    </div> }   
          </div>
          </div>

 


          </div>}

      <div className="footer text-white flex p-2 justify-between">

               {payData.status==='PAID' && <div className="downloadContainer">
    <div className="downloadPdf btn" onClick={()=>{downloadHandler(payData.link_id)}}>Download as Pdf</div>
   </div>}
             <Link to='/home' className="goback btn">GO HOME</Link>
          </div>
  </div>)
}

function FailedPage(){
  return(
    <div className="payment">
      Payment Failed
    </div>
  )
}
