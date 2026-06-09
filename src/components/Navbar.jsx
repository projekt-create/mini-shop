import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaShop } from 'react-icons/fa6'
import { FiShoppingCart, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartCount = (user?.basket || []).reduce((s, i) => s + i.quantity, 0)
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    toast.success("Chiqildi!")
    navigate('/')
  }

  return (
    <div
      className='h-15 fixed top-4 flex items-center px-5 gap-6 justify-between rounded-4xl backdrop-blur-lg border-2 border-white/10 bg-white/10 transition-all duration-500 ease-in-out z-50'
      style={isScrolled ? { width: '580px' } : { width: '700px' }}
    >
      <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
        <FaShop className='text-[22px] text-sky-400' />
        <h1 className='text-[18px] font-bold text-white hover:text-sky-400 transition-colors'>TechUz</h1>
      </div>

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
            <button
              className={`relative flex items-center gap-1.5 text-[13px] font-bold py-2 px-3 rounded-full border transition-all duration-300 ${isActive('/cart') ? 'bg-sky-500 text-white border-sky-500' : 'border-white/15 text-white hover:bg-sky-800'}`}
              onClick={() => navigate('/cart')}
            >
              <FiShoppingCart />
              Savat
              {cartCount > 0 && (
                <span className='absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1'>
                  {cartCount}
                </span>
              )}
            </button>

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
  )
}

export default Navbar
