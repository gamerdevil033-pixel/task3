  import axios from 'axios'
  import { FiEdit2 } from "react-icons/fi";
  import { MdDeleteOutline } from "react-icons/md";
  
  import { useState, useEffect, useContext, createContext } from 'react'
  import { useNavigate, Link ,useLocation} from 'react-router-dom'
  import '../../App.css'
  
  import Loader from '../../components/loader.jsx'
  import { authContext } from '../../contexts/authContext.jsx'

  let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

  export const dataContext = createContext()
  
  export function Concerts () {
    let { user, setUser } = useContext(authContext)
    let options = ['concerts', 'stadiums', 'concertShows']
    let [currentOption, setCurrentOption] = useState('concerts')
    let [data, setData] = useState()
    let [loading, setLoading] = useState(true)
    let [isEditing,setIsEditing] = useState(false);
    let [newEntity,setNewEntity] = useState({});
    let [isOverlay,setIsOverlay] = useState(false);
    let [editingIdx,setEditingIdx] = useState(null);
    let location = useLocation()

    let def={concerts : {
      title : '',
      duration : '',
      language : '',
      genre : '',
      plot : '',
      artist : '',
      ageRestriction : '',
      organizedBy:user._id,
      poster:'https://res.cloudinary.com/diizmtj04/image/upload/v1751881581/default_poster_payucm.jpg'
    },

  stadiums : {
      name:'',location:'',layout : {
    "capacity": "200",
    "seatsLayout": {
      "rows": "10",
      "columns": "20",
      "seats": [
        [
          {
            "id": "A1",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A2",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A3",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A4",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A5",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A6",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A7",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A8",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A9",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A10",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A11",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A12",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A13",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A14",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A15",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A16",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A17",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A18",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A19",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "A20",
            "type": "vip",
            "value": 1.5
          }
        ],
        [
          {
            "id": "B1",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B2",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B3",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B4",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B5",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B6",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B7",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B8",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B9",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B10",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B11",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B12",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B13",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B14",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B15",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B16",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B17",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B18",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B19",
            "type": "vip",
            "value": 1.5
          },
          {
            "id": "B20",
            "type": "vip",
            "value": 1.5
          }
        ],
        [
          {
            "id": "C1",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C2",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C3",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C4",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C5",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C6",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C7",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C8",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C9",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C10",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C11",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C12",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C13",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C14",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C15",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C16",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C17",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C18",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C19",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "C20",
            "type": "firstClass",
            "value": 1.2
          }
        ],
        [
          {
            "id": "D1",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D2",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D3",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D4",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D5",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D6",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D7",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D8",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D9",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D10",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D11",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D12",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D13",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D14",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D15",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D16",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D17",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D18",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D19",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "D20",
            "type": "firstClass",
            "value": 1.2
          }
        ],
        [
          {
            "id": "E1",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E2",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E3",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E4",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E5",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E6",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E7",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E8",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E9",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E10",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E11",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E12",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E13",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E14",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E15",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E16",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E17",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E18",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E19",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "E20",
            "type": "firstClass",
            "value": 1.2
          }
        ],
        [
          {
            "id": "F1",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F2",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F3",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F4",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F5",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F6",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F7",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F8",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F9",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F10",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F11",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F12",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F13",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F14",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F15",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F16",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F17",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F18",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F19",
            "type": "firstClass",
            "value": 1.2
          },
          {
            "id": "F20",
            "type": "firstClass",
            "value": 1.2
          }
        ],
        [
          {
            "id": "G1",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G2",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G3",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G4",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G5",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G6",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G7",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G8",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G9",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G10",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G11",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G12",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G13",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G14",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G15",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G16",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G17",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G18",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G19",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "G20",
            "type": "secondClass",
            "value": 1
          }
        ],
        [
          {
            "id": "H1",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H2",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H3",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H4",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H5",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H6",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H7",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H8",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H9",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H10",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H11",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H12",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H13",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H14",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H15",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H16",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H17",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H18",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H19",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "H20",
            "type": "secondClass",
            "value": 1
          }
        ],
        [
          {
            "id": "I1",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I2",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I3",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I4",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I5",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I6",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I7",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I8",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I9",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I10",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I11",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I12",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I13",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I14",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I15",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I16",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I17",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I18",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I19",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "I20",
            "type": "secondClass",
            "value": 1
          }
        ],
        [
          {
            "id": "J1",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J2",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J3",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J4",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J5",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J6",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J7",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J8",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J9",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J10",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J11",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J12",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J13",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J14",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J15",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J16",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J17",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J18",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J19",
            "type": "secondClass",
            "value": 1
          },
          {
            "id": "J20",
            "type": "secondClass",
            "value": 1
          }
        ]
      ]
    }
  }
    },
concertShows : {
      date:'',slot:'',movieid:'',theaterId:'',ticketsAvailable:'',ticketsBooked:''
    }}

        function deleteEntity(id){
      console.log(id)
      axios
          .delete(`${BASE_URL}/${currentOption.slice(0,currentOption.length-1)}/delete?id=${id}`)
          .then(res => {
            console.log(res.data);
            fetchData();
          })
          .catch(err => {console.log('fdasdf',err)})
          console.log(id)
    }


  function fetchData(){
            setLoading(true)
           axios
              .get(`${BASE_URL}/${currentOption.slice(0,currentOption.length-1)}/find`)
              .then(res => {
              setData(res.data.reverse())
                console.log(res.data)
                setLoading(false)
              })
              .catch(err => {})
    }
      
  useEffect(() => { 
      fetchData();
        }, [currentOption])
  
    return (
      <div className='backgroundDiv min-h-screen flex justify-center items-center'>
          
            {isOverlay && <AddOverlay fetchData={fetchData} setData={setData} currentOption={currentOption} newEntity={newEntity} setNewEntity= {setNewEntity} isEditing={isEditing} setIsEditing={setIsEditing} isOverlay={isOverlay} setIsOverlay={setIsOverlay} editingIdx={editingIdx}/>}
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
  
            {loading ? <Loader/>:(
          <div className='main w-full py-4 flex flex-col gap-4'>

            
            <header className='text-white flex justify-between items-center bg-[#cc3333] py-2 px-3 rounded-md'>
              <span className="noofmovies">Total {currentOption.charAt(0).toUpperCase() + currentOption.slice(1)} : {data.length}</span>
              <span className="add btn"  onClick={()=>{setIsOverlay(true);setNewEntity(def[currentOption]);setIsEditing(false)}}>Add {currentOption.charAt(0).toUpperCase() + currentOption.slice(1)}</span>
            </header>

           {(currentOption === 'concerts')&& <div className="moviesList gap-4 flex flex-col">
           {data.map((concert,idx)=>{
            return <ConcertCards key={idx} show={concert} deleteEntity={deleteEntity} setIsEditing={setIsEditing} setNewEntity={setNewEntity} setEditingIdx={setEditingIdx} setIsOverlay={setIsOverlay} />
           })}
           </div>}

           
           {(currentOption === 'stadiums')&& <div className="theatersList gap-4 flex flex-col">
           {data.map((stadium,idx)=>{
            return <StadiumCards key={idx} show={stadium}  idx={idx} deleteEntity={deleteEntity} setIsEditing={setIsEditing} setNewEntity={setNewEntity} setEditingIdx={setEditingIdx} setIsOverlay={setIsOverlay}/>
           })}
           </div>}

           
           {(currentOption === 'concertShows')&& <div className="showsList gap-2 md:gap-4 grid sm:grid-cols-2 xl:grid-cols-3">
           {data.map((show,idx)=>{
            return <ShowCards key={idx} show={show}  idx={idx} deleteEntity={deleteEntity} setIsEditing={setIsEditing} setNewEntity={setNewEntity} setEditingIdx={setEditingIdx} setIsOverlay={setIsOverlay} location={location}/>
           })}
           </div>}

          </div>)}

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
        <div className='imageContainer overflow-hidden rounded-xl h-[140px] w-[95px] md:h-[240px] md:w-[165px] border-[#636363]  border-2'>
          <img
            src={show.poster}
            draggable='false'
            className='transition duration-500 ease-in-out hover:scale-105'
          />
      </div>
        </div>
        <div className="right md:p-4 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col w-full">
        <div className="header flex justify-between items-center gap-3 pr-2 py-2 w-full">
          <span className="movieId text-[#757575]">ConcertID : {show._id}</span>
          <span className="options flex gap-3">
            <FiEdit2 className='font-semibold md:text-2xl text-emerald-500' onClick={()=>{setNewEntity(show);setIsOverlay(true);
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
      </div>
    )
  }
  

  const StadiumCards = ({show,deleteEntity,setIsEditing,setNewEntity,setEditingIdx,setIsOverlay,idx}) =>{
      const seatSizes = {
    height: 30,
    width: 30,
    gap: 10,
  };
    return(
    <div className="trainContainer border-2 border-[#eee] rounded-md p-2 px-4">

        <div className="header flex justify-between items-center gap-3 py-2">
          <span className="movieId text-[#757575]">TheaterID : {show._id}</span>
          <span className="options flex gap-3">
            <FiEdit2 className='font-semibold md:text-2xl text-emerald-500' onClick={()=>{setNewEntity(show);setIsOverlay(true);
              setIsEditing(true);setEditingIdx(idx);}}></FiEdit2>
            <MdDeleteOutline className='text-red-600 font-semibold md:text-2xl ' onClick={()=>{deleteEntity(show._id);alert('delete')}}></MdDeleteOutline>
          </span>
        </div>

        <div className="trainInfo flex flex-col md:flex-row items-center  justify-between md:justify-around gap-2 md:gap-4">

        <div className="left md:p-4 text-white text-md text-xs md:text-sm lg:text-lg flex md:flex-col items-center md:items-start gap-4 justify-between">
          <li className="trainNumber pb-1"><strong>Theater Name :</strong>{show.name}</li>
          <li className="title pb-1"><strong>Location :</strong>{show.location}</li>
          <li className="duration pb-1"><strong>Capacity : </strong>{show.layout.capacity} seats</li>
        </div>

        <div className="right seatLayout flex justify-center items-center pr-2 md:pr-4">      
      <svg className="overflow-x-scroll overflow-y-scroll border-2 border-[#636363] p-2" width='400' height='250' viewBox={`0 0 ${820} ${500}`}>
      {show.layout.seatsLayout.seats.map((arr1, i) =>
        arr1.map((seat, j) => {
          let x;
          if(j>9){
          x = seatSizes.gap * (j) + seatSizes.width * j + 3*seatSizes.gap;
          }else{
          x = seatSizes.gap * (j) + seatSizes.width * j;
          }
         const y = seatSizes.gap * (i) + seatSizes.height * i;

          return (
            <svg key={`seat-${i}-${j}`} transform={`translate(${x}, ${y})`}>
              <rect
                width={seatSizes.width}
                height={seatSizes.height}
                fill='transparent'
                stroke="gray"
                strokeWidth="2"
                rx="5"
                ry="5"
                className="cursor-pointer hover:border-white border-2 border-[#636363] transition duration-200"
              />
              <text
                x={seatSizes.width / 2}
                y={seatSizes.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="white"
                pointerEvents="none"
                className='select-none'
              >
                {seat.id}
              </text>
            </svg>
          );}))}
    
     <svg transform={`translate(${205}, ${460})`}>
             <rect
                width='410'
                height='40'
                fill='white'
                stroke="gray"
                strokeWidth="2"
                rx="5"
                ry="5"
                className="cursor-pointer"
              />
              <text
                x={410/2}
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fill="black"
                pointerEvents="none"
                className='select-none'
              >Screen</text>
      </svg>
    </svg>
        </div>
        </div>
      </div>
    )
  }

  const ShowCards = ({show,deleteEntity,setIsEditing,setNewEntity,setEditingIdx,setIsOverlay,idx,location}) =>{

   
    return(
      <div className="trainContainer border-2 border-[#eee] rounded-md p-2 px-4">

         <div className="trainInfo flex items-center justify-between gap-2 md:gap-4">
          <div className="movieInfo flex flex-col items-stretch gap-2 md:gap-4">

          <div className="header flex justify-between items-center gap-3 pt-1">
          <span className="movieId text-[#757575]">showID : {show._id}</span>
          <span className="options flex gap-3">
            <FiEdit2 className='font-semibold md:text-2xl text-emerald-500' onClick={()=>{setNewEntity(show);setIsOverlay(true);
              setIsEditing(true);setEditingIdx(idx);}}></FiEdit2>
            <MdDeleteOutline className='text-red-600 font-semibold md:text-2xl ' onClick={()=>{deleteEntity(show._id);alert('delete')}}></MdDeleteOutline>
          </span>
        </div>

        <div className="right md:p-2 text-white text-md text-xs md:text-sm lg:text-lg flex items-stretch flex-col list-none">
          <li className="duration pb-1"><strong>Date : </strong>{show.date?.split('T')[0]}</li>
          <li className="languages pb-1"><strong>Slot : </strong>{show.slot}</li>
          <li className="trainNumber pb-1"><strong>Concert :</strong>{show.concert.title}</li>
          <li className="title pb-1"><strong>Stadium :</strong>{show.stadium.name}</li>
          <li className="totalDuration pb-1"><strong>TicketsAvailable : </strong>{show.ticketsAvailable}</li>
        </div>

                <div className="footer py-2 flex items-center justify-center text-white">
          <Link to={`/admin/show/concert/${show._id}`} state={{from:location.pathname}} className="viewAll btn">View Layout</Link>
        </div>

        </div>
        </div>

      </div>
    )
  }

  function AddOverlay ({fetchData,currentOption,data,setData,newEntity,setNewEntity,isEditing,setIsEditing,isOverlay,setIsOverlay}) {

    let inputOptions = {'concerts':['title','duration','language','genre','artist','ageRestriction','plot'],
      'stadiums':['name','Location'],'concertShows':['date','slot','concertId','stadiumId','ticketsAvailable','ticketsBooked']}

  const handleChange = e => {
    let { name, value } = e.target
    setNewEntity(prev => ({ ...prev, [name]: value }))
  }

  const submitHandler = ()=>{
    let co = currentOption.slice(0,currentOption.length-1);
    if(isEditing){
    axios
          .patch(`http://localhost:5000/${co}/update?id=${newEntity._id}`,newEntity)
          .then(res => {
            console.log(res.data);
            fetchData();
          })
          .catch(err => {})
    } else{
      axios
          .post(`http://localhost:5000/${co}/add`,newEntity)
          .then(res => {
            console.log(res.data);
            fetchData();
          })
          .catch(err => {})
    }

  }


  console.log(newEntity)

  console.log(isEditing)
  return (
  <div className='overlayBackground w-screen h-screen fixed bg-[rbga(0,0,0,0.3)] flex items-center justify-center left-0 top-0 text-white'>
           <div className='w-[70%] bg-[#12101D] rounded-lg border-amber-50'>
        <div className='header bg-[#1E1A31] p-2'>{isEditing ? 'Edit' : 'Add'} {currentOption.charAt(0).toUpperCase() + currentOption.slice(1)}</div>
        <div className='body p-4 flex flex-col gap-4 px-8'>
          <div className='inputContainer grid grid-cols-1 gap-4 items-start'>
          {inputOptions[currentOption].map((input,idx)=>{
            return(
              <div className="inputContainer grid grid-cols-4" key={idx}>
                <label htmlFor={input}>{input.charAt(0).toUpperCase() + input.slice(1)}</label>
              <input
                type='text'
                name={input}
                id={input}
                placeholder={`Enter ${input}`}
                value={newEntity[input]}
                className='border-2 px-2 border-white focus:outline-none col-span-3 text-[#f0f0f0] py-1 rounded-md'
                onChange={handleChange}
              />
              </div>
            )
          })}

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
