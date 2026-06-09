import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const useAddToCart = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId) => {
      if (!user) {
        navigate('/login')
        throw new Error('Not logged in')
      }
      const currentUser = (await axios.get(`http://localhost:4000/users/${user.id}`)).data
      const basket = currentUser.basket || []
      const existing = basket.find(item => item.productId === productId)

      let newBasket
      if (existing) {
        newBasket = basket.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        const newId = basket.length > 0 ? Math.max(...basket.map(i => i.id)) + 1 : 1
        newBasket = [...basket, { id: newId, productId, quantity: 1 }]
      }

      const res = await axios.patch(`http://localhost:4000/users/${user.id}`, { basket: newBasket })
      return res.data
    },
    onSuccess: (data) => {
      updateUser(data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("Savatga qo'shildi!")
    },
    onError: (error) => {
      if (error.message !== 'Not logged in') {
        toast.error('Xatolik yuz berdi')
      }
    }
  })
}

export const useChangeCartQty = () => {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, delta }) => {
      const currentUser = (await axios.get(`http://localhost:4000/users/${user.id}`)).data
      const basket = currentUser.basket || []
      const newBasket = basket
        .map(item => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0)

      const res = await axios.patch(`http://localhost:4000/users/${user.id}`, { basket: newBasket })
      return res.data
    },
    onSuccess: (data) => {
      updateUser(data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })
}

export const useRemoveFromCart = () => {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId) => {
      const currentUser = (await axios.get(`http://localhost:4000/users/${user.id}`)).data
      const basket = (currentUser.basket || []).filter(item => item.productId !== productId)
      const res = await axios.patch(`http://localhost:4000/users/${user.id}`, { basket })
      return res.data
    },
    onSuccess: (data) => {
      updateUser(data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("Mahsulot savatdan olib tashlandi")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })
}

export const useToggleLike = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId) => {
      if (!user) {
        navigate('/login')
        throw new Error('Not logged in')
      }
      const currentUser = (await axios.get(`http://localhost:4000/users/${user.id}`)).data
      const likes = currentUser.likes || []
      const isLiked = likes.includes(productId)
      const newLikes = isLiked ? likes.filter(id => id !== productId) : [...likes, productId]

      const res = await axios.patch(`http://localhost:4000/users/${user.id}`, { likes: newLikes })
      return { data: res.data, isLiked }
    },
    onSuccess: ({ data, isLiked }) => {
      updateUser(data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(isLiked ? "Like olib tashlandi" : "Like qo'shildi ❤️")
    },
    onError: (error) => {
      if (error.message !== 'Not logged in') {
        toast.error('Xatolik yuz berdi')
      }
    }
  })
}
