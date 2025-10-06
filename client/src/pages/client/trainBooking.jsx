import axios from 'axios'

import { useParams, useLocation, useNavigate,Navigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'

import Loader from '../../components/loader.jsx'
import { authContext } from '../../contexts/authContext.jsx'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const TrainBooking = () => {
  let { user, setUser, createLink } = useContext(authContext)
  let navigate = useNavigate();
  let {state} = useLocation();
  if(!state){
    return <Navigate to='/home'/>
  }

  let {journeyDate,distance,duration,trainNumber,from,to,departureTime,arrivalTime,ticketPrice} = state

  let defaultTraveller = {
    name: '',
    age: null,
    gender: 'male',
    berthPreference: 'noPreference'
  }

  let {trainId} =
    useParams()
  let [train, setTrain] = useState()
  let [loading, setLoading] = useState(true)
  let [addTravellerOverlay, setAddTravellerOverlay] = useState(false)
  let [travellers, setTravellers] = useState([])
  let [newTraveller, setNewTraveller] = useState({
    name: '',
    age: null,
    gender: 'male',
    berthPreference: 'noPreference'
  })
  let [isEditing, setIsEditing] = useState(false)
  let [editingIdx, setEditingIdx] = useState(null)

  console.log(travellers)

  useEffect(() => {
    axios
      .get(`${BASE_URL}/train/find?trainId=${trainId}`)
      .then(res => {
        setTrain(res.data[0])
        console.log(res.data)
        setTimeout(() => {
          setLoading(false)
        }, 100)
      })
      .catch(err => {})
  }, [])

  return (
    <div className='backgroundDiv min-h-screen'>
      {loading ? (
        <Loader />
      ) : (
        <div className='container'>
          <div className='header text-white flex flex-col gap-2'>
            <div className='trainDetails flex justify-between items-center'>
              <div className='trainName font-bold'>{train.trainName}</div>
              <span className='trainNumber text-[#757575]'>
                #{train.trainNumber}
              </span>
            </div>

            <div className='stations flex justify-between items-center'>
              <span className='fromDetails'>
                <div className='stationName font-medium'>{from}</div>
                {/* <div className="arrivalTime">{departureTime}</div> */}
              </span>

              <span className='duration'>{duration}</span>

              <span className='toDetails'>
                <div className='stationName font-medium'>{to}</div>
                {/* <div className="departureTime">{arrivalTime}</div> */}
              </span>
            </div>
          </div>

          {addTravellerOverlay && (
            <AddTravellerOverlay
              setTravellers={setTravellers}
              setAddTravellerOverlay={setAddTravellerOverlay}
              newTraveller={newTraveller}
              setNewTraveller={setNewTraveller}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              editingIdx={editingIdx}
            />
          )}

          <br />
          <hr className='text-white' />
          <br />

          <div className='travellers'>
            <div className='heading font-extrabold text-white'>
              Add Travellers & Preferences
            </div>
            <br />
            {travellers.length > 0 &&
              travellers.map((traveller, idx) => {
                return (
                  <div
                    className='travellerContainer text-white flex justify-between items-center my-2 py-2 border-1 px-4'
                    key={idx}
                  >
                    <div className='left'>
                      <div className='details'>
                        {traveller.name},{traveller.gender},{traveller.age}
                      </div>
                      <div className='preference'>
                        <div className='berth'>{traveller.berthPreference}</div>
                      </div>
                    </div>

                    <div className='right flex gap-4'>
                      <span
                        className='edit btn'
                        onClick={() => {
                          setEditingIdx(idx)
                          setIsEditing(true)
                          setNewTraveller(travellers[idx])
                          setAddTravellerOverlay(true)
                        }}
                      >
                        Edit
                      </span>
                      <span
                        className='remove btn'
                        onClick={() => {
                          let traveller = travellers.splice(idx, 1)
                          setNewTraveller(traveller)
                        }}
                      >
                        Remove
                      </span>
                    </div>
                  </div>
                )
              })}
            <div
              className='addTraveller font-semibold text-[#6363AF] border-1 border-gray-400 p-2 cursor-pointer'
              onClick={() => {
                setNewTraveller(defaultTraveller)
                setAddTravellerOverlay(true)
              }}
            >
              + ADD TRAVELLER
            </div>
          </div>

          <br />

          <div className='priceDetails flex gap-4 text-white justify-evenly'>
            <span className='noOftickets'>
              No of Tickets : {travellers.length}
            </span>
            <span className='totalPrice'>
              TotalPrice : {travellers.length * ticketPrice}
            </span>
          </div>

          <br />

          <span
            className={`proceed p-2 flex place-content-center px-4 border-2 rounded-lg cursor-pointer text-lg font-bold border-[#636363]  active:bg-[#EA454c] ${
              travellers.length > 0
                ? 'text-white hover:border-white'
                : 'text-[#5c5c5f] pointer-events-none'
            } `}
            onClick={() => {
              if (!user) {
                return navigate('/login')
              }
              let metaData = {from:from,to:to,duration:duration,distance:distance,departureTime:departureTime,arrivalTime:arrivalTime,trainNumber:train.trainNumber,journeyDate: journeyDate,trainName:train.trainName,travellers: travellers,}
              createLink({
                user:user,
                purpose: 'train',
                amount : travellers.length * ticketPrice, 
                metaData
              })
            }}
          >
            Proceed Payment
          </span>
        </div>
      )}
    </div>
  )
}

function AddTravellerOverlay ({
  setTravellers,
  setAddTravellerOverlay,
  newTraveller,
  setNewTraveller,
  isEditing,
  setIsEditing,
  editingIdx
}) {
  const handleChange = e => {
    let { name, value } = e.target
    setNewTraveller(prev => ({ ...prev, [name]: value }))
  }

  if (newTraveller.age == null) {
    newTraveller.age = 0
  }

  return (
    <div className='overlayBackground w-screen h-screen fixed top-50 left-50'>
      <div className='w-[70%] bg-[#63b1fa]'>
        <div className='header bg-[#979393] p-2'>ADD TRAVELLER INFORMATION</div>
        <div className='body p-4 flex flex-col gap-4'>
          <div className='inputContainer grid grid-cols-2 gap-4'>
            <>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='Enter Traveller Name'
                value={newTraveller.name}
                className='border-2 border-black focus:outline-none'
                onChange={handleChange}
              />
            </>

            <>
              <label htmlFor='age'>Age(in years)</label>
              <input
                type='number'
                min='5'
                max='100'
                name='age'
                id='age'
                placeholder='Enter Age'
                className='border-2 outline-none'
                value={newTraveller.age}
                onChange={handleChange}
              />
            </>

            <>
              <label htmlFor='gender'>Gender</label>
              <select
                name='gender'
                id='gender'
                className='border-2'
                value={newTraveller.gender}
                onChange={handleChange}
              >
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
            </>

            <>
              <label htmlFor='berthPreference'>Berth Preference</label>
              <select
                name='berthPreference'
                id='berthPreference'
                value={newTraveller.berthPreference}
                className='border-2'
                onChange={handleChange}
              >
                <option value='noPreference'>No Preference</option>
                <option value='window'>window</option>
                <option value='lower'>Lower</option>
                <option value='upper'>Upper</option>
              </select>
            </>
          </div>
        </div>

        <div className='footer p-2 flex justify-between'>
          <span
            className='cancel btn'
            onClick={() => {
              setAddTravellerOverlay(false)
            }}
          >
            CANCEL
          </span>
          <span
            className='add btn'
            onClick={() => {
              if (!isEditing) {
                setTravellers(prev => [...prev, newTraveller])
                setAddTravellerOverlay(false)
              } else {
                setTravellers(prev =>
                  prev.map((item, i) =>
                    i === editingIdx ? newTraveller : item
                  )
                )
                setAddTravellerOverlay(false)
                setIsEditing(false)
              }
            }}
          >
            {isEditing ? 'UPDATE' : 'ADD'}
          </span>
        </div>
      </div>
    </div>
  )
}
