import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const {isSeller,setIsSeller,navigate,axios} = useAppContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



 const onSubmitHandler = async (event) => { 
    try {
      event.preventDefault();
      const {data} = await axios.post('/api/seller/login', {email, password})
      if(data.success){
        setIsSeller(true);
        navigate("/seller")
  
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    
  }




  useEffect(()=> {
    if(isSeller){
      navigate("/seller")
    }
  },[isSeller])



  return  !isSeller && (
    <form onSubmit={onSubmitHandler} className="max-w-md mx-auto mt-40 p-6 bg-white rounded-md shadow-md">
    <div>
      <p className='text-2xl font-medium text-center mb-6'><span className='text-primary'>Seller</span> Login</p>
  
      <div className="mb-4">
        <input
        onChange={(e)=>setEmail(e.target.value)} value={email}
          type="email"
          id="email"
          placeholder='Email'
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
  
      <div className="mb-6">
        <input
          onChange={(e)=>setPassword(e.target.value)} value={password}
          type="password"
          id="password"
          placeholder='Password'
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
  
      <button
        type="submit"
        className="bg-primary hover:bg-primary-dull text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
        Login
      </button>
    </div>
  </form>
  )
}

export default SellerLogin
