import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'

import { authContext } from '../../contexts/authContext.jsx'

   let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

function MovieInfo () {
  const { user, setUser } = useContext(authContext)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()

  const { entityType, _id } = useParams()
  const type = entityType === 'movie' ? 'theater' : 'stadium'

  useEffect(() => {
    if (entityType === 'movie') {
      axios
        .get(`${BASE_URL}/movie/find?movieId=${_id}`)
        .then(res => {
          console.log(res)
          setData(res.data[0])
          setLoading(false)
        })
        .catch(err => {})
    } else {
      axios
        .get(`${BASE_URL}/concert/find?concertId=${_id}`)
        .then(res => {
          console.log(res)
          setData(res.data[0])
          setLoading(false)
        })
        .catch(err => {})
    }
    // apiData.forEach((s)=>{
    //   if(s.title==id){
    //       setShow(s);
    //       setLoading(false);
    //   }
    // })
  }, [_id])

  return (
    <div className='backgroundDiv min-h-screen'>
      {!loading && (
        <div className='container flex flex-col px-4 '>
          <div className='movieInfoTop flex justify-between items-center py-8'>
            <div className='movieInfo flex flex-col px-2 text-white'>
              <span className='title p-2 font-extrabold text-3xl'>
                {data.title}
              </span>
              <span className='duration p-2 font-medium text-xl'>
                {data.duration}
              </span>
            </div>
            <Link to='/home'>
              <div className='cancelIcon p-4 text-4xl font-bold'>❌</div>
            </Link>
          </div>

        <div className="movieInfoMiddle flex items-stretch gap-2 md:gap-4">
        <div className="left flex justify-center items-center pl-2 md:pl-4">      
        <div className='imageContainer overflow-hidden rounded-xl h-[150px] w-[105px] md:h-[250px] md:w-[175px] lg:h-[300px] lg:w-[210px] border-[#636363]  border-2'>
          <img
            src={data.poster}
            draggable='false'
            className='transition duration-500 ease-in-out hover:scale-105'
          />
      </div>
        </div>
        {entityType==='movie' &&<div className="right md:p-4 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch list-none flex-col gap-1">
          <li className="genre pb-1"><strong>Genre : </strong>{data.genre.toString()}</li>
          <li className="plot pb-1"><strong>Plot :</strong>{data.plot}</li>
          <li className="languages pb-1"><strong>Languages : </strong>{data.language}</li>

          <li className="director pb-1"><strong>Directors : </strong>{data.director.toString()}</li>
          <li className="writer pb-1"><strong>Writers : </strong>{data.writer.toString()}</li>
          <li className="actors pb-1"><strong>Actors : </strong>{data.actors.toString()}</li>
          <li className="writer pb-1"><strong>OrganizedBy : </strong>{data.organizedBy}</li>
        </div>}

        {entityType==='concert' &&<div className="right md:p-4 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch list-none flex-col gap-1">
          <li className="genre pb-1"><strong>Genre : </strong>{data.genre.toString()}</li>
          <li className="plot pb-1"><strong>Plot :</strong>{data.plot}</li>
          <li className="languages pb-1"><strong>Languages : </strong>{data.language}</li>

          <li className="director pb-1"><strong>Artist : </strong>{data.artist}</li>
          <li className="writer pb-1"><strong>Age Restriction : </strong>{data.ageRestriction}</li>
           <li className="writer pb-1"><strong>OrganizedBy : </strong>{data.organizedBy}</li>
        </div>}

        </div>

          <div className='bookMyTickets py-10 text-white text-2xl font-medium p-2 flex items-center justify-center'>
            <Link to={`/${entityType}/${_id}/${type}`}>
              <button className='bookTickets border-white border-2 py-1 px-3 rounded-xl cursor-pointer'>
                Book My Ticket
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieInfo
