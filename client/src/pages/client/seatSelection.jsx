import axios from 'axios';
import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';

import { SeatLayout } from '../../components/seatLayout.jsx';
import { authContext } from '../../contexts/authContext.jsx';
import Loader from '../../components/loader.jsx';
import '../../App.css';

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export function SeatSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, createLink } = useContext(authContext);

  const { entityType, _id, type, showId } = useParams();

  const [loading, setLoading] = useState(true);
  const [creatingLink, setCreatingLink] = useState(false); 

  const [show, setShow] = useState(null);
  const [theater, setTheater] = useState(null);

  const [confirmationOver, setConfirmationOver] = useState(false);
  const [maxSeatCount, setMaxSeatCount] = useState(0);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [unavailableSeats, setUnavailableSeats] = useState([]);

  const totalPrice = useRef(0);


  const colors = {
    available: { color: 'transparent' },
    booked: { color: '#D32F2F' },
    selected: { color: '#388E3C' },
    unavailable: { color: '#636363' },
  };

 
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/${entityType}Show/find?showId=${showId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const showData = res.data[0];
          setShow(showData);
          setTheater(showData[type]);
          setLoading(false);
        } else {

          alert('Show not found');
          navigate('/');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load show data');
        navigate('/');
      });
  }, [entityType, showId, type, navigate]);


  const getTotalPrice = () => {
    if (!show || !theater) return 0;

    let basePrice = show.basePrice;
    let total = 0;

    selectedSeats.forEach((seat) => {
 
      let row = seat.charCodeAt(0) - 65;
      let col = parseInt(seat.slice(1)) - 1;

      let seatValue = theater.layout.seatsLayout.seats[row][col].value;
      total += basePrice * seatValue;
    });

    totalPrice.current = total;
    return total;
  };

 
  const handleProceedPayment = () => {
    if (!user) {

      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (selectedSeats.length !== maxSeatCount) {

      return;
    }

    setCreatingLink(true);


    const metaData = {
      showId: show._id,
      [entityType]: show[entityType].title,
      [type]: show[type].name,
      slot: show.slot,
      date: show.date,
      seatsBooked: selectedSeats,
    };

    const body = {
      purpose: entityType,
      user: user._id,
      vendor: show[entityType].organizedBy,
      amount: totalPrice.current,
      metaData,
    };


    createLink(body)
      .then(() => {

      })
      .catch((error) => {
        alert('Failed to create payment link. Try again.');
        console.error(error);
      })
      .finally(() => {
        setCreatingLink(false);
      });
  };

  return (
    <div className={`backgroundDiv text-white min-h-screen flex flex-col`}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {!confirmationOver && (
            <Confirmation
              setMaxSeatCount={setMaxSeatCount}
              setConfirmationOver={setConfirmationOver}
            />
          )}

          <div className="seatOverlay flex flex-col px-4 flex-grow">
            <div className="header flex items-center py-4 justify-between">
              <span className="title text-2xl font-bold">Seat Selection</span>
              <span className="seatsAvailable">Seats Available : {show.ticketsAvailable}</span>
            </div>

            <ul className="setTypes flex justify-around mb-4">
              <li className="flex gap-2 items-center">
                Available: <div className="size-6 bg-transparent border border-gray-500 w-6 h-6"></div>
              </li>
              <li className="flex gap-2 items-center">
                Booked: <div className="size-6 bg-[#D32F2F] border border-gray-500 w-6 h-6"></div>
              </li>
              <li className="flex gap-2 items-center">
                Selected: <div className="size-6 bg-[#388E3C] border border-gray-500 w-6 h-6"></div>
              </li>
              <li className="flex gap-2 items-center">
                Unavailable: <div className="size-6 bg-[#636363] border border-gray-500 w-6 h-6"></div>
              </li>
            </ul>

            <div className="seatsGrid py-2 flex justify-center items-center flex-grow overflow-auto">
              <SeatLayout
                seats={theater.layout.seatsLayout.seats}
                ticketsBooked={show.ticketsBooked}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                unavailableSeats={unavailableSeats}
                maxSeatCount={maxSeatCount}
                setMaxSeatCount={setMaxSeatCount}
                show={show}
              />
            </div>

            <div className="footer flex flex-col gap-4 py-4">
              <div className="priceSelected flex justify-between px-4">
                <span className="totalPrice text-lg font-semibold">
                  Total Price: ₹{getTotalPrice()}
                </span>

                <span className="seatsSelected text-lg font-semibold">
                  Seats selected: {selectedSeats.join(', ') || 'None'}
                </span>
              </div>

              <div className="proceedback px-4 py-2 flex justify-between items-center gap-4">
                <Link to={`/${entityType}/${_id}/${type}`}>
                  <button className="back rounded-xl border-2 border-white py-2 px-4 hover:bg-white hover:text-black transition duration-200">
                    Back
                  </button>
                </Link>

                <button
                  className={`proceed p-2 px-4 rounded-lg text-lg font-bold border-2 transition duration-200
                    ${
                      selectedSeats.length === maxSeatCount
                        ? 'border-white text-white hover:bg-red-600 cursor-pointer'
                        : 'border-gray-600 text-gray-600 cursor-not-allowed pointer-events-none'
                    }`}
                  onClick={handleProceedPayment}
                  disabled={creatingLink || selectedSeats.length !== maxSeatCount}
                >
                  {creatingLink ? 'Processing...' : 'Proceed Payment'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const Confirmation = ({ setMaxSeatCount, setConfirmationOver }) => {
  let max = 4;
  let [count, setCount] = useState(0);

  return (
    <div className="background w-screen h-screen fixed z-40 overflow-hidden flex justify-center items-center left-0 top-0 bg-black bg-opacity-80">
      <div className="w-[90%] max-w-md rounded-xl border-2 border-[#97D0ED] p-4 flex flex-col justify-between gap-4 items-center bg-black">
        <h1 className="mainTitle text-2xl font-bold text-center">Select Number of Seats</h1>
        <div className="seatsSelectionContainer w-full flex gap-2 justify-center flex-wrap">
          {Array(max)
            .fill(null)
            .map((_, idx) => (
              <button
                key={idx}
                className={`h-10 w-10 rounded-xl border border-gray-600 cursor-pointer hover:border-white flex items-center justify-center text-white
                  ${idx + 1 === count ? 'bg-[#4242FA]' : 'bg-transparent'}`}
                onClick={() => setCount(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
        </div>
        <button
          className={`btn confirm font-medium text-white text-sm md:text-md xl:text-xl px-8 py-2 rounded-md
            ${count < 1 ? 'cursor-not-allowed bg-gray-600' : 'cursor-pointer bg-blue-600 hover:bg-blue-700'}`}
          onClick={() => {
            if (count > 0) {
              setMaxSeatCount(count);
              setConfirmationOver(true);
            }
          }}
          disabled={count < 1}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
