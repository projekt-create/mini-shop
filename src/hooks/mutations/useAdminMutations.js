import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const useProductMutations = () => {
  const queryClient = useQueryClient()

  const add = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post('http://localhost:4000/products', payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success("Mahsulot qo'shildi!")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })

  const update = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.put(`http://localhost:4000/products/${payload.id}`, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success("Mahsulot yangilandi!")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:4000/products/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success("Mahsulot o'chirildi!")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })

  return { add, update, remove }
}

export const useUserMutations = () => {
  const queryClient = useQueryClient()

  const add = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post('http://localhost:4000/users', { ...payload, basket: [], likes: [] })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("Foydalanuvchi qo'shildi!")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })

  const update = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.put(`http://localhost:4000/users/${payload.id}`, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("Foydalanuvchi yangilandi!")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:4000/users/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("Foydalanuvchi o'chirildi!")
    },
    onError: () => toast.error('Xatolik yuz berdi')
  })

  return { add, update, remove }
}
