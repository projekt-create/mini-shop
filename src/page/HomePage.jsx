import React from 'react'
import Navbar from '../components/Navbar'
import HeroSwiper from '../components/Home/HeroSwiper'
import Categories from '../components/Home/Categories'
import ProductCard from '../components/Home/ProductCard'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-black/95 py-5'>
      <Navbar />
      <HeroSwiper />
      <Categories />
      <ProductCard />
      <Footer />
    </div>
  )
}

export default HomePage
