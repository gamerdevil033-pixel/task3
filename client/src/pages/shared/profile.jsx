import axios from 'axios';
import '../../App.css';
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authContext } from '../../contexts/authContext.jsx';

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout, updateUser, setAuthMessage } = useContext(authContext);

  const [mode, setMode] = useState('view');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    email: user.email,
    username: user.username,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    updateUser(formData);
    setMode('view');
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

    const form = new FormData();
    form.append('image', file);

    axios
      .post(`${BASE_URL}/auth/uploadImage?id=${user._id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => {
        setUser(prev => ({ ...prev, profileImageUrl: res.data.url }));
      })
      .catch(err => console.error(err));
  };

  return (
<div className='backgroundDiv min-h-screen'> 
  <div className='container flex flex-col items-center gap-5'> 
    <div className='header py-2 w-full flex items-center justify-between'>
        <h1 className="text-xl md:text-2xl font-bold text-white mb-4 sm:mb-0">Profile Details</h1>
        <Link
          to="/login"
          className="bg-[#4242FA] text-white font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
          onClick={() => {
            logout();
            setAuthMessage('Logout Successfully');
          }}
        >
          Logout
        </Link>
      </div>

      <form className="w-full max-w-lg flex flex-col items-center gap-6 bg-black p-6 rounded-xl border-2 border-gray-700">
    
        <div className="relative w-14 h-14 sm:w-20 sm:h-20 mb-4">
          <img
            src={previewUrl || user.profileImageUrl}
            alt="Profile"
            className="rounded-full w-full h-full object-cover border-2 border-[#4242FA]"
          />
          <label
            htmlFor="file"
            className="absolute bottom-0 right-0 bg-[#4242FA] text-white rounded-full p-1 sm:p-2 cursor-pointer hover:bg-opacity-90 transition"
            title="Change profile image"
          >
            🖉
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>


        <div className="w-full flex flex-col gap-4">
   
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="text-white font-medium mb-1 sm:mb-0 w-28">Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="flex-1 p-1.5 rounded-lg bg-gray-800 border-2 border-gray-700 text-white cursor-not-allowed"
            />
          </div>

   
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="text-white font-medium mb-1 sm:mb-0 w-28">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="flex-1 p-1.5 rounded-lg bg-gray-800 border-2 border-gray-700 text-white cursor-not-allowed"
            />
          </div>

  
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="text-white font-medium mb-1 sm:mb-0 w-28">Verified</label>
            <input
              type="text"
              value={user.isVerified ? 'Yes' : 'No'}
              disabled
              className="flex-1 p-1.5 rounded-lg bg-gray-800 border-2 border-gray-700 text-white cursor-not-allowed"
            />
          </div>

      
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="text-white font-medium mb-1 sm:mb-0 w-28">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              disabled={mode === 'view'}
              onChange={handleChange}
              className={`flex-1 p-1.5 rounded-lg border-2 text-white ${
                mode === 'view' ? 'bg-gray-800 border-gray-700 cursor-not-allowed' : 'bg-gray-900 border-[#4242FA]'
              }`}
            />
          </div>
        </div>

    
        <button
          type="button"
          onClick={() => (mode === 'view' ? setMode('edit') : handleSubmit())}
          className="w-full sm:w-auto bg-[#4242FA] text-white font-semibold px-5 py-1.5 rounded-lg hover:bg-opacity-90 transition"
        >
          {mode === 'view' ? 'Edit' : 'Save'}
        </button>
      </form>
    </div>
    </div>
  );
};
