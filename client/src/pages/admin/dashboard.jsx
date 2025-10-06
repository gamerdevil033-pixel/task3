import axios from 'axios'

import { useNavigate,Link } from "react-router-dom";
import {useContext,useEffect,useRef,useState,useMemo} from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title 
} from 'chart.js';


import {Bar,Doughnut,Line} from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend, Title); 
  import '../../App.css'
  
  import Loader from '../../components/loader.jsx'
  import { authContext } from '../../contexts/authContext.jsx'

  let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export function AdminDashboard(){
  let navigate = useNavigate()
  let { user, setUser } = useContext(authContext)
  let [usersData, setUsersData] = useState([])
  let [transactionsData, setTransactionsData] = useState([])
  let [loading, setLoading] = useState(true)
  const [topPerforming,setTopPerforming] = useState([]);
 
 const {
  totalTransactions,
  totalAmount,
  totalSuccessfulTransactions,
  totalSuccessfulAmount,
  totalFailedTransactions,
  totalFailedAmount,
  totalClients,
  totalVerifiedClients,
  totalVendors,
  totalVerifiedVendors,
} = useMemo(() => {
  let tTransactions = transactionsData.length;
  let tAmount = 0;
  let tSuccess = 0;
  let tSuccessAmount = 0;
  let tFailed = 0;
  let tFailedAmount = 0;

  transactionsData.forEach(({ amount, status }) => {
    tAmount += amount;
    if (status === 'FAILED') {
      tFailed++;
      tFailedAmount += amount;
    } else {
      tSuccess++;
      tSuccessAmount += amount;
    }
  });

  let cClients = 0, vClients = 0, cVendors = 0, vVendors = 0;
  usersData.forEach(({ role, isVerified }) => {
    if (role === 'client') {
      cClients++;
      if (isVerified) vClients++;
    } else if (role === 'vendor') {
      cVendors++;
      if (isVerified) vVendors++;
    }
    
  });

  return {
    totalTransactions: tTransactions,
    totalAmount: tAmount,
    totalSuccessfulTransactions: tSuccess,
    totalSuccessfulAmount: tSuccessAmount,
    totalFailedTransactions: tFailed,
    totalFailedAmount: tFailedAmount,
    totalClients: cClients,
    totalVerifiedClients: vClients,
    totalVendors: cVendors,
    totalVerifiedVendors: vVendors,
  };
}, [transactionsData, usersData]);


  useEffect(() => {
        setLoading(true)
 
     axios
        .get(`${BASE_URL}/transaction/find`)
        .then(res => {
          setTransactionsData(res.data);
          axios
         .get(`${BASE_URL}/auth/find?role=all`)
         .then(r => {
            setUsersData(r.data.users);
            axios
            .get(`${BASE_URL}/movieShow/find?top=3`)
              .then(r1=>{
                let d1 = r1.data;
                d1.forEach((d,idx)=>{
                  axios.get(`${BASE_URL}/movie/find?movieId=${d.movie}`)
                  .then(r2=>{d1[idx].entityData = r2.data})
                })
                axios
                 .get(`${BASE_URL}/concertShow/find?top=2`)
                    .then(r3=>{
                      let d2 = r3.data;
                       d2.forEach((d,idx)=>{
                  axios.get(`${BASE_URL}/concert/find?concertId=${d.concert}`)
                  .then(r2=>{d2[idx].entityData = r2.data;
                                    let top =[...d1,...d2]
                console.log(top)
                    setTopPerforming(top)
            setTimeout(()=>{
              setLoading(false);
              },500)
                  })
                })

                   
              })
              })
            })
            .catch(err => {})
      }).catch(err => {})

        },[])

      
  return (
   <div className="backgroundDiv">
    <div className="container">
      <div className="header py-2 bg-[#0092cc] text-[#f0f0f0] font-bold pl-2 text-[20px] md:text-[26px]">Dashboard</div>

      <br/>

     {loading?<Loader/>:(
            <div className="body flex gap-4 flex-col">

        <div className="topPerformingEvents  text-white">
            <EntityContainer data={topPerforming} title="Top Performing"/>
        </div>

        <div className="transactionsBox text-white flex justify-around items-center">

          {/* <div className="header flex justify-between p-4 border-b-2">
           <span className="heading text-[19px] md:text-[21px]">Transactions</span>
           <Link to='/admin/transactions' className="viewAll cursor-pointer text-[19px] md:text-[21px]">View All</Link>
          </div>

           <div className="transactions flex flex-wrap justify-between items-center gap-4 py-4 px-6">

            <span className="total flex text-[18px] md:text-[20px]">
              <span className="right flex flex-col items-start gap-2">
              <span className="totalTransactions">
               Total Transactions : {totalTransactions}
              </span>
              <span className="totalAmount">
               Total Amount : {totalAmount}
              </span>
            </span>
            </span>
 
            <span className="successful text-[18px] md:text-[20px]">
              <span className="right flex flex-col items-start gap-2">
              <span className="totalTransactions">
                Successful Transactions :{totalSuccessfulTransactions}
              </span>
              <span className="totalAmount">
                Total Amount : {totalSuccessfulAmount}
              </span>
            </span>
            </span>

            <span className="failed text-[18px] md:text-[20px]">
              <span className="right flex flex-col items-start gap-2">
              <span className="totalTransactions">
                  Failed Transactions :  {totalFailedTransactions}
              </span>
              <span className="totalAmount">
                Total Amount : {totalFailedAmount}
              </span>
             </span>
            </span>
           </div> */}
      
      <div className="transactionsContainer border-amber-100 border-1">
<Doughnut
  data={{
    labels: ['Total', 'Successful', 'Failed'],
    datasets: [
      {
        label: 'Transactions',
        data: [totalTransactions, totalSuccessfulTransactions, totalFailedTransactions],
        backgroundColor: ['blue', 'green', 'red'],
        borderRadius: 1
      }
    ]
  }}
  options={{
    plugins: {
      title: {
        display: true,
        text: 'Transactions Overview',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: 'white',
        padding: {
          top: 10,
          bottom: 20
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }}
/>
</div>

      <div className="moneyContainer border-amber-100 border-1">
        <Doughnut data={{
          labels:['Successful','Failed'],
          datasets:[
            {label:'Amount',
            data:[totalSuccessfulAmount,totalFailedAmount],
            backgroundColor:[
              'green',
              'red'
            ]
          },
        ]}} 
      
  options={{
    plugins: {
      title: {
        display: true,
        text: 'Revenue Overview',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: 'white',
        padding: {
          top: 10,
          bottom: 20
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }}/>
        </div>

        </div>

        <div className="usersBox border-amber-100 border-1 text-white text-[18px] md:text-[20px]">

          <div className="header flex flex-wrap justify-between p-4 border-b-2">
           <span className="heading text-[19px] md:text-[21px]">Users</span>
           <span className="viewAll cursor-pointer" onClick={()=>{navigate('/admin/home')}}>View All</span>
          </div>

           <div className="transactions flex justify-between items-center gap-4 py-4 px-6">

            <span className="total flex flex-col items-start">
              <span className="totalClients">
               Total Clients : {totalClients}
              </span>
              <span className="totalAmount">
               Total Verified Clients : {totalVerifiedClients}
            </span>
            </span>

            <span className="successful right flex flex-col items-start gap-2">
              <span className="totalTransactions">
                Total Vendors :{totalVendors}
              </span>
              <span className="totalAmount">
                Total Verifed Vendors : {totalVerifiedVendors}
              </span>
            </span>

           </div>

        </div>

      </div>
     )}

    </div>
   </div>
  )
}


function EntityContainer (props) {
  let scrollRef = useRef(null)

  const scroll = x => {
    let scrollX = scrollRef.current.scrollLeft
    scrollRef.current.scrollTo(scrollX + x, 0)
  }

  return (
    <div className='w-full'>
      <br />
      <div className='title text-18px md:text-20px text-white text-sm font-medium pb-3 md:pb-4 md:text-xl md:font-bold'>
        Top Performing
      </div>

      <div
        style={{ userSelect: 'none' }}
        className='moviesScrollContainer flex items-center'
      >
        {/* <span className="leftArrow hidden md:block text-4xl text-white font-bold pr-4 cursor-pointer active:text-[#4242FA]" onClick={()=>{scroll(-200)}}>{'<'}</span> */}
        <div
          style={{ scrollbarWidth: 'none', scrollBehavior: 'smooth' }}
          ref={scrollRef}
          className='overflow-y-hidden flex gap-4 md:gap-6 lg:gap-7 overflow-x-auto scroll-mr-12 '
        >
          {props.data.map((show, idx) => {
              return <ShowsCard key={idx} show={show} />
          })}
        </div>
        {/* <span className="rightArrow hidden md:block text-4xl text-white font-bold pl-4 cursor-pointer active:text-[#4242FA]" onClick={()=>{scroll(200)}}>{'>'}</span> */}
      </div>

      <br />
    </div>
  )
}

export function ShowsCard (props) {
  let { show } = props
  return (
    <div className='cardContainer cursor-pointer'>
      <div className='imageContainer overflow-hidden rounded-xl h-[185px] w-[130px] md:h-[285px] md:w-[200px] border-[#636363] hover:border-white border-2'>
          <img
            src={show?.entityData[0]?.poster}
            draggable='false'
            className='transition duration-500 ease-in-out hover:scale-105'
          />
      </div>
    </div>
  )
}


 