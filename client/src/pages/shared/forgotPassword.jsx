import axios from 'axios';
import { MdCancel } from "react-icons/md";
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authContext } from '../../contexts/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export function ForgotPassword() {
  let { user } = useContext(authContext);

  let [email, setEmail] = useState('');
  let [otpOverlay, setOtpOverlay] = useState(false);

  const handleReset = (event) => {
    event?.preventDefault();
    axios
      .get(`${BASE_URL}/otp/create?email=${email}`)
      .then(res => {
        if (res.data.message === 'success') {
          setOtpOverlay(true);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(err => toast.error(err.response?.data?.message || err.message));
  };

  return (
    <div className="w-screen min-h-screen bg-black flex justify-center items-center p-4 relative">
      <ToastContainer />
      
      <div className="w-full max-w-md bg-[#12101D] rounded-xl p-6 flex flex-col gap-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center">Forgot Password</h2>
        <p className="text-center text-gray-300">Enter your registered email to receive OTP</p>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:border-[#4242FA] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full py-2 bg-[#4242FA] text-white rounded-md hover:bg-opacity-90 transition"
            onClick={(e) => {
              e.preventDefault();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (emailRegex.test(email)) handleReset(e);
              else toast.error('Enter a valid email');
            }}
          >
            Send OTP
          </button>
          <Link to="/login" className="text-center text-[#4242FA] hover:underline mt-2">
            Go Back
          </Link>
        </form>
      </div>

      {otpOverlay && <OTPOverlay email={email} setOtpOverlay={setOtpOverlay} handleReset={handleReset} />}
    </div>
  );
}

const OTPOverlay = ({ email, setOtpOverlay, handleReset }) => {
  const [otp, setOtp] = useState('');
  const [resend, setResend] = useState(false);
  const [timer, setTimer] = useState(120);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const maxCount = 2;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .get(`${BASE_URL}/otp/verify?email=${email}&otp=${otp}`)
      .then(res => {
        if (res.data.message === 'OTP valid') {
          navigate(`/resetPassword/${email}`, { replace: true });
          toast.success(res.data.message);
        } else {
          toast.info(res.data.message);
        }
      })
      .catch(err => toast.error(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    let intervalId = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [count]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center p-4">
      <div className="w-full max-w-sm bg-[#12101D] rounded-xl p-6 flex flex-col gap-6 shadow-lg">
        <h3 className="text-xl font-bold text-white text-center">Enter OTP</h3>
        <input
          type="number"
          min="1000"
          max="9999"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:border-[#4242FA] outline-none"
        />
        <button
          className="w-full py-2 bg-[#4242FA] text-white rounded-md hover:bg-opacity-90 transition"
          onClick={handleSubmit}
        >
          Confirm
        </button>
        <div className="text-center text-white text-sm">
          {resend ? (
            <span
              className="text-[#4242FA] cursor-pointer font-semibold hover:underline"
              onClick={() => { setResend(false); setCount(c => c + 1); handleReset(); setTimer(120); }}
            >
              Resend OTP
            </span>
          ) : (
            <>Resend OTP in {timer} sec</>
          )}
        </div>
      </div>
    </div>
  );
};

export function ResetPassword() {
  const { email } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`${BASE_URL}/auth/updatePassword?email=${email}`, { password })
      .then(res => {
        toast.success(res.data.message);
        navigate('/login', { replace: true });
      })
      .catch(err => toast.error(err.response?.data?.message || err.message));
  };

  return (
    <div className="w-screen min-h-screen bg-black flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#12101D] rounded-xl p-6 flex flex-col gap-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center">Reset Password</h2>
        <form className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Create New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:border-[#4242FA] outline-none"
          />
          <button
            className="w-full py-2 bg-[#4242FA] text-white rounded-md hover:bg-opacity-90 transition"
            onClick={handleSubmit}
          >
            Confirm
          </button>
          <Link to="/ForgotPassword" className="text-center text-[#4242FA] hover:underline mt-2">
            Go Back
          </Link>
        </form>
      </div>
    </div>
  );
}
