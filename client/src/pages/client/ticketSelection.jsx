import axios from 'axios'

import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { IoLocationSharp } from 'react-icons/io5'

import { authContext } from '../../contexts/authContext.jsx'
import Loader from '../../components/loader.jsx'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

function TicketSelection () {
  const navigate = useNavigate()
  const { user, setUser } = useContext(authContext)

  const { entityType, _id, type } = useParams()

  let dates = getDates()
  const [data, setData] = useState({ entity: null, shows: null, place: null }) //place can be stadium,theater
  const [selected, setSelected] = useState({
    date: dates[0],
    slot: null,
    placeId: null,
    showId: null
  })

  console.log(dates[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntityDetails()
  }, [])

  useEffect(() => {
    setLoading(true)
    setSelected(pre => ({ ...pre, slot: null, placeId: null, showId: null }))
    fetchShowTimes()
  }, [selected.date])

  async function fetchEntityDetails () {

    const response = await axios.get(
      `${BASE_URL}/${entityType}/find?${entityType}Id=${_id}&fields=title,duration`
    )
    setData(pre => ({ ...pre, entity: response.data[0] }))
  }

  async function fetchShowTimes () {
    await axios
      .get(`${BASE_URL}/${entityType}Show/find?${entityType}Id=${_id}&date=${selected.date}`)
        .then(res => {
        setData(pre => ({ ...pre, shows: res.data }))
        console.log(res.data)

        let Data = {}
        let Ids = []

        res.data.forEach(showData => {
          console.log(showData)
          let id = showData[`${type}`]
          console.log(id)
          if (Data[id]) {
            Data[id].slots.push({
              slot: showData.slot,
              showId: showData._id
            })
          } else {
            Ids.push(id)
            Data[id] = {
              slots: [{ slot: showData.slot, showId: showData._id }]
            }
          }
        })

        let showsDetails = Ids.map(Id => {
          axios
            .get(`${BASE_URL}/${type}/find?${type}Id=${Id}&fields=name,location`)
            .then(res => {
              Data[Id].name = res.data[0].name
              Data[Id].location = res.data[0].location
            })
        })

        Promise.all(showsDetails).then(() => {
          setData(pre => ({ ...pre, place: Data }))
          setTimeout(() => setLoading(false), 500)
        })
      })
  }

  console.log(data.place)

  return (
    <div className='backgroundDiv min-h-screen'>
      <div className='container text-white '>
        {loading?<Loader/> : (
          <div className='container px-4'>
            <div className='movieInfoTop flex justify-between items-center py-2'>
              <div className='movieInfo flex flex-col text-white'>
                <span className='title p-2 font-extrabold text-3xl'>
                  {data.entity.title}
                </span>
                <span className='duration p-2 font-medium text-md'>
                  {data.entity.duration}
                </span>
              </div>
              <Link to={`/${entityType}/${_id}`}>
                <div className='cancelIcon p-2 text-xl font-bold text-white border-2 border-white rounded-xl'>
                  Back
                </div>
              </Link>
            </div>

            <div className='dateContainer pt-4'>
              <div className='dates flex gap-4 py-4'>
                {dates.map((date, idx) => {
                  const d = new Date(date.split('T')[0]).toString().split(' ')
                  return (
                    <div
                      key={idx}
                      className={`dateContainer rounded-xl font-medium text-xl border-2 border-[#636363] hover:border-white p-2 px-4 flex flex-col justify-center items-center gap-2 cursor-pointer ${
                        selected.date == date ? 'bg-[#4242FA]' : ''
                      } ${
                        idx > 2
                          ? 'text-[#5c5c5f] pointer-events-none'
                          : 'text-white'
                      }`}
                      onClick={() => {
                        setSelected(prev => ({ ...prev, date: date }))
                      }}
                    >
                      <span className='dateMonth'>
                        {d[2]} {d[1]}
                      </span>
                      <span className='day'>{d[0]}</span>
                    </div>
                  )
                })}
              </div>
            </div>


              <div className='theaterContainer pt-4'>
                <span className='title text-xl font-bold my-2'>
                  {type === 'movie' ? 'Theater' : 'Stadium'}
                </span>
                <div className='theaters flex gap-4 py-2 flex-col'>
                  {Object.keys(data.place).map(theaterKey => {
                    return (
                      <div
                        key={theaterKey}
                        className={`theaterContainer rounded-xl text-white font-medium text-lg border-2 border-[#636363] flex justify-between items-center gap-3  cursor-pointer px-4`}
                      >
                        <span className='locationIcon flex justify-center items-center gap-1 text-white'>
                          <IoLocationSharp color='#ce0000' />
                          <span className='details flex flex-col gap-1'>
                            <span className='name text-md'>
                              {data.place[theaterKey].name}
                            </span>
                            <span className='location text-xs'>
                              {data.place[theaterKey].location}
                            </span>
                          </span>
                        </span>

                        <div className='startTimes flex gap-4 py-4'>
                          {data.place[theaterKey].slots.map((s, idx) => {
                            return (
                              <div
                                key={idx}
                                className={`timeContainer rounded-lg text-white font-medium text-lg border-1 border-[#636363] hover:border-white p-1 px-2 flex flex-col justify-center items-center gap-2 cursor-pointer 
                             ${
                               selected.slot == s.slot &&
                               selected.placeId == theaterKey
                                 ? 'bg-[#4242FA]'
                                 : ''
                             }`}
                                onClick={() => {
                                  setSelected(prev => ({
                                    ...prev,
                                    placeId: theaterKey,
                                    slot: s.slot,
                                    showId: s.showId
                                  }))
                                }}
                              >
                                <span className='time'>{s.slot}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            <div className='proceedContainer flex justify-center items-center pt-8 pb-10'>
              <Link
                to={`${
                  selected.slot
                    ? `/${entityType}/${_id}/${type}/${selected.showId}`
                    : ''
                }`}
              >
                <button
                  className={`proceed p-2 px-4 border-2 rounded-lg cursor-pointer  text-lg font-bold border-[#636363]  active:bg-[#EA454c] ${
                    selected.slot
                      ? 'text-white hover:border-white'
                      : 'text-[#5c5c5f] pointer-events-none'
                  } `}
                >
                  Proceed
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketSelection

const getDates = () => {
  let dates = []
  let date = new Date('2025-08-06')
  let count = 6
  for (let i = 1; i <= count; i++) {
    dates.push(date.toISOString())
    date.setDate(date.getDate() + 1)
  }
  return dates
}
