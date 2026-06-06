import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../page/HomePage'
import Login from '../page/Login'
import NotFound from '../page/NotFound'

const Router = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default Router
