import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductsId } from '../hooks/get/useGetProductsId'
import { useGetProducts } from '../hooks/get/useGetProducts'
import { useAuth } from '../context/AuthContext'
import { useAddToCart, useChangeCartQty, useToggleLike } from '../hooks/useCartAndLike'
import { 
  FiHeart, FiShoppingCart, FiStar, FiMinus, FiPlus, 
  FiArrowLeft, FiPackage, FiTruck, FiShield, FiMessageSquare,
  FiChevronRight, FiChevronLeft 
} from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'

const Skeleton = () => (
  <div className='min-h-screen pt-24 pb-16 px-4 sm:px-6 animate-pulse'>
    <div className='max-w-6xl mx-auto'>
      <div className='w-24 h-6 bg-white/10 rounded-full mb-8'></div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
        <div className='aspect-square rounded-2xl bg-white/5 border border-white/10'></div>
        <div className='flex flex-col gap-6'>
          <div className='flex gap-3'>
            <div className='w-20 h-7 bg-white/10 rounded-full'></div>
            <div className='w-16 h-7 bg-white/10 rounded-full'></div>
          </div>
          <div className='w-3/4 h-10 bg-white/10 rounded-xl'></div>
          <div className='space-y-3'>
            <div className='w-full h-4 bg-white/5 rounded'></div>
            <div className='w-full h-4 bg-white/5 rounded'></div>
            <div className='w-2/3 h-4 bg-white/5 rounded'></div>
          </div>
          <div className='w-1/2 h-12 bg-white/10 rounded-xl mt-4'></div>
          <div className='flex gap-4 mt-6'>
            <div className='flex-1 h-14 bg-white/10 rounded-xl'></div>
            <div className='w-14 h-14 bg-white/10 rounded-xl'></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const ViewCart = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, isError } = useGetProductsId(id)
  const { data: allProducts } = useGetProducts()
  const { user } = useAuth()
  
  const addToCartMutation = useAddToCart()
  const changeQtyMutation = useChangeCartQty()
  const toggleLikeMutation = useToggleLike()

  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setActiveImg(0)
    window.scrollTo(0, 0)
  }, [id])

  const guestCart = JSON.parse(localStorage.getItem('guestCart')) || []
  const guestLikes = JSON.parse(localStorage.getItem('guestLikes')) || []

  const isLiked = (pid) => {
    if (user) return (user.likes || []).includes(pid)
    return guestLikes.includes(pid)
  }

  const getInCart = (pid) => {
    const basket = user ? (user.basket || []) : guestCart
    return basket.find(item => item.productId === pid)
  }

  if (isLoading) return <Skeleton />

  if (isError || !product) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center p-6 text-center'>
        <div className='w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6'>
          <FiPackage className='text-red-500 text-4xl' />
        </div>
        <h2 className='text-2xl font-bold text-white mb-2'>Mahsulot topilmadi</h2>
        <p className='text-white/50 mb-8'>Ushbu mahsulot mavjud bo'lmasligi yoki o'chirib tashlangan bo'lishi mumkin.</p>
        <button 
          onClick={() => navigate('/')}
          className='px-8 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition-all active:scale-95'
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    )
  }

  const inCart = getInCart(product.id)
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100))
  const images = product.img || [product.image]
  
  const recommended = allProducts 
    ? allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
    : []

  return (
    <div className='min-h-screen pt-24 pb-16 px-4 sm:px-6 bg-[#050505]'>
      <div className='max-w-6xl mx-auto'>
        
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-white/40 hover:text-sky-400 transition-colors mb-8 group'
        >
          <FiArrowLeft className='group-hover:-translate-x-1 transition-transform' />
          <span className='text-sm font-medium'>Orqaga qaytish</span>
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16'>
          
          <div className='space-y-6'>
            <div className='relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur group'>
               {product.discount > 0 && (
                <div className='absolute top-6 left-6 z-10'>
                  <span className='bg-sky-500 text-white text-sm font-black px-3.5 py-1.5 rounded-full shadow-xl shadow-sky-500/30'>
                    -{product.discount}%
                  </span>
                </div>
              )}
              
              <button 
                onClick={() => toggleLikeMutation.mutate(product.id)}
                className='absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-red-500 transition-all active:scale-90 group/heart'
              >
                {isLiked(product.id) ? (
                  <FaHeart className='text-red-500 text-2xl drop-shadow-lg' />
                ) : (
                  <FiHeart className='text-white/60 text-2xl group-hover/heart:text-red-400' />
                )}
              </button>

              <img 
                src={images[activeImg]} 
                alt={product.title}
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
              />

              {images.length > 1 && (
                <div className='absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none'>
                  <button 
                    onClick={() => setActiveImg(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className='w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-sky-500/80 transition-all opacity-0 group-hover:opacity-100'
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImg(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className='w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-sky-500/80 transition-all opacity-0 group-hover:opacity-100'
                  >
                    <FiChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className='flex gap-4 overflow-x-auto pb-2 scrollbar-hide'>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`relative w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImg === idx ? 'border-sky-500 ring-4 ring-sky-500/20' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt='' className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center gap-3 mb-4'>
              <span className='px-4 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold tracking-widest uppercase'>
                {product.category}
              </span>
              <div className='flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10'>
                <FiStar size={14} className='text-yellow-400 fill-yellow-400' />
                <span className='text-white/80 text-sm font-bold'>{product.rating}</span>
                <span className='text-white/30 text-xs font-medium'>| {product.comments?.length || 0} reviews</span>
              </div>
            </div>

            <h1 className='text-3xl sm:text-4xl font-black text-white mb-6 leading-tight'>{product.title}</h1>

            <div className='flex items-baseline gap-4 mb-8'>
              <span className='text-4xl font-black text-sky-400'>
                {discountedPrice.toLocaleString('uz-UZ')} <span className='text-xl'>so'm</span>
              </span>
              {product.discount > 0 && (
                <span className='text-xl text-white/20 line-through font-bold'>
                  {product.price.toLocaleString('uz-UZ')}
                </span>
              )}
            </div>

            <p className='text-white/50 text-lg leading-relaxed mb-8 font-medium'>
              {product.description}
            </p>

            <div className='grid grid-cols-2 gap-4 mb-10'>
              <div className='p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-sky-500/30 transition-colors'>
                <div className='flex items-center gap-3 mb-1'>
                  <div className='p-2 rounded-lg bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all'>
                    <FiPackage />
                  </div>
                  <span className='text-white/40 text-sm font-bold'>Omborda</span>
                </div>
                <p className='text-white font-black text-lg'>{product.count || 0} ta mavjud</p>
              </div>
              <div className='p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-sky-500/30 transition-colors'>
                <div className='flex items-center gap-3 mb-1'>
                  <div className='p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all'>
                    <FiTruck />
                  </div>
                  <span className='text-white/40 text-sm font-bold'>Yetkazish</span>
                </div>
                <p className='text-white font-black text-lg'>Bepul</p>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 mb-12'>
              {inCart ? (
                <div className='flex-1 flex items-center justify-between p-2 rounded-2xl bg-sky-500/10 border border-sky-500/30 backdrop-blur-sm'>
                  <button
                    onClick={() => changeQtyMutation.mutate({ productId: product.id, delta: -1 })}
                    className='w-14 h-14 flex items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white transition-all shadow-inner'
                  >
                    <FiMinus size={20} strokeWidth={3} />
                  </button>
                  <span className='text-2xl font-black text-white px-8'>{inCart.quantity}</span>
                  <button
                    onClick={() => changeQtyMutation.mutate({ productId: product.id, delta: 1 })}
                    className='w-14 h-14 flex items-center justify-center rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/40'
                  >
                    <FiPlus size={20} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCartMutation.mutate(product.id)}
                  disabled={addToCartMutation.isPending}
                  className='flex-1 py-5 rounded-2xl bg-sky-500 hover:bg-white text-white hover:text-black font-black text-lg transition-all active:scale-95 shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3 group'
                >
                  <FiShoppingCart className='group-hover:scale-110 transition-transform' />
                  {addToCartMutation.isPending ? "Qo'shilmoqda..." : "Savatga qo'shish"}
                </button>
              )}
            </div>

            <div className='flex items-center gap-6 text-white/40 text-sm font-bold'>
              <div className='flex items-center gap-2'>
                <FiShield className='text-sky-500' />
                <span>1 yil kafolat</span>
              </div>
              <div className='flex items-center gap-2'>
                <FiPackage className='text-sky-500' />
                <span>Xavfsiz qadoq</span>
              </div>
            </div>
          </div>
        </div>

        {product.comments && product.comments.length > 0 && (
          <div className='mt-24'>
            <div className='flex items-center gap-4 mb-10'>
              <div className='w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400'>
                <FiMessageSquare size={28} />
              </div>
              <div>
                <h3 className='text-2xl font-black text-white'>Fikr-mulohazalar</h3>
                <p className='text-white/40 text-sm font-bold'>{product.comments.length} ta izoh qoldirilgan</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {product.comments.map((comment, idx) => (
                <div key={idx} className='p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative group hover:border-sky-500/30 transition-all'>
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg'>
                        {comment.user[0]}
                      </div>
                      <div>
                        <h4 className='text-white font-bold'>{comment.user}</h4>
                        <div className='flex gap-1 mt-1'>
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              size={12} 
                              className={i < comment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className='text-white/60 leading-relaxed italic'>"{comment.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

          {recommended.length > 0 && (
          <div className='mt-32'>
            <div className='flex items-center justify-between mb-10'>
              <h3 className='text-3xl font-black text-white'>Sizga yoqishi mumkin</h3>
              <button onClick={() => navigate('/')} className='text-sky-400 font-bold flex items-center gap-2 hover:underline'>
                Hamasini ko'rish <FiChevronRight />
              </button>
            </div>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {recommended.map(item => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className='group cursor-pointer'
                >
                  <div className='aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 mb-4 relative'>
                    <img src={item.image} alt={item.title} className='w-full h-full object-cover group-hover:scale-110 transition-all duration-700' />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <span className='bg-white text-black px-4 py-2 rounded-full text-xs font-black shadow-xl'>Ko'rish</span>
                    </div>
                  </div>
                  <h4 className='text-white font-bold group-hover:text-sky-400 transition-colors truncate px-1'>{item.title}</h4>
                  <p className='text-sky-400 font-black px-1 mt-1'>
                    {Math.round(item.price * (1 - item.discount / 100)).toLocaleString('uz-UZ')} so'm
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ViewCart
