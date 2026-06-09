import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const useLoginMutation = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await axios.get('http://localhost:4000/users')
      const users = res.data
      const found = users.find(u => u.email === email && u.password === password)
      if (!found) throw new Error("Email yoki parol noto'g'ri!")
      return found
    },
    onSuccess: (user) => {
      login(user)
      toast.success(`Xush kelibsiz, ${user.name}! 🎉`)
      navigate(user.isAdmin ? '/admin' : '/')
    },
    onError: (error) => {
      toast.error(error.message || 'Server bilan ulanishda xatolik')
    }
  })
}
