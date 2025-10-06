import axios from 'axios'

import { useState, useEffect, useContext, useReducer, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import { SeatLayout } from '../../components/seatLayout.jsx'
import { authContext } from '../../contexts/authContext.jsx'
import Loader from '../../components/loader.jsx'
import '../../App.css'
import { useLocation } from 'react-router-dom'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL
// import { SocketContext } from './../../contexts/socketContext';


export function SeatSelection () {
  const navigate = useNavigate()
  const { user, setUser, createLink } = useContext(authContext);
  // const {connect,socket,disconnect} = useContext(SocketContext)
  const [confirmationOver, setConfirmationOver] = useState(false)
  const location = useLocation()

  const { entityType, _id, type, showId } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [unavailableSeats, setUnavailableSeats] = useState([])

  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState()
  const [theater, setTheater] = useState() //type,entityType
  const totalPrice = useRef(0)

    const colors = {
  'available': {color: 'transparent' },
  'booked': {color: '#D32F2F' },
  'selected': {color: '#388E3C' },
  'unavailable': {color: '#636363' }, 
  };

  let [maxSeatCount, setMaxSeatCount] = useState(0)


  
useEffect(() => {
  // connect();

  axios
    .get(`${BASE_URL}/${entityType}Show/find?showId=${showId}`)
    .then(res => {
      setShow(res.data[0]);
      setTheater(res.data[0][`${type}`])
      console.log(res.data[0]);

      const room = res.data[0].date + res.data[0].slot;
      // socket.emit('joinRoom', room);
      setLoading(false)
    });


  // socket.on('receiveMsg', (data) => {
  //   if (data.add) {
  //     setUnavailableSeats(prev => [...prev, data.add]);
  //   }
  //   if (data.remove) {
  //     setUnavailableSeats(prev => prev.filter(seatId => seatId !== data.remove));
  //   }
  // });


  return () => {
    // socket.off('receiveMsg');
    // disconnect();             
  };

}, []);



  const getTotalPrice = () => {
    let basePrice = show.basePrice
    let total = 0

    selectedSeats.forEach(seat => {
      let row = seat.charCodeAt(0) % 65
      let col = parseInt(seat.slice(1)) - 1
      let value = theater.layout.seatsLayout.seats[row][col].value
      total += basePrice * value
    })

    totalPrice.current = total

    return total
  }

  return (
    <div className={`backgroundDiv text-white`}>
      {loading ? (
        <Loader />
      ) : (
        <div className='seatOverlay flex flex-col px-4'>
          {!confirmationOver && (
            <Confirmation
              setMaxSeatCount={setMaxSeatCount}
              setConfirmationOver={setConfirmationOver}
            />
          )}
          <div className='header flex items-center py-4 justify-between'>
            <span className='title text-2xl font-bold'>Seat Selection</span>
            <span className="seatsAvailable">Seats Available : {show.ticketsAvailable }</span>
          </div>

          <ul className="setTypes flex justify-around">
            <li className='flex gap-2'>Available : <div className='size-6 bg-transparent border-1 border-b-gray-500'></div></li>
            <li className='flex gap-2'>Booked : <div className='size-6 border-1 border-b-gray-500 bg-[#D32F2F]'></div></li>
            <li className='flex gap-2'>Selected : <div className='size-6 border-1 border-b-gray-500 bg-[#388E3C]'></div></li>
             <li className='flex gap-2'>Unavailable : <div className='size-6 border-1 border-b-gray-500 bg-[#636363]'></div></li>
          </ul>

          <div className='seatsGrid py-2 flex justify-center items-center'>
            <SeatLayout
              seats={theater.layout.seatsLayout.seats}
              ticketsBooked={show.ticketsBooked}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              unavailableSeats={unavailableSeats}
              maxSeatCount={maxSeatCount}
              setMaxSeatCount={setMaxSeatCount}
              // socket={socket}
              show={show}
            />
          </div>

          <div className='foooter flex flex-col gap-4 py-2'>
            <div className='priceSelected flex justify-between px-25'>
              <span className='totalPrice flex py-4 justify-center'>
                <span className='title'>Total Price : {getTotalPrice()}</span>
              </span>

              <span className='seatsSelected flex py-4 justify-center'>
                <span className='title'>
                  Seats selected : {selectedSeats.toString()}
                </span>
              </span>
            </div>

            <div className='proceedback px-16 py-2 flex justify-between items-center gap-4 cursor-pointer'>
              <Link to={`/${entityType}/${_id}/${type}`}>
                <span className='back rounded-xl border-2 border-white py-2 px-4'>
                  <span className='title'>Back</span>
                </span>
              </Link>

              <span
                className={`proceed p-2 px-4 border-2 rounded-lg cursor-pointer  text-lg font-bold border-[#636363]  active:bg-[#EA454c] ${
                  selectedSeats.length == maxSeatCount
                    ? 'text-white hover:border-white'
                    : 'text-[#5c5c5f] pointer-events-none'
                } `}
                onClick={() => {
                  if (!user) {
                    return navigate('/login', {
                      state: { from: location.pathname }
                    })
                  }
                  let metaData = {
                    showId : show._id,
                    [`${entityType}`]: show[`${entityType}`].title,
                    [`${type}`]: show[type].name,
                    slot : show.slot,
                    date : show.date,
                    seatsBooked:selectedSeats,
                  }

                  console.log(metaData)


                  let body = {purpose:entityType,user:user._id,vendor:show[`${entityType}`].organizedBy,amount:totalPrice.current,metaData};

                  createLink(body)
                }}
              >
                Proceed Payment
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



const Confirmation = ({ setMaxSeatCount, setConfirmationOver }) => {
  let max = 4
  let [count, setCount] = useState(0)

  return (
    <div className='background w-screen h-screen fixed z-4 overflow-hidden flex justify-center items-center left-0'>
      <div className='w-[30%] h-[40%] rounded-xl border-2 border-[#97D0ED] p-1 md:p-2 xl:p-3 flex flex-col justify-between gap-1 items-center bg-black'>
        <h1 className='mainTitle align-center text-2xl font-bold'>
          Select no of seats
        </h1>
        <h2 className='subtitle text-lg font-medium'>seats</h2>
        <div className='seatsSelectionContainer w-full flex gap-1 flex-wrap justify-around'>
          {Array(max)
            .fill(null)
            .map((val, idx) => {
              return (
                <span
                  key={idx}
                  className={`h-10 w-10 rounded-xl border-1 border-[#636363] cursor-pointer hover:border-white transition duration-200 flex items-center justify-center ${
                    idx + 1 == count ? 'bg-[#4242FA]' : ''
                  }`}
                  onClick={() => {
                    setCount(idx + 1)
                  }}
                >
                  <span className='pointer-events-none'>{idx + 1}</span>
                </span>
              )
            })}
        </div>
        <button
          className={`btn confirm font-medium text-white text-sm md:text-md xl:text-xl ${count<1?'cursor-not-allowed':'cursor-pointer'}`}
          onClick={() => {
            if(count>0){
            setMaxSeatCount(count)
            setConfirmationOver(true)
            }
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

//after selection seats added to my bookings in userContext and status is pending after the transaction status confirmeda

//getlinkStatus after successfullpayment seatsBooked = seatsBooked + selected;
