import axios from 'axios'
import { useState, useEffect, useContext, createContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../../App.css'

import Loader from '../../components/loader.jsx'
import { MoviesContainer } from '../../components/moviesContainer.jsx'
import { authContext } from '../../contexts/authContext.jsx'

export const dataContext = createContext()

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export function Home() {
  const { user } = useContext(authContext)
  const options = ['movies', 'trains', 'concerts']
  const [genres] = useState({
    movies: ['Recommended', 'Action', 'Sci-Fi', 'Horror', 'Thriller'],
    concerts: ['Recommended', 'Pop', 'Rock']
  })
  const [currentOption, setCurrentOption] = useState('movies')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setData(null)
    setLoading(true)

    const fetchData = async () => {
      try {
        if (currentOption === 'movies') {
          const res = await axios.get(`${BASE_URL}/movie/find?fields=_id,genre,poster,type`)
          setData(res.data)
        } else if (currentOption === 'concerts') {
          const res = await axios.get(`${BASE_URL}/concert/find?fields=_id,genre,poster,type`)
          setData(res.data)
        } else {
          const res = await axios.get(`${BASE_URL}/train/find`)
          setData(res.data)
        }
      } catch (err) {
        console.error(err)
        setData([])
      } finally {
        setTimeout(() => setLoading(false), 1000)
      }
    }

    fetchData()
  }, [currentOption])

  return (
    <div className='backgroundDiv min-h-screen'>
      <div className='container w-[90%] md:w-[85%] flex flex-col gap-4 rounded-xl mx-auto'>
        <div className='options flex justify-center items-center py-4'>
          <div className='optionsContainer flex justify-around items-center gap-3 rounded-2xl border-2 border-[#4242FA] py-2 px-4'>
            {options.map(option => (
              <span
                key={option}
                className={`rounded-2xl px-3 py-1 font-bold text-lg text-white cursor-pointer transition ${
                  currentOption === option ? 'bg-[#4242FA]' : 'bg-transparent'
                }`}
                onClick={() => setCurrentOption(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <div className='main w-full'>
          {(currentOption === 'movies' || currentOption === 'concerts') && (
            <div className='recommendedShows'>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <MoviesContainer data={data} all={true} genre={'All'} />
                  {genres[currentOption].map(genre => (
                    <MoviesContainer key={genre} data={data} genre={genre} />
                  ))}
                </>
              )}
            </div>
          )}

          {currentOption === 'trains' && (
            <TrainContent loading={loading} data={data} />
          )}
        </div>
      </div>
    </div>
  )
}

const TrainContent = ({ loading, data }) => {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [filterData, setFilterData] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])

  const stationsList = [
    'Chennai Central', 'Coimbatore Junction', 'Ernakulam Junction', 'Guntur Junction',
    'Hyderabad Deccan', 'Katpadi Junction', 'Kazipet Junction', 'Kollam', 'Madurai Junction',
    'Nagercoil Junction', 'Narasapur', 'Nizamabad', 'Rajahmundry', 'Renigunta Junction',
    'Secunderabad Junction', 'Tiruchirapalli Junction', 'Tirupati', 'Tiruppur', 'Vellore', 'Vijayawada Junction', 'Trivandrum Central', 'Hubballi Junction'
  ]

  const searchTrains = () => {
    if (!data) return
    if (!from || !to) return alert('Please select both From and To stations.')

    setSearchLoading(true)

    const day = new Date(date).toDateString().split(' ')[0]

    const filtered = data.filter(train => {
      const operates = train.daysOfOperation?.includes(day)
      return operates && isStationIncludes(train.stations ?? [])
    })

    setFilterData(filtered)
    setSearchLoading(false)
  }

  const isStationIncludes = stations => {
    let fromIdx = stations.findIndex(s => s.stationName === from)
    let toIdx = stations.findIndex(s => s.stationName === to)
    return fromIdx >= 0 && toIdx > fromIdx
  }

  const handleChange = e => {
    const { name, value } = e.target
    if (name === 'From') {
      setFrom(value)
      setFromSuggestions(stationsList.filter(s => s.toLowerCase().includes(value.toLowerCase())))
      setToSuggestions([])
    } else {
      setTo(value)
      setToSuggestions(stationsList.filter(s => s.toLowerCase().includes(value.toLowerCase())))
      setFromSuggestions([])
    }
  }

  if (loading || !data) return <Loader />

  return (
    <div className='trains flex flex-col items-center gap-4'>
      <div className='searchContainer w-full md:w-[60%] grid grid-cols-1 gap-4 border-2 border-white p-4 rounded-xl text-white'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex flex-col relative w-full'>
            <label>From :</label>
            <input
              type='text'
              value={from}
              name='From'
              onChange={handleChange}
              className='rounded-xl border-2 border-white px-2 py-1 w-full'
            />
            {fromSuggestions.length > 0 && (
              <ul className='absolute bg-white text-black border border-gray-400 rounded max-h-40 overflow-y-auto w-full z-10'>
                {fromSuggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className='p-2 hover:bg-gray-200 cursor-pointer'
                    onClick={() => { setFrom(item); setFromSuggestions([]) }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='flex flex-col relative w-full'>
            <label>To :</label>
            <input
              type='text'
              value={to}
              name='To'
              onChange={handleChange}
              className='rounded-xl border-2 border-white px-2 py-1 w-full'
            />
            {toSuggestions.length > 0 && (
              <ul className='absolute bg-white text-black border border-gray-400 rounded max-h-40 overflow-y-auto w-full z-10'>
                {toSuggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className='p-2 hover:bg-gray-200 cursor-pointer'
                    onClick={() => { setTo(item); setToSuggestions([]) }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-4 items-center'>
          <label>Select Date:</label>
          <input
            type='date'
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setDate(e.target.value)}
            className='rounded-md p-1 border-2 border-white'
          />
          <button
            onClick={searchTrains}
            className='px-4 py-2 border-2 border-white rounded-xl text-white hover:bg-[#4242FA] transition'
          >
            Search
          </button>
        </div>
      </div>

      {searchLoading ? <Loader /> : (
        <div className='trainsContainer flex flex-col gap-4 w-full md:w-[80%]'>
          {(filterData ?? data)?.length > 0 ? (
            (filterData ?? data).map((train, idx) => (
              <TrainElement key={idx} train={train} from={from || train?.stations?.[0]?.stationName} to={to || train?.stations?.[train?.stations?.length - 1]?.stationName} journeyDate={date} />
            ))
          ) : (
            <p className='text-gray-300 text-center'>No trains found for the selected route.</p>
          )}
        </div>
      )}
    </div>
  )
}

function TrainElement({ train, from, to, journeyDate }) {
  const fromStation = train.stations?.find(s => s.stationName === from)
  const toStation = train.stations?.find(s => s.stationName === to)

  if (!fromStation || !toStation) return null

  const getDuration = (arrival, departure) => {
    const arr = new Date(`1970-01-01T${arrival}:00`)
    const dep = new Date(`1970-01-01T${departure}:00`)
    const diff = (arr - dep) / 1000
    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    return `${hours}h ${minutes}min`
  }

  const duration = getDuration(toStation.arrivalTime, fromStation.departureTime)
  const distance = toStation.distance - fromStation.distance
  const getPrice = farePerKm => distance * farePerKm

  return (
    <div className='bg-[#97D0ED] text-black w-full p-2 border-2 border-white rounded-xl flex flex-col gap-2'>
      <div className='flex justify-between font-bold'>
        <div>{train.trainName}</div>
        <span className='text-gray-700'>#{train.trainNumber}</span>
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <span className='font-medium'>{from}</span>
          <span>{fromStation.departureTime}</span>
        </div>
        <div>{duration}</div>
        <div className='flex flex-col'>
          <span className='font-medium'>{to}</span>
          <span>{toStation.arrivalTime}</span>
        </div>
      </div>

      <div className='flex gap-4 flex-wrap'>
        {train.classes?.map((c, idx) => {
          const ticketPrice = parseInt(getPrice(c.farePerKm))
          return (
            <Link
              key={idx}
              to={`/train/${train._id}`}
              state={{
                from, to, journeyDate, duration, distance,
                ticketPrice, arrivalTime: toStation.arrivalTime,
                departureTime: fromStation.departureTime
              }}
              className='border-2 border-gray-700 hover:border-[#4242FA] rounded-xl p-2 flex flex-col gap-1 cursor-pointer'
            >
              <div className='flex justify-between font-bold'>{c.classType} <span>{ticketPrice}</span></div>
              <div className='text-green-600 font-medium'>Available {c.totalSeats}</div>
              <div className='text-sm'>Free Cancellation</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
