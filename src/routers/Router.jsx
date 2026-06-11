import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../page/HomePage'
import Login from '../page/Login'
import NotFound from '../page/NotFound'
import CartPage from '../page/CartPage'
import AdminPage from '../page/AdminPage'
import WishlistPage from '../page/WishlistPage'

const Router = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default Router
