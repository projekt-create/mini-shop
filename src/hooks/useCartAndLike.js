import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const getGuestCart = () => JSON.parse(localStorage.getItem('guestCart')) || []
const setGuestCart = (basket) => localStorage.setItem('guestCart', JSON.stringify(basket))

const getGuestLikes = () => JSON.parse(localStorage.getItem('guestLikes')) || []
const setGuestLikes = (likes) => localStorage.setItem('guestLikes', JSON.stringify(likes))

export const useAddToCart = () => {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId) => {
      if (!user) {
        const basket = getGuestCart()
        const existing = basket.find(item => item.productId === productId)
        let newBasket
        if (existing) {
          newBasket = basket.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        } else {
          const newId = basket.length > 0 ? Math.max(...basket.map(i => i.id)) + 1 : 1
          newBasket = [...basket, { id: newId, productId, quantity: 1 }]
        }
        setGuestCart(newBasket)
        return { guest: true, basket: newBasket }
      }

      const currentUser = (await axios.get(`http://localhost:4000/users/${user.id}`)).data
      const basket = currentUser.basket || []
      const existing = basket.find(item => item.productId === productId)

      let newBasket
      if (existing) {
        newBasket = basket.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        const newId = basket.length > 0 ? Math.max(...basket.map(i => i.id)) + 1 : 1
        newBasket = [...basket, { id: newId, productId, quantity: 1 }]
      }

      const res = await axios.patch(`http://localhost:4000/users/${user.id}`, { basket: newBasket })
      return res.data
    },
    onSuccess: (data) => {
      if (user && !data.guest) updateUser(data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("Savatga qo'shildi!")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })
}

export const useChangeCartQty = () => {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, delta }) => {
      if (!user) {
        const basket = getGuestCart()
        const newBasket = basket
          .map(item => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
          .filter(item => item.quantity > 0)
        setGuestCart(newBasket)
        return { guest: true, basket: newBasket }
      }

      const currentUser = (await axios.get(`http://localhost:4000/users/${user.id}`)).data
      const basket = currentUser.basket || []
      const newBasket = basket
        .map(item => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0)

      const res = await axios.patch(`http://localhost:4000/users/${user.id}`, { basket: newBasket })
      return res.data
    },
    onSuccess: (data) => {
      if (user && !data.guest) updateUser(data)
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
      if (!user) {
        const basket = getGuestCart().filter(item => item.productId !== productId)
        setGuestCart(basket)
        return { guest: true, basket }
      }

      const currentUser = (await axios.get(`http://localhost:4000/users/${user.id}`)).data
      const basket = (currentUser.basket || []).filter(item => item.productId !== productId)
      const res = await axios.patch(`http://localhost:4000/users/${user.id}`, { basket })
      return res.data
    },
    onSuccess: (data) => {
      if (user && !data.guest) updateUser(data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("Mahsulot savatdan olib tashlandi")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })
}

export const useToggleLike = () => {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId) => {
      if (!user) {
        const likes = getGuestLikes()
        const isLiked = likes.includes(productId)
        const newLikes = isLiked ? likes.filter(id => id !== productId) : [...likes, productId]
        setGuestLikes(newLikes)
        return { guest: true, likes: newLikes, isLiked }
      }

      const currentUser = (await axios.get(`http://localhost:4000/users/${user.id}`)).data
      const likes = currentUser.likes || []
      const isLiked = likes.includes(productId)
      const newLikes = isLiked ? likes.filter(id => id !== productId) : [...likes, productId]

      const res = await axios.patch(`http://localhost:4000/users/${user.id}`, { likes: newLikes })
      return { data: res.data, isLiked }
    },
    onSuccess: (result) => {
      if (user && !result.guest) updateUser(result.data)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(result.isLiked ? "Like olib tashlandi" : "Like qo'shildi ❤️")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })
}
