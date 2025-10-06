
import axios from 'axios'

import { useState, useEffect, useContext, useReducer, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import { authContext } from '../../contexts/authContext.jsx'
import Loader from '../../components/loader.jsx'
import '../../App.css'
import { useLocation } from 'react-router-dom'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL


export function ShowsInfo(){
  const navigate = useNavigate()
  const { user, setUser, createLink } = useContext(authContext);
  const {state} = useLocation();

  const {entityType,showId} = useParams()


  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState()
  const [theater, setTheater] = useState()
  const [details,setDetails] = useState({})

    const colors = {
  'available': {color: 'transparent' },
  'booked': {color: '#D32F2F' },
  'selected': {color: '#388E3C' },
  'unavailable': {color: '#636363' }, 
  };


  useEffect(() => {
    axios
      .get(`${BASE_URL}/${entityType}Show/find?showId=${showId}`)
      .then(res => {
        console.log(res.data[0])
        setShow(res.data[0]);

        let type;

        if(entityType==='movie'){
          type = 'theater'
        } else{
          type = 'stadium'
        }

        let placeId = res.data[0][`${type}`]
        axios
          .get(`${BASE_URL}/${type}/find?${type}Id=${placeId}`)
          .then(r => {
            console.log(r.data[0])
            setTheater(r.data[0])
            setTimeout(() => setLoading(false), 500)
          })
      })

  }, [])


  return (
    <div className={`backgroundDiv text-white`}>
      {loading ? (
        <Loader />
      ) : (
        <div className='seatOverlay flex flex-col px-4'>
          <div className='header flex items-center py-4 justify-between'>
            <span className="seatsAvailable">Seats Available : {show.ticketsAvailable }</span>

            <div className='proceedback px-16 py-2 flex justify-between items-center gap-4 cursor-pointer'>
              <Link to={state.from}>
                <span className='back rounded-xl border-2 border-white py-2 px-4'>
                  <span className='title'>Back</span>
                </span>
              </Link>
            </div>
          </div>

          <ul className="setTypes flex justify-around">
            <li className='flex gap-2'>Available : <div className='size-6 bg-transparent border-1 border-b-gray-500'></div></li>
            <li className='flex gap-2'>Booked : <div className='size-6 border-1 border-b-gray-500 bg-[#D32F2F]'></div></li>
            <li className='flex gap-2'>Selected : <div className='size-6 border-1 border-b-gray-500 bg-[#388E3C]'></div></li>
             <li className='flex gap-2'>Unavailable : <div className='size-6 border-1 border-b-gray-500 bg-[#636363]'></div></li>
          </ul>

          <div className='seatsGrid py-2 flex justify-center items-center'>
            <SeatLayout
              seats={theater.layout?.seatsLayout.seats}
              ticketsBooked={show.ticketsBooked}
              show={show}
              setDetails={setDetails}
            />


          </div>

           
          {details && 
            <div className="details text-white">
               <span className="username">{details.username}</span>
               <span className="email">{details.email}</span>
               <span className="amountPaid">{details.email}</span>
            </div>}

        </div>
      )}
    </div>
  )
}


export const SeatLayout = (props) => {
  const { seats,ticketsBooked,show,setDetails} = props;

  const seatSizes = {
    height: 30,
    width: 30,
    gap: 10,
  };

  const colors = {
  'available': {color: 'transparent' },
  'booked': {color: '#D32F2F' },
  'selected': {color: '#388E3C' },
  'unavailable': {color: '#636363' }
  };

    function isSeatBooked(seatId){
   return ticketsBooked.some((entity) => {return entity.seatsBooked.includes(seatId)})
  }

  function getDetails(seatId){
    console.log(seatId)
let details = ticketsBooked.find((entity) => {return entity.seatsBooked.includes(seatId)})
  setDetails(details)
  console.log(details)
  }


  return (
    <svg className="w-[800px] overflow-x-scroll overflow-y-scroll border-2 border-[#636363] p-2" viewBox={`0 0 ${820} ${500}`}>
      {seats.map((arr1, i) =>
        arr1.map((seat, j) => {
          let x;
          if(j>9){
          x = seatSizes.gap * (j) + seatSizes.width * j + 3*seatSizes.gap;
          }else{
          x = seatSizes.gap * (j) + seatSizes.width * j;
          }
         const y = seatSizes.gap * (i) + seatSizes.height * i;

          let seatColor;
          if(isSeatBooked(seat.id)){
            seatColor = colors['booked'].color;
          } else{ seatColor = colors['available'].color}

          return (
            <svg key={`seat-${i}-${j}`} transform={`translate(${x}, ${y})`}>
              <rect
                width={seatSizes.width}
                height={seatSizes.height}
                fill={seatColor}
                stroke="gray"
                strokeWidth="2"
                rx="5"
                ry="5"
                className="cursor-pointer hover:border-white border-2 border-[#636363] transition duration-200"
                onClick={()=>{
                  if(isSeatBooked(seat.id)){
                  getDetails(seat.id)
                  }
                }} 
              />
              <text
                x={seatSizes.width / 2}
                y={seatSizes.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="white"
                pointerEvents="none"
                className='select-none'
              >
                {seat.id}
              </text>
            </svg>
          );}))}
    
     <svg transform={`translate(${205}, ${460})`}>
             <rect
                width='410'
                height='40'
                fill='white'
                stroke="gray"
                strokeWidth="2"
                rx="5"
                ry="5"
                className="cursor-pointer"
              />
              <text
                x={410/2}
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fill="black"
                pointerEvents="none"
                className='select-none'
              >Screen</text>
      </svg>
    </svg>
  );
};


