export function Login() {
  const { user, setUser,login,authMessage } = useContext(authContext);
  const [message, setMessage] = useState('');
  const roles = ['admin', 'client', 'vendor'];
  

  const navigate = useNavigate();
  const location = useLocation();


  const [formData, setFormData] = useState({
    role: 'client',
  })

  const handleSubmit = event => {
    event.preventDefault();
    axios
      .post(`${BASE_URL}/auth/login`, formData)
      .then(res => {
        if (res.data.token) {
          if(res.data.user.isSuspended){alert('your account got suspended')}
          else{
          setUser(res.data.user)
          localStorage.setItem('token', res.data.token);
          setMessage(res.data.message);
          if(formData.role !== 'client'){
            console.log(formData.role)
            navigate(`/${formData.role}/`,{replace:true})
            return;
          } else{
          console.log(from)
          navigate(from,{replace:true})
          return;
          }
          }
        }
      })
      .catch(err => {console.log(err);toast.error(err.response.data.message);})
  }

  return (
    <div className='w-screen h-screen bg-[#ebebeb] flex justify-center items-center gap-4 pt-10 absolute z-4'>
      <div className='overlay bg-[#F8F8F8] min-w-[400px] max-w-[600px] rounded-2xl px-4 py-6 flex flex-col items-center justify-evenly gap-4'>
        <ToastContainer/>
           {authMessage && <span className="authMessage font-bold text-red-600">{authMessage}</span>}
        <div className='usersContainer flex flex-row justify-around items-center rounded-xl p-1 px-1 w-3/4 border-1 border-[#929090]'>
          {roles.map(roleOption => (
            <span
              key={roleOption}
              className={`role rounded-xl text-sm md:text-lg md:p-1 md:px-2 cursor-pointer ${
                formData.role === roleOption ? 'bg-[#3399FF]' : 'bg-transparent'
              }`}
              onClick={() =>
                setFormData(prev => ({ ...prev, role: roleOption }))
              }
            >
              {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}