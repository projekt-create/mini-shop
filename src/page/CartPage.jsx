import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useGetProducts } from '../hooks/get/useGetProducts'
import { useChangeCartQty, useRemoveFromCart } from '../hooks/useCartAndLike'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'

const CartPage = () => {
  const { user } = useAuth()
  const { data: products = [], isSuccess } = useGetProducts()
  const changeQtyMutation = useChangeCartQty()
  const removeMutation = useRemoveFromCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  const basket = user.basket || []
  const getProduct = (productId) => products.find(p => p.id === productId)

  const totalPrice = basket.reduce((sum, item) => {
    const product = getProduct(item.productId)
    if (!product) return sum
    const discountedPrice = Math.round(product.price * (1 - product.discount / 100))
    return sum + discountedPrice * item.quantity
  }, 0)

  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-black/95 py-5'>
      <Navbar />

      <div className='w-full max-w-5xl px-5 mt-28 mb-10'>
        <div className='flex items-center gap-4 mb-8'>
          <button onClick={() => navigate('/')} className='flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm'>
            <FiArrowLeft /> Orqaga
          </button>
          <h1 className='text-2xl font-bold text-white flex items-center gap-3'>
            <FiShoppingBag className='text-sky-400' /> Savat
            {totalItems > 0 && <span className='bg-sky-500 text-white text-xs font-bold px-2.5 py-1 rounded-full'>{totalItems}</span>}
          </h1>
        </div>

        {basket.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 gap-5'>
            <div className='text-7xl'>🛒</div>
            <p className='text-white/50 text-lg'>Savatingiz bo'sh</p>
            <button onClick={() => navigate('/')} className='px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all duration-300'>
              Mahsulotlarga o'tish
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 flex flex-col gap-4'>
              {isSuccess && basket.map(item => {
                const product = getProduct(item.productId)
                if (!product) return null
                const discountedPrice = Math.round(product.price * (1 - product.discount / 100))
                return (
                  <div key={item.id} className='flex gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:border-white/20 transition-all'>
                    <img src={product.image} alt={product.title} className='w-24 h-24 rounded-xl object-cover shrink-0' />
                    <div className='flex-1 flex flex-col gap-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <p className='text-white font-bold text-base'>{product.title}</p>
                          <p className='text-white/40 text-xs'>{product.category}</p>
                        </div>
                        <button onClick={() => removeMutation.mutate(item.productId)} disabled={removeMutation.isPending} className='text-white/30 hover:text-red-400 transition-colors p-1'>
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className='flex items-center justify-between mt-auto'>
                        <p className='text-sky-400 font-bold text-base'>{(discountedPrice * item.quantity).toLocaleString('uz-UZ')} so'm</p>
                        <div className='flex items-center gap-2'>
                          <button onClick={() => changeQtyMutation.mutate({ productId: item.productId, delta: -1 })} disabled={changeQtyMutation.isPending} className='w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all'>
                            <FiMinus className='text-sm' />
                          </button>
                          <span className='text-white font-bold w-6 text-center'>{item.quantity}</span>
                          <button onClick={() => changeQtyMutation.mutate({ productId: item.productId, delta: 1 })} disabled={changeQtyMutation.isPending} className='w-8 h-8 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 flex items-center justify-center text-sky-400 transition-all'>
                            <FiPlus className='text-sm' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='lg:col-span-1'>
              <div className='sticky top-28 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur flex flex-col gap-4'>
                <h2 className='text-white font-bold text-lg'>Buyurtma jami</h2>
                <div className='flex flex-col gap-3 border-b border-white/10 pb-4'>
                  {isSuccess && basket.map(item => {
                    const product = getProduct(item.productId)
                    if (!product) return null
                    const dp = Math.round(product.price * (1 - product.discount / 100))
                    return (
                      <div key={item.id} className='flex justify-between text-sm'>
                        <span className='text-white/60 truncate max-w-[140px]'>{product.title} × {item.quantity}</span>
                        <span className='text-white font-medium'>{(dp * item.quantity).toLocaleString('uz-UZ')}</span>
                      </div>
                    )
                  })}
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-white/60 font-medium'>Jami:</span>
                  <span className='text-sky-400 font-bold text-xl'>{totalPrice.toLocaleString('uz-UZ')} so'm</span>
                </div>
                <button onClick={() => toast.success("Buyurtma jonatildi! Tez orada siz bilan bog'lanamiz 🚀")} className='w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all duration-300 active:scale-95'>
                  Buyurtma berish
                </button>
                <button onClick={() => navigate('/')} className='w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 font-medium rounded-xl transition-all duration-300 text-sm'>
                  Xarid qilishni davom ettirish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default CartPage
