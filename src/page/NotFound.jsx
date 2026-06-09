import { useNavigate } from 'react-router-dom'
import { FaShop } from 'react-icons/fa6'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-black/95 relative overflow-hidden'>
      <div className='absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-sky-600/10 blur-[120px] pointer-events-none' />
      <div className='absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none' />

      <div className='relative z-10 flex flex-col items-center gap-6 text-center px-6'>
        <div className='flex items-center gap-3 mb-2'>
          <FaShop className='text-3xl text-sky-400' />
          <span className='text-2xl font-bold text-white'>TechUz</span>
        </div>

        <div className='relative select-none'>
          <p className='text-[140px] font-black text-white/5 leading-none'>404</p>
          <p className='absolute inset-0 flex items-center justify-center text-[100px] font-black leading-none' style={{background:'linear-gradient(135deg,#38bdf8,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
            404
          </p>
        </div>

        <h2 className='text-2xl sm:text-3xl font-bold text-white -mt-4'>Sahifa topilmadi!</h2>
        <p className='text-white/40 text-base max-w-sm leading-relaxed'>
          Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>

        <div className='flex flex-col sm:flex-row gap-3 mt-2'>
          <button
            onClick={() => navigate(-1)}
            className='px-7 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-300'
          >
            ← Orqaga
          </button>
          <button
            onClick={() => navigate('/')}
            className='px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all duration-300'
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
