import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGetProducts } from '../hooks/get/useGetProducts'
import { useToggleLike, useAddToCart } from '../hooks/useCartAndLike'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiHeart, FiShoppingCart, FiArrowLeft, FiTrash2 } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import toast from 'react-hot-toast'

const WishlistPage = () => {
  const { user } = useAuth()
  const { data: products = [], isSuccess } = useGetProducts()
  const toggleLikeMutation = useToggleLike()
  const addToCartMutation = useAddToCart()
  const navigate = useNavigate()

  const guestLikes = JSON.parse(localStorage.getItem('guestLikes')) || []
  const likedIds = user ? (user.likes || []) : guestLikes
  
  const likedProducts = products.filter(p => likedIds.includes(p.id))

  const handleAddToCart = (productId) => {
    addToCartMutation.mutate(productId)
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-black/95 py-5'>
      <Navbar />

      <div className='w-full max-w-5xl px-5 mt-28 mb-10'>
        <div className='flex items-center gap-4 mb-8'>
          <button onClick={() => navigate('/')} className='flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm'>
            <FiArrowLeft /> Orqaga
          </button>
          <h1 className='text-2xl font-bold text-white flex items-center gap-3'>
            <FiHeart className='text-red-500 fill-red-500' /> Sevimlilar
            {likedProducts.length > 0 && <span className='bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full'>{likedProducts.length}</span>}
          </h1>
        </div>

        {likedProducts.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 gap-5'>
            <div className='text-7xl shadow-lg shadow-red-500/20 rounded-full p-6 bg-white/5'>❤️</div>
            <p className='text-white/50 text-lg'>Sevimlilar ro'yxati bo'sh</p>
            <button onClick={() => navigate('/')} className='px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all duration-300'>
              Mahsulotlarni ko'rish
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {isSuccess && likedProducts.map(product => {
              const discountedPrice = Math.round(product.price * (1 - product.discount / 100))
              return (
                <div key={product.id} className='relative flex flex-col gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:border-sky-400/30 transition-all group'>
                  <button 
                    onClick={() => toggleLikeMutation.mutate(product.id)}
                    className='absolute top-6 right-6 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur border border-white/10 text-red-500 hover:bg-red-500 hover:text-white transition-all'
                  >
                    <FaHeart />
                  </button>
                  
                  <img src={product.image} alt={product.title} className='w-full h-48 rounded-xl object-cover' />
                  
                  <div className='flex flex-col gap-2'>
                    <p className='text-white font-bold text-lg truncate'>{product.title}</p>
                    <div className='flex items-center gap-2'>
                      <p className='text-sky-400 font-bold text-lg'>{discountedPrice.toLocaleString('uz-UZ')} so'm</p>
                      {product.discount > 0 && (
                        <p className='text-white/30 text-sm line-through'>{product.price.toLocaleString('uz-UZ')}</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addToCartMutation.isPending}
                    className='w-full py-2.5 bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-auto'
                  >
                    <FiShoppingCart /> Savatga qo'shish
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default WishlistPage
