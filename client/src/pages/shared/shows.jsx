  import axios from 'axios'
  import { FiEdit2 } from "react-icons/fi";
  import { MdDeleteOutline } from "react-icons/md";
  
  import { useState, useEffect, useContext, createContext } from 'react'
  import { useNavigate, Link ,useParams,useLocation} from 'react-router-dom'
  import '../../App.css'
  
  import Loader from '../../components/loader.jsx'
  import { authContext } from '../../contexts/authContext.jsx'

  export const dataContext = createContext()

    let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL
  
  export function Shows () {
    let { user, setUser } = useContext(authContext)
    let location = useLocation()
    let [data, setData] = useState([])
    let [loading, setLoading] = useState(true);
    let [isEditing,setIsEditing] = useState(false);
    let [newEntity,setNewEntity] = useState({});
    let [isOverlay,setIsOverlay] = useState(false);
    let [editingIdx,setEditingIdx] = useState(null);

    const {entityType,entityId} = useParams()

    let def={
    movieShows : {
      date:'',slot:'',movieId:entityId,theaterId:'',basePrice:100,availableSeats:200
    },concertShows : {
      date:'',slot:'',concertId:entityId,stadiumId:'',basePrice:100,availableSeats:200
    }}

    function deleteEntity(id){
      console.log(id)
      axios
          .delete(`${BASE_URL}/${entityType}Show/delete?id=${id}`)
          .then(res => {
            console.log(res.data);
            fetchData();
          })
          .catch(err => {console.log('fdasdf',err)})
          console.log(id)
    }

    function fetchData(){
        setLoading(true)
        console.log(`${BASE_URL}/${entityType}Show/find?${entityType}Id=${entityId}`)
       axios
          .get(`${BASE_URL}/${entityType}Show/find?${entityType}Id=${entityId}`)
          .then(res => {
            setData(res.data.reverse())
            console.log(res.data)
            setLoading(false)
          })
          .catch(err => {})
    }
  
    useEffect(() => { 
      fetchData();
        }, [])
  
    return (
      <div className='backgroundDiv min-h-screen'>
        <div className='container w-[85%] flex flex-col gap-4'>
          {isOverlay && <AddOverlay fetchData={fetchData} setData={setData} newEntity={newEntity} setNewEntity= {setNewEntity} isEditing={isEditing} entity={entityType} setIsEditing={setIsEditing} isOverlay={isOverlay} setIsOverlay={setIsOverlay} editingIdx={editingIdx}/>}
  
            {loading ? <Loader/>:(
          <div className='main w-full py-4 flex flex-col gap-4'>
            <header className='text-white flex justify-between items-center bg-emerald-500 py-2 px-3 rounded-md'>
              <span className="noofmovies">Total {[`${entityType}Shows`]} : {data.length}</span>
              <span className="add btn" onClick={()=>{setIsOverlay(true);setNewEntity(def[`${entityType}Shows`]);setIsEditing(false)}}>Add {`${entityType}Shows`}</span>
            </header>

           {<div className="showsList gap-2 md:gap-4 grid sm:grid-cols-2 xl:grid-cols-3">
           {data.map((show,idx)=>{
            return <ShowCards key={idx} show={show} idx={idx} deleteEntity={deleteEntity} setIsEditing={setIsEditing} setNewEntity={setNewEntity} setEditingIdx={setEditingIdx} setIsOverlay={setIsOverlay} location={location}/>
           })}
           </div>}

          </div>)}

        </div>
      </div>
    )
  }


  const ShowCards = ({show,deleteEntity,setIsEditing,setNewEntity,setEditingIdx,setIsOverlay,idx,location}) =>{
    let entityId;
    let placeId;
    let entity;

   if(show?.movie){
     entityId = show?.movie;
     placeId = show?.theater;
     entity= 'movie'
   } else{
         entityId = show?.concert;
     placeId = show?.stadium;
     entity= 'concert'
   }

    return(
      <div className="trainContainer border-2 border-[#eee] rounded-md p-2 px-4">

         <div className="trainInfo flex items-center justify-between gap-2 md:gap-4">
          <div className="movieInfo flex flex-col items-stretch gap-2 md:gap-4">

          <div className="header flex justify-between items-center gap-3 pt-1">
          <span className="movieId text-[#757575]">showID : {show._id}</span>
          <span className="options flex self-end gap-3">
            <FiEdit2 className='font-semibold md:text-2xl text-emerald-500' onClick={()=>{setNewEntity(show);setIsOverlay(true);
              setIsEditing(true);setEditingIdx(idx);alert('edit')}}></FiEdit2>
            <MdDeleteOutline className='text-red-600 font-semibold md:text-2xl ' onClick={()=>{deleteEntity(show._id);alert('delete')}}></MdDeleteOutline>
          </span>
        </div>

        <div className="right md:p-1 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col list-none">
          <li className="duration pb-1"><strong>Date : </strong>{show.date.split('T')[0]}</li>
          <li className="languages pb-1"><strong>Slot : </strong>{show.slot}</li>
          <li className="trainNumber pb-1"><strong>MovieId :</strong>{entityId.title}</li>
          <li className="title pb-1"><strong>TheaterId :</strong>{placeId.name}</li>
          <li className="totalDuration pb-1"><strong>TicketsAvailable : </strong>{show.ticketsAvailable}</li>
        </div>

        <div className="footer py-1 flex items-center justify-center text-white">
          <Link to={`/vendor/show/${entity}/${show._id}`}  state={{from:location.pathname}} className="viewAll btn">View Layout</Link>
        </div>

        </div>
        </div>

      </div>
    )
  }

  function AddOverlay ({entity,fetchData,data,setData,newEntity,setNewEntity,isEditing,setIsEditing,isOverlay,setIsOverlay}) {
 let place = entity=='movie'?'theaterId':'stadiumId';
    let date = new Date().toISOString().split('T')[0];


  const handleChange = e => {
    let { name, value } = e.target
    setNewEntity(prev => ({ ...prev, [name]: value }))
  }

  const submitHandler = ()=>{
    if(isEditing){
    axios
          .patch(`http://localhost:5000/${entity}Show/update?id=${newEntity._id}`,newEntity)
          .then(res => {
            console.log(res.data);
            fetchData();
          })
          .catch(err => {})
    } else{
      console.log('edit')
      axios
          .post(`http://localhost:5000/${entity}Show/add`,newEntity)
          .then(res => {
            console.log(res.data);
            fetchData();
          })
          .catch(err => {})
    }

  }

  return (
    <div className='overlayBackground w-screen h-screen fixed bg-[rbga(0,0,0,0.3)] flex items-center justify-center'>
           <div className='w-[70%] bg-[#63b1fa]'>
        <div className='header bg-neutral-400 p-2'>ADD Show</div>
        <div className='body p-4 flex flex-col gap-4 px-8'>
          <div className='inputContainer grid grid-cols-1 gap-4 items-start'>
   
              <div className="inputContainer grid grid-cols-4 text-md gap-3">
              <label htmlFor='date' className='text-md'>Date</label>
              <input
                type='date'
                name='date'
                id='date'
                min={date}
                placeholder={`Enter date`}
                value={newEntity.date}
                className='border-2 px-2 border-black focus:outline-none col-span-3'
                onChange={handleChange}
              />

              <label htmlFor='slot'>slot</label>
              <input
                type='time'
                name='slot'
                id='slot'
                placeholder={`Enter slot`}
                value={newEntity.slot}
                className='border-2 px-2 border-black focus:outline-none col-span-3'
                onChange={handleChange}
              />

              <label htmlFor={`${entity}Id`}>${entity}Id</label>
              <input
                type='text'
                name={`${entity}Id`}
                id={`${entity}Id`}
                placeholder={`Enter ${entity}`}
                value={newEntity[`${entity}Id`]}
                className='border-2 px-2 border-black focus:outline-none col-span-3 cursor-not-allowed'
              />

              <label htmlFor={place}>{place}</label>
              <input
                type='text'
                name={place}
                id={place}
                placeholder={`Enter ${place}`}
                value={newEntity[`${place}`]}
                className='border-2 px-2 border-black focus:outline-none col-span-3'
                onChange={handleChange}
              />


              <label htmlFor='basePrice'>Base Price</label>
              <input
                type='number'
                name='basePrice'
                id='basePrice'
                placeholder={`Enter Base Price`}
                value={newEntity.basePrice}
                min='100'
                className='border-2 px-2 appearance-none border-black focus:outline-none col-span-3'
                onChange={handleChange}
              />
              </div>

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






  