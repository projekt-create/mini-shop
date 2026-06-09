import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLoginMutation } from '../hooks/mutations/useAuthMutations'
import { FaShop } from 'react-icons/fa6'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const loginMutation = useLoginMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/95 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-sky-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaShop className="text-3xl text-sky-400" />
            <h1 className="text-3xl font-bold text-white">TechUz</h1>
          </div>
          <p className="text-white/50 text-sm">Hisobingizga kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-5 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center">Kirish</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/60 font-medium">Email</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-sky-400 transition-all">
              <FiMail className="text-white/40 text-lg flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="bg-transparent outline-none text-white placeholder-white/30 w-full text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/60 font-medium">Parol</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-sky-400 transition-all">
              <FiLock className="text-white/40 text-lg flex-shrink-0" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent outline-none text-white placeholder-white/30 w-full text-sm"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-white/40 hover:text-white transition-colors">
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl px-4 py-3">
            <p className="text-sky-400 text-xs font-medium mb-1">Demo hisoblar:</p>
            <p className="text-white/50 text-xs">Admin: <span className="text-white/70">Ml9wD@example.com</span> / <span className="text-white/70">123456</span></p>
            <p className="text-white/50 text-xs">User: <span className="text-white/70">4cH5w@example.com</span> / <span className="text-white/70">123456</span></p>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Yuklanmoqda...' : 'Kirish'}
          </button>

          <p className="text-center text-white/40 text-sm">
            Saytga qaytish?{' '}
            <Link to="/" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
              Bosh sahifa
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
