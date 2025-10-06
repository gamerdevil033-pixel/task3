import axios from 'axios'
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import { useState, useEffect, useContext, createContext } from 'react'
import { useNavigate, Link,useParams } from 'react-router-dom'
import '../../App.css'

import Loader from '../../components/loader.jsx'
import { authContext } from '../../contexts/authContext.jsx'

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const dataContext = createContext()

export function VendorEvents() {
  let { user, setUser } = useContext(authContext)
  let options = ['movies', 'concerts', 'trains']
  let [currentOption, setCurrentOption] = useState('movies')
  let [data, setData] = useState([])
  let [loading, setLoading] = useState(true);

  let {vendorId} = useParams()

  function fetchData() {
    setLoading(true)
    axios
      .get(`${BASE_URL}/${currentOption.slice(0, currentOption.length - 1)}/find?organizedBy=${vendorId}`)
      .then(res => {
        setData(res.data)
        console.log(res.data)
        setLoading(false)
      })
      .catch(err => { })
  }

  useEffect(() => {
    fetchData();
  }, [currentOption])

  return (
    <div className='backgroundDiv min-h-screen'>
      <div className='container w-[85%] flex flex-col gap-4'>
        <div className='options flex justify-center items-center'>
          <div className='optionsContainer border-1 shadow-md shadow-black flex justify-around items-center gap-3 rounded-2xl border-[#929090] py-2 px-4 m-auto'>
            {options.map(option => {
      return (
            <span
               key={option}
                  className={`rounded-2xl p-1 px-3 font-bold text-lg text-white cursor-pointer ${currentOption === option ? 'bg-[#4242FA]' : 'bg-transparent'
                    }`}
                  onClick={() => {
                    setLoading(true)
                    setCurrentOption(option)
                    // setSearch('')
                  }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>
              )
            })}
          </div>
        </div>

        {loading ? <Loader /> : (
          <div className='main w-full py-4 flex flex-col gap-4'>
            <header className='text-white flex justify-between items-center bg-emerald-500 py-2 px-3 rounded-md'>
              <span className="vendorId">VendorId : {vendorId}</span>
              <span className="noofmovies">Total {currentOption.charAt(0).toUpperCase() + currentOption.slice(1)} Organized: {data.length}</span>
            </header>

            {(currentOption === 'movies') && <div className="moviesList gap-4 flex flex-col">
              {data.map((movie, idx) => {
                return <MovieCards key={idx} show={movie}/>
              })}
            </div>}


            {(currentOption === 'concerts') && <div className="theatersList gap-4 flex flex-col">
              {data.map((theater, idx) => {
                return <ConcertCards key={idx} show={theater}/>
              })}
            </div>}


            {(currentOption === 'trains') && <div className="showsList gap-4 flex flex-col">
              {data.map((show, idx) => {
                return <TrainCards key={idx} show={show}/>
              })}
            </div>}

          </div>)}

      </div>
    </div>
  )
}

const MovieCards = ({show}) => {

  return (
    <div className="movieContainer border-2 border-[#eee] rounded-md">
      <div className="movieInfo flex items-stretch gap-2 md:gap-4">
        <div className="left flex justify-center items-center pl-2 md:pl-4">
          <div className='imageContainer overflow-hidden rounded-xl h-[150px] w-[105px] md:h-[250px] md:w-[175px] lg:h-[300px] lg:w-[210px] border-[#636363]  border-2'>
            <img
              src={show.poster}
              draggable='false'
              className='transition duration-500 ease-in-out hover:scale-105'
            />
          </div>
        </div>
        <div className="right md:p-4 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col">
          <div className="header flex justify-between items-center gap-3 pr-2 py-2">
            <span className="movieId text-[#757575]">MovieID : {show._id}</span>
          </div>
          <li className="title pb-1"><strong>Title :</strong>{show.title}</li>
          <li className="duration pb-1"><strong>Duration : </strong>{show.duration}</li>
          <li className="languages pb-1"><strong>Languages : </strong>{show.language}</li>
          <li className="genre pb-1"><strong>Genre : </strong>{show.genre}</li>
          <li className="plot pb-1"><strong>Plot :</strong>{show.plot}</li>
          <li className="director pb-1"><strong>Directors : </strong>{show.director}</li>
          <li className="writer pb-1"><strong>Writers : </strong>{show.writer}</li>
          <li className="actors pb-1"><strong>Actors : </strong>{show.actors}</li>
        </div>

        

      </div>

              <div className="footer py-2 flex items-center justify-center text-white">
          <Link to={`/admin/shows/movie/${show._id}`} className="viewAll btn">View Shows</Link>
        </div>
    </div>
  )
}

const ConcertCards = ({show}) =>{
    console.log(show)
    return(
      <div className="concertContainer border-2 border-[#eee] rounded-md">
        <div className="concertInfo flex items-stretch gap-2 md:gap-4">
        <div className="left flex justify-center items-center pl-2 md:pl-4">      
        <div className='imageContainer overflow-hidden rounded-xl h-[150px] w-[105px] md:h-[250px] md:w-[175px] lg:h-[300px] lg:w-[210px] border-[#636363]  border-2'>
          <img
            src={show.poster}
            draggable='false'
            className='transition duration-500 ease-in-out hover:scale-105'
          />

      </div>
        </div>
        <div className="right md:p-4 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col">
        <div className="header flex justify-between items-center gap-3 pr-2 py-2">
          <span className="movieId text-[#757575]">ConcertId : {show._id}</span>
        </div>
          <li className="title pb-1"><strong>Title :</strong>{show.title}</li>
          <li className="duration pb-1"><strong>Duration : </strong>{show.duration}</li>
          <li className="languages pb-1"><strong>Languages : </strong>{show.language}</li>
          <li className="genre pb-1"><strong>Genre : </strong>{show.genre}</li>
          <li className="plot pb-1"><strong>Plot :</strong>{show.plot}</li>
          <li className="artist pb-1"><strong>Artist : </strong>{show.artist}</li>
          <li className="ageRestriction pb-1"><strong>Age Restriction : </strong>{show.ageRestriction}</li>
        </div>

      
        </div>

            <div className="footer py-2 flex items-center justify-center text-white">
          <Link to={`/vendor/shows/concert/${show._id}`} className="viewAll btn">View Shows</Link>
        </div>
      </div>
    )
  }
  
const TrainCards = ({show}) =>{

  console.log(show)
    
    let totalDistance = 0;

  function getDuration () {

    console.log(show.stations)
    let length= show?.stations.length;
    let startTime = show.stations[0].departureTime;
    let endTime = show.stations[length-1].arrivalTime;
    totalDistance = show.stations[length-1].distance - show.stations[0].distance;

    let arrival = new Date(
      0,
      0,
      0,
      endTime.slice(0, 2),
      endTime.slice(3),0
    )
    let departure = new Date(
      0,
      0,
      0,
      startTime.slice(0, 2),
      startTime.slice(3),0
    )
    let duration = (arrival - departure) / 1000
    let hours = Math.floor(duration / (60 * 60))
    let minutes = (duration / 60) % 60
    return `${hours}h ${minutes}min`
  }
    return(
      <div className="trainContainer border-2 border-[#eee] rounded-md p-2 px-4">

        <div className="header flex justify-between items-center gap-3 py-2">
          <span className="movieId text-[#757575]">TrainID : {show._id}</span>
          <span className="options flex gap-3">
            <FiEdit2 className='font-semibold md:text-2xl text-emerald-500' onClick={()=>alert('edit')}></FiEdit2>
            <MdDeleteOutline className='text-red-600 font-semibold md:text-2xl ' onClick={()=>alert('delete')}></MdDeleteOutline>
          </span>
        </div>

        <div className="trainInfo flex items-center justify-between gap-2 md:gap-4">

        <div className="left md:p-4 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col">
          <li className="trainNumber pb-1"><strong>Train Number :</strong>{show.trainNumber}</li>
          <li className="title pb-1"><strong>Train Name :</strong>{show.trainName}</li>
          <li className="duration pb-1"><strong>Train Type : </strong>{show.trainType}</li>
          <li className="totalDuration pb-1"><strong>Total Duration : </strong>{getDuration()}</li>
          <li className="totalDistance pb-1"><strong>Total Distance : </strong>{totalDistance}Km</li>
          <li className="languages pb-1"><strong>Days of Operation : </strong>{show.daysOfOperation}</li>
        </div>

        <div className="right flex justify-center items-center pr-2 md:pr-4">      
              <svg viewBox='0 0 300 300' height='300' width='300' className='bg-amber-500'>
                  <rect x ='50' y='0' width='30' height='300' fill='cyan' stroke-width='2' stroke-style='white'/>
              </svg>
        </div>
        </div>
      </div>
    )
  }
