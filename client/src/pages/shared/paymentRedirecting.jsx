

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/loader.jsx';
import { authContext } from '../../contexts/authContext.jsx';

export const PaymentRedirecting = () => {
  const { user, getLinkStatus, authLoading } = useContext(authContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payData, setPayData] = useState({});

useEffect(() => {
  if (!authLoading && user) {
    getLinkStatus(user, setLoading, setPayData, navigate);
  } else if (!authLoading && !user) {
    navigate('/login');
  }
}, [authLoading, user]);

  if (authLoading || loading) return <Loader />;

  if (payData.status === 'ERROR') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{payData.message}</p>
        <button onClick={() => navigate('/home')} className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex justify-center items-center">
      <div className="max-w-4xl w-full">
        {payData.status === 'PAID' ? (
          <SuccessPage payData={payData} downloadHandler={downloadHandler} />
        ) : (
          <FailedPage />
        )}
      </div>
    </div>
  );
};



function SuccessPage({ payData, downloadHandler }) {
  return (
    <div className="bg-[#1e293b] rounded-lg shadow-lg p-6 max-w-3xl mx-auto space-y-6">
      <h1 className={`text-center text-3xl font-bold ${payData.status === 'PAID' ? 'text-green-400' : 'text-red-400'}`}>
        {payData.status === 'PAID' ? 'Payment Successful' : 'Payment Failed'}
      </h1>

     
      <div className="bg-[#334155] p-4 rounded-lg">

        {payData.purpose === 'movie' && (
          <>
            <p><strong>Booked On:</strong> {new Date(payData.createdAt).toLocaleDateString()}</p>
            <p><strong>Amount Paid:</strong> ₹{payData.amount}</p>
            <p><strong>Date:</strong> {payData.metaData.date.split('T')[0]}</p>
            <p><strong>Slot:</strong> {payData.metaData.slot}</p>
            <p><strong>Movie:</strong> {payData.metaData.movie}</p>
            <p><strong>Theater:</strong> {payData.metaData.theater}</p>
          </>
        )}

      </div>

      <div className="flex justify-between items-center">
        {payData.status === 'PAID' && (
          <button
            onClick={() => downloadHandler(payData.link_id)}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Download Invoice PDF
          </button>
        )}
        <Link to="/home" className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
          Go Home
        </Link>
      </div>
    </div>
  );
}


function FailedPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-4">Payment Failed</h2>
      <p className="mb-6">Sorry, your payment was not successful. Please try again.</p>
      <Link to="/home" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800">
        Go Home
      </Link>
    </div>
  );
}

