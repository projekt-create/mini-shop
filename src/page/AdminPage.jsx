import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGetProducts } from '../hooks/get/useGetProducts'
import { useGetUsers } from '../hooks/get/useGetUsers'
import { useProductMutations, useUserMutations } from '../hooks/mutations/useAdminMutations'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  FiPackage, FiUsers, FiGrid, FiPlus, FiEdit2, FiTrash2,
  FiX, FiCheck, FiShoppingBag, FiDollarSign, FiShield, FiUser
} from 'react-icons/fi'

const TABS = ['Dashboard', 'Mahsulotlar', 'Foydalanuvchilar']
const emptyProduct = { title: '', description: '', price: '', image: '', category: '', categoryId: '', discount: '', rating: '' }
const emptyUser = { name: '', email: '', password: '', isAdmin: false }

export default function AdminPage() {
  const { user: me } = useAuth()
  const navigate = useNavigate()
  const { data: products = [], isSuccess: pOk } = useGetProducts()
  const { data: users = [], isSuccess: uOk } = useGetUsers()
  const pMutations = useProductMutations()
  const uMutations = useUserMutations()

  const [tab, setTab] = useState('Dashboard')
  const [pModal, setPModal] = useState(null)
  const [pForm, setPForm] = useState(emptyProduct)
  const [pDelId, setPDelId] = useState(null)
  const [uModal, setUModal] = useState(null)
  const [uForm, setUForm] = useState(emptyUser)
  const [uDelId, setUDelId] = useState(null)

  useEffect(() => {
    if (!me) { navigate('/login'); return }
    if (!me.isAdmin) navigate('/')
  }, [me, navigate])

  if (!me || !me.isAdmin) return null

  const cartTotal = users.reduce((s, u) =>
    s + (u.basket || []).reduce((ss, b) => {
      const p = products.find(x => x.id === b.productId)
      return p ? ss + Math.round(p.price * (1 - (p.discount || 0) / 100)) * b.quantity : ss
    }, 0), 0)

  const openAddP = () => { setPForm(emptyProduct); setPModal('add') }
  const openEditP = (p) => {
    setPForm({ ...p, price: String(p.price), discount: String(p.discount || 0), rating: String(p.rating || 4.5), categoryId: String(p.categoryId || 1) })
    setPModal({ edit: p })
  }
  const closePModal = () => { setPModal(null); setPForm(emptyProduct) }

  const saveProduct = () => {
    const body = { ...pForm, price: +pForm.price, discount: +pForm.discount || 0, rating: +pForm.rating || 4.5, categoryId: +pForm.categoryId || 1 }
    if (pModal === 'add') pMutations.add.mutate(body, { onSuccess: closePModal })
    else pMutations.update.mutate({ ...body, id: pModal.edit.id }, { onSuccess: closePModal })
  }

  const openAddU = () => { setUForm(emptyUser); setUModal('add') }
  const openEditU = (u) => {
    setUForm({ name: u.name, email: u.email, password: u.password || '', isAdmin: !!u.isAdmin })
    setUModal({ edit: u })
  }
  const closeUModal = () => { setUModal(null); setUForm(emptyUser) }

  const saveUser = () => {
    if (uModal === 'add') uMutations.add.mutate(uForm, { onSuccess: closeUModal })
    else uMutations.update.mutate({ ...users.find(u => u.id === uModal.edit.id), ...uForm }, { onSuccess: closeUModal })
  }

  const inp = 'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-sky-400 transition-colors w-full'

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-black/95 py-5'>
      <Navbar />
      <div className='w-full max-w-6xl px-5 mt-28 mb-10'>
        <div className='mb-8 text-white'>
          <h1 className='text-3xl font-bold'>Admin Panel</h1>
          <p className='text-white/40 text-sm mt-1'>TechUz boshqaruv paneli</p>
        </div>
        <div className='flex gap-2 mb-8 border-b border-white/10'>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-t-xl font-medium text-sm transition-all ${tab === t ? 'bg-sky-500 text-white' : 'text-white/50 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Dashboard' && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {[
              { label: 'Mahsulotlar', value: products.length, icon: <FiPackage />, cls: 'bg-sky-500/20 text-sky-400' },
              { label: 'Foydalanuvchilar', value: users.length, icon: <FiUsers />, cls: 'bg-purple-500/20 text-purple-400' },
              { label: 'Kategoriyalar', value: 4, icon: <FiGrid />, cls: 'bg-emerald-500/20 text-emerald-400' },
              { label: "Savat qiymati", value: cartTotal.toLocaleString('uz-UZ') + " so'm", icon: <FiDollarSign />, cls: 'bg-amber-500/20 text-amber-400' },
            ].map((s, i) => (
              <div key={i} className='p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col gap-3'>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.cls}`}>{s.icon}</div>
                <div>
                  <p className='text-white/50 text-xs'>{s.label}</p>
                  <p className='text-white font-bold text-xl mt-0.5'>{s.value}</p>
                </div>
              </div>
            ))}
            <div className='col-span-full p-6 rounded-2xl border border-white/10 bg-white/5'>
              <h2 className='text-white font-bold text-lg mb-4 flex items-center gap-2'><FiShoppingBag className='text-sky-400' /> So'nggi mahsulotlar</h2>
              <div className='grid gap-3'>
                {pOk && products.slice(0, 5).map(p => (
                  <div key={p.id} className='flex items-center gap-4 p-3 rounded-xl bg-white/5'>
                    <img src={p.image} alt={p.title} className='w-12 h-12 rounded-lg object-cover shrink-0' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-white font-medium text-sm truncate'>{p.title}</p>
                      <p className='text-white/40 text-xs'>{p.category}</p>
                    </div>
                    <p className='text-sky-400 font-bold text-sm whitespace-nowrap'>{p.price.toLocaleString('uz-UZ')} so'm</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'Mahsulotlar' && (
          <div>
            <div className='flex justify-between items-center mb-5 text-white'>
              <h2 className='font-bold text-xl'>Mahsulotlar ({products.length})</h2>
              <button onClick={openAddP} className='flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 font-bold rounded-xl transition-all text-sm'>
                <FiPlus /> Yangi mahsulot
              </button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {pOk && products.map(p => (
                <div key={p.id} className='flex flex-col gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all'>
                  <img src={p.image} alt={p.title} className='w-full h-44 rounded-xl object-cover' />
                  <div className='flex-1'>
                    <p className='text-white font-bold'>{p.title}</p>
                    <p className='text-white/40 text-xs mt-1'>{p.category} • ⭐{p.rating}</p>
                    <div className='flex items-center gap-2 mt-2'>
                      <p className='text-sky-400 font-bold text-sm'>{Math.round(p.price * (1 - (p.discount || 0) / 100)).toLocaleString('uz-UZ')} so'm</p>
                      {p.discount > 0 && <span className='text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full'>-{p.discount}%</span>}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button onClick={() => openEditP(p)} className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-all'>
                      <FiEdit2 className='text-xs' /> Tahrirlash
                    </button>
                    <button onClick={() => setPDelId(p.id)} className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-all'>
                      <FiTrash2 className='text-xs' /> O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Foydalanuvchilar' && (
          <div>
            <div className='flex justify-between items-center mb-5 text-white'>
              <h2 className='font-bold text-xl'>Foydalanuvchilar ({users.length})</h2>
              <button onClick={openAddU} className='flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 font-bold rounded-xl transition-all text-sm'>
                <FiPlus /> Yangi foydalanuvchi
              </button>
            </div>
            <div className='flex flex-col gap-3'>
              {uOk && users.map(u => (
                <div key={u.id} className='flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all'>
                  <div className='w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg shrink-0'>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='text-white font-bold truncate'>{u.name}</p>
                      {u.isAdmin
                        ? <span className='flex items-center gap-1 text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full shrink-0'><FiShield className='text-[9px]' />Admin</span>
                        : <span className='flex items-center gap-1 text-[10px] bg-white/10 text-white/50 border border-white/10 px-2 py-0.5 rounded-full shrink-0'><FiUser className='text-[9px]' />User</span>}
                    </div>
                    <p className='text-white/40 text-sm truncate'>{u.email}</p>
                  </div>
                  <div className='text-right shrink-0 mr-2 hidden sm:block'>
                    <p className='text-white/60 text-sm'>{(u.basket || []).reduce((s, i) => s + i.quantity, 0)} mahsulot</p>
                    <p className='text-white/40 text-xs'>{(u.likes || []).length} like</p>
                  </div>
                  <div className='flex gap-2 shrink-0'>
                    <button onClick={() => openEditU(u)} className='w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all'>
                      <FiEdit2 className='text-sm' />
                    </button>
                    <button onClick={() => setUDelId(u.id)} className='w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all'>
                      <FiTrash2 className='text-sm' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {pModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
          <div className='w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between text-white'>
              <h2 className='font-bold text-xl'>{pModal === 'add' ? "Yangi mahsulot" : 'Mahsulotni tahrirlash'}</h2>
              <button onClick={closePModal} className='text-white/40 hover:text-white'><FiX className='text-xl' /></button>
            </div>
            {[
              { k: 'title', label: 'Sarlavha', ph: 'iPhone 15 Pro', t: 'text' },
              { k: 'image', label: 'Rasm URL', ph: 'https://...', t: 'text' },
              { k: 'price', label: "Narx", ph: '10990000', t: 'number' },
              { k: 'discount', label: 'Chegirma', ph: '10', t: 'number' },
              { k: 'rating', label: 'Reyting', ph: '4.5', t: 'number' },
              { k: 'category', label: 'Kategoriya', ph: 'Phone', t: 'text' },
              { k: 'categoryId', label: 'ID', ph: '2', t: 'number' },
            ].map(f => (
              <div key={f.k} className='flex flex-col gap-1.5'>
                <label className='text-white/60 text-xs font-medium'>{f.label}</label>
                <input type={f.t} value={pForm[f.k]} onChange={e => setPForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph} className={inp} />
              </div>
            ))}
            <div className='flex flex-col gap-1.5'>
              <label className='text-white/60 text-xs font-medium'>Tavsif</label>
              <textarea value={pForm.description} onChange={e => setPForm(p => ({ ...p, description: e.target.value }))} placeholder="..." rows={3} className={inp + ' resize-none'} />
            </div>
            <div className='flex gap-3 mt-1'>
              <button onClick={closePModal} className='flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all'>Bekor</button>
              <button onClick={saveProduct} disabled={pMutations.add.isPending || pMutations.update.isPending} className='flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all disabled:opacity-50'>
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {uModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
          <div className='w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col gap-4'>
            <div className='flex items-center justify-between text-white'>
              <h2 className='font-bold text-xl'>{uModal === 'add' ? "Yangi foydalanuvchi" : 'Tahrirlash'}</h2>
              <button onClick={closeUModal} className='text-white/40 hover:text-white'><FiX className='text-xl' /></button>
            </div>
            {[
              { k: 'name', label: 'Ism', ph: 'John Doe', t: 'text' },
              { k: 'email', label: 'Email', ph: 'user@example.com', t: 'email' },
              { k: 'password', label: 'Parol', ph: '••••••••', t: 'text' },
            ].map(f => (
              <div key={f.k} className='flex flex-col gap-1.5'>
                <label className='text-white/60 text-xs font-medium'>{f.label}</label>
                <input type={f.t} value={uForm[f.k]} onChange={e => setUForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph} className={inp} />
              </div>
            ))}
            <div className='flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white'>
              <div><p className='font-medium text-sm'>Admin</p></div>
              <button onClick={() => setUForm(p => ({ ...p, isAdmin: !p.isAdmin }))} className={`w-12 h-6 rounded-full transition-all duration-300 relative ${uForm.isAdmin ? 'bg-sky-500' : 'bg-white/20'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${uForm.isAdmin ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            <div className='flex gap-3 mt-1'>
              <button onClick={closeUModal} className='flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all'>Bekor</button>
              <button onClick={saveUser} disabled={uMutations.add.isPending || uMutations.update.isPending} className='flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all disabled:opacity-50'>
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {pDelId && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-center'>
          <div className='w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col gap-5'>
            <div className='text-5xl'>🗑️</div>
            <h3 className='text-white font-bold text-lg'>O'chirishni tasdiqlaysizmi?</h3>
            <div className='flex gap-3'>
              <button onClick={() => setPDelId(null)} className='flex-1 py-2.5 rounded-xl bg-white/10 text-white'>Bekor</button>
              <button onClick={() => pMutations.remove.mutate(pDelId, { onSuccess: () => setPDelId(null) })} className='flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold'>O'chirish</button>
            </div>
          </div>
        </div>
      )}

      {uDelId && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-center'>
          <div className='w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col gap-5'>
            <div className='text-5xl'>👤</div>
            <h3 className='text-white font-bold text-lg'>O'chirishni tasdiqlaysizmi?</h3>
            <div className='flex gap-3'>
              <button onClick={() => setUDelId(null)} className='flex-1 py-2.5 rounded-xl bg-white/10 text-white'>Bekor</button>
              <button onClick={() => uMutations.remove.mutate(uDelId, { onSuccess: () => setUDelId(null) })} className='flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold'>O'chirish</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
