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
      const res = await axios.get(`http://localhost:4000/users?email=${email}&password=${password}`)
      if (res.data.length === 0) throw new Error('Email yoki parol noto\'g\'ri')
      return res.data[0]
    },
    onSuccess: async (userData) => {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || []
      const guestLikes = JSON.parse(localStorage.getItem('guestLikes')) || []

      try {
        if (guestCart.length > 0 || guestLikes.length > 0) {
          const mergedLikes = [...new Set([...(userData.likes || []), ...guestLikes])]

          const mergedBasket = [...(userData.basket || [])]
          guestCart.forEach(gItem => {
            const existing = mergedBasket.find(uItem => uItem.productId === gItem.productId)
            if (existing) {
              existing.quantity += gItem.quantity
            } else {
              const nextId = mergedBasket.length > 0 ? Math.max(...mergedBasket.map(i => i.id)) + 1 : 1
              mergedBasket.push({ ...gItem, id: nextId })
            }
          })

          const updatedRes = await axios.patch(`http://localhost:4000/users/${userData.id}`, {
            basket: mergedBasket,
            likes: mergedLikes
          })

          login(updatedRes.data)
          localStorage.removeItem('guestCart')
          localStorage.removeItem('guestLikes')
          toast.success(`Xaridlar birlashtirildi! Xush kelibsiz, ${updatedRes.data.name}! 🎉`)
        } else {
          login(userData)
          toast.success(`Xush kelibsiz, ${userData.name}! 🎉`)
        }
      } catch {
        login(userData)
        toast.success(`Xush kelibsiz, ${userData.name}! 🎉`)
      }

      navigate(userData.isAdmin ? '/admin' : '/')
    },
    onError: (error) => {
      toast.error(error.message || 'Server bilan ulanishda xatolik')
    }
  })
}
