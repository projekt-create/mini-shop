import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaShop } from 'react-icons/fa6'
import { FiShoppingCart, FiLogOut, FiHeart } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const guestCart = JSON.parse(localStorage.getItem('guestCart')) || []
  const guestLikes = JSON.parse(localStorage.getItem('guestLikes')) || []
  const cartCount = (user ? (user.basket || []) : guestCart).length
  const likesCount = (user ? (user.likes || []) : guestLikes).length
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    toast.success("Chiqildi!")
    navigate('/')
  }
  
  const [width, setWidth] = useState(window.innerWidth)

  const WindowSize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', WindowSize)
    return () => {
      window.removeEventListener('resize', WindowSize)
    }
  }, [])

  return (
    <div
      className='h-15 fixed top-4 flex items-center px-5 gap-6 justify-between rounded-4xl backdrop-blur-lg border-2 border-white/10 bg-white/10 transition-all duration-500 ease-in-out z-50'
      style={width < 700 ? isScrolled ? {width: '85%'} : {width: '95%'} : isScrolled ? { width: '580px' } : { width: '700px' }}
    >
      <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
        <FaShop className='text-[22px] text-sky-400' />
        <h1 className='text-[18px] font-bold text-white hover:text-sky-400 transition-colors'>TechUz</h1>
      </div>

      {width < 700 && (
        <div onClick={() => setIsOpen(!isOpen)} className='flex flex-col items-center gap-1'>
          <div className='w-5 h-0.5 rounded border border-white'></div>
          <div className='w-5 h-0.5 rounded border border-white'></div>
          <div className='w-5 h-0.5 rounded border border-white'></div>
        </div>
      )}  

      {width > 700 && (
        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-4'>
              <p
                className={`text-[14px] font-medium cursor-pointer transition-colors ${isActive('/') ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
                onClick={() => navigate('/')}
              >
                Home
              </p>
              <p
                className={`text-[14px] font-medium cursor-pointer transition-colors ${isActive('/') ? 'text-white/70' : 'text-white/70 hover:text-white'}`}
                onClick={() => { navigate('/'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
              >
                Products
              </p>
            </div>

          <div className='flex items-center gap-2'>
            <button
              className={`relative flex items-center gap-1.5 text-[13px] font-bold py-2 px-3 rounded-full border transition-all duration-300 ${isActive('/wishlist') ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'border-white/15 text-white hover:bg-red-800/40'}`}
              onClick={() => navigate('/wishlist')}
            >
              <FiHeart className={isActive('/wishlist') ? 'fill-white' : ''} />
              Sevimlilar
              {likesCount > 0 && (
                <span className='absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 border border-black/20'>
                  {likesCount}
                </span>
              )}
            </button>

            <button
              className={`relative flex items-center gap-1.5 text-[13px] font-bold py-2 px-3 rounded-full border transition-all duration-300 ${isActive('/cart') ? 'bg-sky-500 text-white border-sky-500' : 'border-white/15 text-white hover:bg-sky-800'}`}
              onClick={() => navigate('/cart')}
            >
              <FiShoppingCart />
              Savat
              {cartCount > 0 && (
                <span className='absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-sky-500 text-white text-[10px] font-bold rounded-full px-1 border border-black/20'>
                  {cartCount}
                </span>
              )}
            </button>


            {user ? (
              <>
                {user.isAdmin && (
                  <button
                    className={`text-[13px] font-bold py-2 px-3 rounded-full border transition-all duration-300 ${isActive('/admin') ? 'bg-sky-500 text-white border-sky-500' : 'border-white/15 text-white hover:bg-sky-800'}`}
                    onClick={() => navigate('/admin')}
                  >
                    Admin
                  </button>
                )}

                <div className='flex items-center gap-1 ml-1'>
                  <div className='w-7 h-7 rounded-full bg-linear-to-br from-sky-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold'>
                    {user.name.charAt(0)}
                  </div>
                  <button
                    onClick={handleLogout}
                    className='text-white/40 hover:text-red-400 transition-colors p-1'
                    title='Chiqish'
                  >
                    <FiLogOut className='text-base' />
                  </button>
                </div>
              </>
            ) : (
              <button
                className='border border-white/15 rounded-full text-white font-bold py-2 px-4 hover:bg-sky-800 transition-all duration-300 text-[13px]'
                onClick={() => navigate('/login')}
              >
                Kirish
              </button>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div className='w-[80%] h-screen bg-black/95 fixed top-0 left-0 flex flex-col items-center justify-center gap-5'>
          <div className='flex flex-col items-center gap-4'>
            <p
              className={`text-[14px] font-medium cursor-pointer transition-colors ${isActive('/') ? 'text-sky-400' : 'text-white/70 hover:text-white'}`}
              onClick={() => { navigate('/'); setIsOpen(false) }}
            >
              Home
            </p>
            <p
              className={`text-[14px] font-medium cursor-pointer transition-colors ${isActive('/') ? 'text-white/70' : 'text-white/70 hover:text-white'}`}
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100); setIsOpen(false) }}
            >
              Products
            </p>
          </div>

          <div className='flex flex-col items-center gap-3 w-full px-10'>
            <button
              className={`relative flex items-center justify-center gap-2 w-full py-3 rounded-xl border transition-all ${isActive('/wishlist') ? 'bg-red-500 text-white border-red-500' : 'border-white/10 text-white bg-white/5'}`}
              onClick={() => { navigate('/wishlist'); setIsOpen(false) }}
            >
              <FiHeart className={isActive('/wishlist') ? 'fill-white' : ''} />
              Sevimlilar
              {likesCount > 0 && <span className='bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>{likesCount}</span>}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 w-full py-3 rounded-xl border transition-all ${isActive('/cart') ? 'bg-sky-500 text-white border-sky-500' : 'border-white/10 text-white bg-white/5'}`}
              onClick={() => { navigate('/cart'); setIsOpen(false) }}
            >
              <FiShoppingCart />
              Savat
              {cartCount > 0 && <span className='bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>{cartCount}</span>}
            </button>
          </div>

          {user ? (
            <div className='flex flex-col items-center gap-4 mt-4'>
              {user.isAdmin && (
                <button
                  className='text-white/70 font-medium'
                  onClick={() => { navigate('/admin'); setIsOpen(false) }}
                >
                  Admin Panel
                </button>
              )}
              <div className='flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10'>
                <div className='w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold'>
                  {user.name.charAt(0)}
                </div>
                <span className='text-white text-sm'>{user.name}</span>
                <button onClick={handleLogout} className='text-red-400 p-1'>
                  <FiLogOut />
                </button>
              </div>
            </div>
          ) : (
            <button
              className='mt-4 w-full max-w-[200px] py-3 bg-sky-500 text-white font-bold rounded-xl'
              onClick={() => { navigate('/login'); setIsOpen(false) }}
            >
              Kirish
            </button>
          )}
        </div>
      )}

      {isOpen && (
        <div 
          className='w-full h-screen fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-[-1]' 
          onClick={() => setIsOpen(false)}
        />
      )}

    </div>
  )
}

export default Navbar
