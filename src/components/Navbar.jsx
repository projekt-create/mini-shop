import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShop } from "react-icons/fa6";

const Navbar = () => {

  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false);
 
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };
 
  window.addEventListener('scroll', handleScroll);


  return (
    <div className=' h-15 fixed top-4 flex items-center px-5 gap-9 justify-between rounded-4xl backdrop-blur-lg border-2 border-white/10 backdrop-filter bg-white/10 transition-all duration-500 ease-in-out z-50' style={isScrolled ? {width: '560px'} : {width: '600px' }}>
        <div className='flex items-center gap-3'>
            <FaShop className='text-[24px] text-white hover:text-sky-500 transition-all duration-300 ease-in-out cursor-pointer'/>
            <h1 className='text-[20px] font-bold text-white hover:text-sky-400 transition-all duration-300 ease-in-out'>TechUz</h1>
        </div>
        <div className='flex items-center gap-5'>
          <p className="text-[16px] font-normal text-white hover:text-sky-400 transition-all duration-300 ease" onClick={() => navigate('/')} >Home</p>
          <p className="text-[16px] font-normal text-white hover:text-sky-400 transition-all duration-300 ease" onClick={() => navigate('/')} >Products</p>
          <p className="text-[16px] font-normal text-white hover:text-sky-400 transition-all duration-300 ease" onClick={() => navigate('/')} >About</p>
          <p className="text-[16px] font-normal text-white hover:text-sky-400 transition-all duration-300 ease" onClick={() => navigate('/')} >Contact</p>
        </div>
        <div>
          {
            localStorage.getItem('token') ? 
            (localStorage.getItem('isAdmin') ? 
              (
              <>
              <button className='border border-white/15 rounded-full transition-all duration-500 ease-in-out text-white font-bold py-2 px-4 hover:bg-sky-800' onClick={() => navigate('/admin')}>Admin</button>
              <button className='border border-white/15 rounded-full transition-all duration-500 ease-in-out text-white font-bold py-2 px-4 hover:bg-sky-800' onClick={() => navigate('/user')}>Basket</button>
              </>
              )
              : 
              (
              <button className='border border-white/15 rounded-full transition-all duration-500 ease-in-out text-white font-bold py-2 px-4 hover:bg-sky-800' onClick={() => navigate('/user')}>Basket</button>
              )
            ) :
            <button className='border border-white/15 rounded-full transition-all duration-500 ease-in-out text-white font-bold py-2 px-4 hover:bg-sky-800' onClick={() => navigate('/login')}>Login</button>
          }
        </div>
    </div>
  )
}

export default Navbar
