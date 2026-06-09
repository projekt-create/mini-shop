import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAddToCart, useToggleLike } from '../../hooks/useCartAndLike'
import { useGetProducts } from '../../hooks/get/useGetProducts'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'

const ProductCard = ({ activeCategory }) => {
  const { data, isSuccess } = useGetProducts()
  const { user } = useAuth()
  const addToCartMutation = useAddToCart()
  const toggleLikeMutation = useToggleLike()
  const navigate = useNavigate()

  const filteredData = isSuccess
    ? activeCategory === 'All'
      ? data
      : data.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase())
    : []

  const isLiked = (productId) => (user?.likes || []).includes(productId)

  return (
    <div id='products' className='w-full max-w-6xl mt-10 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {isSuccess && filteredData.map(item => (
        <div
          key={item.id}
          id={`product-${item.id}`}
          className='scroll-mt-24 h-full flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-all duration-300 hover:border-sky-400/60 hover:bg-white/10 hover:shadow-lg hover:shadow-sky-500/10 relative group'
        >
          {item.discount > 0 && (
            <span className='absolute top-6 left-6 z-10 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
              -{item.discount}%
            </span>
          )}

          <button
            onClick={() => toggleLikeMutation.mutate(item.id)}
            disabled={toggleLikeMutation.isPending}
            className='absolute top-6 right-6 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur border border-white/10 hover:border-red-400 transition-all duration-300'
          >
            {user && isLiked(item.id)
              ? <FaHeart className='text-red-500 text-sm' />
              : <FiHeart className='text-white/70 text-sm' />
            }
          </button>

          <div className='relative overflow-hidden rounded-xl'>
            <img
              className='h-[220px] w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105'
              src={item.image}
              alt={item.title}
            />
          </div>

          <div className='flex flex-1 flex-col gap-3'>
            <div className='flex items-center gap-1'>
              <FiStar className='text-yellow-400 text-sm fill-yellow-400' />
              <span className='text-yellow-400 text-sm font-medium'>{item.rating}</span>
              <span className='text-white/30 text-xs ml-1'>({item.category})</span>
            </div>

            <p className="text-[17px] font-bold text-white">{item.title}</p>
            <p className="text-[13px] font-normal leading-6 text-white/60 line-clamp-2">{item.description}</p>

            <div className='flex items-center gap-2 mt-auto'>
              <p className="text-[18px] font-bold text-sky-400">
                {Math.round(item.price * (1 - item.discount / 100)).toLocaleString('uz-UZ')} so'm
              </p>
              {item.discount > 0 && (
                <p className="text-[13px] text-white/30 line-through">
                  {item.price.toLocaleString('uz-UZ')}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCartMutation.mutate(item.id)}
            disabled={addToCartMutation.isPending}
            className='w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500/20 border border-sky-500/30 py-2.5 text-[14px] font-bold text-sky-300 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 ease'
          >
            <FiShoppingCart className='text-base' />
            {addToCartMutation.isPending ? "Qo'shilmoqda..." : "Savatga qo'shish"}
          </button>
        </div>
      ))}
    </div>
  )
}

export default ProductCard
