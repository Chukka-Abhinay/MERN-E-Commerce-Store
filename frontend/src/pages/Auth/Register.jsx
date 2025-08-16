import { useState, useEffect } from "react"
import { Link , useLocation , useNavigate } from "react-router"
import { useDispatch , useSelector } from "react-redux"
import Loader from "../../components/Loader"
import { setCredientials } from "../../redux/feature/auth/authSlice"
import { toast } from "react-toastify"
import { useRegisterMutation } from "../../redux/Api/userApiSlice"

const Register = () => {
  const [userName, setUsername] = useState("") 
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [register,{isLoading}] = useRegisterMutation()
  const {userInfo} = useSelector((state) => state.auth)

  const {search} = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get("redirect") || "/"

  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  }, [navigate, userInfo , redirect])

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ userName, email, password }).unwrap();
        dispatch(setCredientials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <section className="pl-[10rem] flex flex-wrap">
      <div className="mr-[4rem] mt-[5rem] ">
        <h1 className="text-2xl font-semibold md-4">Register</h1>
        <form className="container w-[40rem]  " onSubmit={submitHandler}>
          <div className="my-[2rem] ">
            <label htmlFor="name" className="block text-sm font-medium text-white" >
              Name
            </label>
            <input type="text" autoComplete="new-password" id="name" className="mt-1 p-2 rounded w-full bg-amber-50" placeholder="Enter your name" value={userName} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="my-[2rem] ">
            <label htmlFor="email" className="block text-sm font-medium text-white" >
              Email
            </label>
            <input type="email" autoComplete="new-password" id="email" className="mt-1 p-2 rounded w-full bg-amber-50" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="my-[2rem] ">
            <label htmlFor="password"  className="block text-sm font-medium text-white" >
              Password
            </label>
            <input type="password" autoComplete="new-password" id="password" className="mt-1 p-2 rounded w-full bg-amber-50" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="my-[2rem] ">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white" >
              Confirm Password
            </label>
            <input type="password" autoComplete="new-password" id="confirmPassword" className="mt-1 p-2 rounded w-full bg-amber-50" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <button disabled={isLoading} type="submit" className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]  ">
            {isLoading ? "Registering..." : "Register"}
          </button>
          {isLoading && <Loader/>}
        </form>
        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      
    </section>
  )
}

export default Register