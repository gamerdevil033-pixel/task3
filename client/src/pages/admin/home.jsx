  import axios from 'axios'
  import { FiEdit2 } from "react-icons/fi";
  import { MdDeleteOutline } from "react-icons/md";
  import { GiKnifeThrust } from "react-icons/gi";
  
  import { useState, useEffect, useContext, createContext } from 'react'
  import { useNavigate, Link,useLocation } from 'react-router-dom'
  import '../../App.css'
  
  import Loader from '../../components/loader.jsx'
  import { authContext } from '../../contexts/authContext.jsx'

  export const dataContext = createContext()

  let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL
  
  export function AdminHome () {
    let { user, setUser } = useContext(authContext)
    let options = ['clients', 'vendors']
    let [currentOption, setCurrentOption] = useState('clients')
    let [data, setData] = useState([])
    let [loading, setLoading] = useState(true)
    const location = useLocation()


    const fetchData = ()=>{
      setLoading(true)
        axios
          .get(`${BASE_URL}/auth/find?role=${currentOption.slice(0,currentOption.length-1)}`)
          .then(res => {
            setData(res.data.users.reverse())
            setTimeout(()=>setLoading(false),2000)
          })
          .catch(err => {})
    }

    const suspendUser = (id,data) =>{
      console.log(id)
      axios
          .put(`${BASE_URL}/auth/update?id=${id}`,{updateFields:{isSuspended:data}})
          .then(res => {
            console.log(res.data)
            fetchData();
          })
          .catch(err => {});
    }

    function deleteUser(id){
      console.log(id)
      axios
          .delete(`${BASE_URL}/auth/delete?id=${id}`)
          .then(res => {
            console.log(res.data);
            fetchData();
          })
          .catch(err => {console.log('fdasdf',err)})
          console.log(id)
    }
  
    useEffect(() => {
      fetchData()
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
                    className={`rounded-2xl p-1 px-3 font-bold text-lg text-white cursor-pointer ${
                      currentOption === option ? 'bg-[#4242FA]' : 'bg-transparent'
                    }`}
                    onClick={() => {
                      setCurrentOption(option)
                    }}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                )
              })}
            </div>
          </div>
  

            {loading ? <Loader/>:(
          <div className='main w-full py-4'>

          <div className="moviesList gap-4 flex flex-col">
           {data.map((user,idx)=>{
            return <Cards key={idx} show={user} suspendUser={suspendUser} deleteUser={deleteUser}/>
           })}
           </div>

          </div>)}

        </div>
      </div>
    )
  }

  
   const Cards = ({show,suspendUser,deleteUser}) =>{
    console.log(show)

    return(
      <div className={`trainContainer border-2 border-[#eee] ${show.isSuspended?'opacity-40':''} rounded-md p-2 px-4`}>

         <div className="trainInfo flex items-center justify-between gap-2 md:gap-4">
          <div className="movieInfo flex flex-col items-stretch gap-2 md:gap-4 w-full">

          <div className="header w-full flex justify-between items-center gap-3 pt-1">
          <span className="movieId text-[#757575]">userID : {show._id}</span>
          <span className="options flex self-end gap-6">
           <GiKnifeThrust className={`font-semibold md:text-3xl ${show.isSuspended?'text-fuchsia-600':'text-green-400'}`} onClick={()=>{
            if(confirm(show.isSuspended?'Remove Suspension':'Suspend Account')){suspendUser(show._id,!show.isSuspended)}}}></GiKnifeThrust> 
            <MdDeleteOutline className='text-red-600 font-semibold md:text-2xl ' onClick={()=>{if(confirm('delete')){deleteUser(show._id)}}}></MdDeleteOutline>
          </span>
        </div>

        <div className="md:p-2 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col list-none">
          <li className="duration pb-1"><strong>Role : </strong>{show.role}</li>
          <li className="languages pb-1"><strong>Email : </strong>{show.email}</li>
          <li className="trainNumber pb-1"><strong>Username :</strong>{show.username}</li>
          {show.role==='client' &&  <li className="title pb-1"><strong>Amount Available :</strong>{show.amountAvailable}</li>}
         {show.role==='client' && <li className="totalDuration pb-1"><strong>Total transactions: </strong>{show.myTransactions?.length}</li>}
          <li className="total pb-1"><strong>isSuspended: </strong>{show.isSuspended?'True':"False"}</li>
        </div>

        {show.role==='vendor' && <div className="footer flex justify-center items-center text-white">
           <Link to={`/admin/events/${show._id}`} state={{from:location.pathname}} className="events btn">Events Organized</Link>
        </div>}

        </div>
        </div>

      </div>
    )
  }