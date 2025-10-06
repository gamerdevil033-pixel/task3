import axios from 'axios'
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import { useState, useEffect, useContext, createContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../../App.css'

import Loader from '../../components/loader.jsx'
import { authContext } from '../../contexts/authContext.jsx'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const dataContext = createContext()

export function VendorHome() {
  let { user, setUser } = useContext(authContext)
  let options = ['movies', 'concerts', 'trains']
  let [currentOption, setCurrentOption] = useState('movies')
  let [data, setData] = useState([])
  let [loading, setLoading] = useState(true);
  let [isEditing, setIsEditing] = useState(false);
  let [newEntity, setNewEntity] = useState({});
  let [isOverlay, setIsOverlay] = useState(false);
  let [editingIdx, setEditingIdx] = useState(null);

  let def={movies : {
    title: '',
    duration: '',
    language: '',
    genre: '',
    plot: '',
    writers: '',
    directors: '',
    actors: '',
    organizedBy:user._id
  },
concerts : {
      title : '',
      duration : '',
      language : '',
      genre : '',
      plot : '',
      artist : '',
      ageRestriction : '',
      organizedBy:user._id
    },trains : {
    date: '', slot: '', movieid: '', theaterId: '', ticketsAvailable: '', ticketsBooked: ''
  }}

  function deleteEntity(id) {
    console.log(id)
    axios
      .delete(`${BASE_URL}/${currentOption.slice(0, currentOption.length - 1)}/delete?id=${id}`)
      .then(res => {
        console.log(res.data);
        fetchData();
      })
      .catch(err => { console.log('fdasdf', err) })
    console.log(id)
  }

  function fetchData() {
    setLoading(true)
    axios
      .get(`${BASE_URL}/${currentOption.slice(0, currentOption.length - 1)}/find?organizedBy=${user._id}`)
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
      {isOverlay && <AddOverlay fetchData={fetchData} setData={setData} currentOption={currentOption} newEntity={newEntity} setNewEntity={setNewEntity} isEditing={isEditing} setIsEditing={setIsEditing} isOverlay={isOverlay} setIsOverlay={setIsOverlay} editingIdx={editingIdx} />}
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
              <span className="noofmovies">Total {currentOption.charAt(0).toUpperCase() + currentOption.slice(1)} Organized: {data.length}</span>
              <span className={`add btn ${currentOption==='trains'?'cursor-not-allowed':''}`} onClick={() => { setIsOverlay(true); setNewEntity(def[currentOption]); setIsEditing(false) }}>Add {currentOption.charAt(0).toUpperCase() + currentOption.slice(1)}</span>
            </header>

            {(currentOption === 'movies') && <div className="moviesList gap-4 flex flex-col">
              {data.map((movie, idx) => {
                return <MovieCards key={idx} idx={idx} show={movie} deleteEntity={deleteEntity} setIsEditing={setIsEditing} setNewEntity={setNewEntity} setEditingIdx={setEditingIdx} setIsOverlay={setIsOverlay} />
              })}
            </div>}


            {(currentOption === 'concerts') && <div className="theatersList gap-4 flex flex-col">
              {data.map((theater, idx) => {
                return <ConcertCards key={idx} show={theater} idx={idx} deleteEntity={deleteEntity} setIsEditing={setIsEditing} setNewEntity={setNewEntity} setEditingIdx={setEditingIdx} setIsOverlay={setIsOverlay} />
              })}
            </div>}


            {(currentOption === 'trains') && <div className="showsList gap-4 flex flex-col">
              {data.map((show, idx) => {
                return <TrainCards key={idx} show={show} idx={idx} deleteEntity={deleteEntity} setIsEditing={setIsEditing} setNewEntity={setNewEntity} setEditingIdx={setEditingIdx} setIsOverlay={setIsOverlay} />
              })}
            </div>}

          </div>)}

      </div>
    </div>
  )
}

const MovieCards = ({ show, deleteEntity, setIsEditing, setNewEntity, setEditingIdx, setIsOverlay, idx }) => {

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
            <span className="options flex gap-3">
              <FiEdit2 className='font-semibold md:text-2xl text-emerald-500' onClick={() => {
                setNewEntity(show); setIsOverlay(true);
                setIsEditing(true); setEditingIdx(idx);
              }}></FiEdit2>
              <MdDeleteOutline className='text-red-600 font-semibold md:text-2xl ' onClick={() => { deleteEntity(show._id); alert('delete') }}></MdDeleteOutline>
            </span>
          </div>
          <li className="title pb-1"><strong>Title :</strong>{show.title}</li>
          <li className="duration pb-1"><strong>Duration : </strong>{show.duration}</li>
          <li className="languages pb-1"><strong>Languages : </strong>{show.language}</li>
          <li className="genre pb-1"><strong>Genre : </strong>{show.genre.toString()}</li>
          <li className="plot pb-1"><strong>Plot :</strong>{show.plot}</li>
          <li className="director pb-1"><strong>Directors : </strong>{show.director.toString()}</li>
          <li className="writer pb-1"><strong>Writers : </strong>{show.writer.toString()}</li>
          <li className="actors pb-1"><strong>Actors : </strong>{show.actors.toString()}</li>
        </div>

        

      </div>

              <div className="footer py-2 flex items-center justify-center text-white">
          <Link to={`/vendor/shows/movie/${show._id}`} className="viewAll btn">View Shows</Link>
        </div>
    </div>
  )
}

const ConcertCards = ({show,deleteEntity,setIsEditing,setNewEntity,setEditingIdx,setIsOverlay,idx}) =>{
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
          <span className="options flex gap-3">
            <FiEdit2 className='font-semibold md:text-2xl text-emerald-500'onClick={()=>{setNewEntity(show);setIsOverlay(true);
              setIsEditing(true);setEditingIdx(idx);}}></FiEdit2>
            <MdDeleteOutline className='text-red-600 font-semibold md:text-2xl ' onClick={()=>{deleteEntity(show._id);alert('delete')}}></MdDeleteOutline>
          </span>
        </div>
          <li className="title pb-1"><strong>Title :</strong>{show.title}</li>
          <li className="duration pb-1"><strong>Duration : </strong>{show.duration}</li>
          <li className="languages pb-1"><strong>Languages : </strong>{show.language}</li>
          <li className="genre pb-1"><strong>Genre : </strong>{show.genre.toString()}</li>
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


function AddOverlay({ fetchData, currentOption, data, setData, newEntity, setNewEntity, isEditing, setIsEditing, isOverlay, setIsOverlay }) {

  let inputOptions = {
    'movies': ['title', 'duration', 'language', 'genre', 'directors', 'writers', 'actors', 'plot'],
    'concerts':['title','duration','language','genre','artist','ageRestriction','plot']
  }

  const handleChange = e => {
    let { name, value } = e.target
    setNewEntity(prev => ({ ...prev, [name]: value }))
  }

  const submitHandler = () => {
    let co = currentOption.slice(0, currentOption.length - 1);
    if (isEditing) {
      axios
        .patch(`http://localhost:5000/${co}/update?id=${newEntity._id}`, newEntity)
        .then(res => {
          console.log(res.data);
          fetchData();
        })
        .catch(err => { })
    } else {
      axios
        .post(`http://localhost:5000/${co}/add`, newEntity)
        .then(res => {
          console.log(res.data);
          fetchData();
        })
        .catch(err => { })
    }

  }


  console.log(newEntity)

  console.log(isEditing)
  return (
    <div className='overlayBackground w-screen h-screen fixed bg-[rbga(0,0,0,0.3)] flex items-center justify-center'>
           <div className='w-[70%] bg-[#63b1fa] '>
        <div className='header bg-[#666666] p-2'>{isEditing ? 'Edit' : 'Add'} {currentOption.charAt(0).toUpperCase() + currentOption.slice(1)}</div>
        <div className='body p-4 flex flex-col gap-4 px-8'>
          <div className='inputContainer grid grid-cols-1 gap-4 items-start'>
            {inputOptions[currentOption].map((input, idx) => {
              return (
                <div className="inputContainer grid grid-cols-4" key={idx}>
                  <label htmlFor={input}>{input}</label>
                  <input
                    type='text'
                    name={input}
                    id={input}
                    placeholder={`Enter ${input}`}
                    value={newEntity[input]}
                    className='border-2 px-2 border-black focus:outline-none col-span-3'
                    onChange={handleChange}
                  />
                </div>
              )
            })}


            {/* <>
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
            </> */}
          </div>
        </div>

        <div className='footer p-2 flex justify-between'>
          <span
            className='cancel btn'
            onClick={() => {
              setIsOverlay(false)
            }}
          >
            CANCEL
          </span>
          <span
            className='add btn'
            onClick={() => {
              submitHandler();
              if (!isEditing) {
                setIsOverlay(false)
              } else {
                setIsOverlay(false)
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






