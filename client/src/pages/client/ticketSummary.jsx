// import axios from 'axios'

// import { Link, useLocation, useParams, useNavigate,useLocation } from 'react-router-dom'
// import { useState, useEffect, useContext } from 'react'


// import { authContext } from '../../contexts/authContext.jsx'
// import Loader from '../../components/loader.jsx'

// function TicketSelection () {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { user, setUser,createLink } = useContext(authContext)

//   const { entityType, _id, type } = useParams()

//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchEntityDetails()
//   }, [])

//   useEffect(() => {
//     setLoading(true)
//     setSelected(pre => ({ ...pre, slot: null, placeId: null, showId: null }))
//     fetchShowTimes()
//   }, [selected.date])


//   return (
//     <div className='backgroundDiv'>
//       <div className='container text-white flex justify-center'>
//           {entit<TrainSummary state={location.state}/>}
//       </div>
//     </div>
//   )
// }

