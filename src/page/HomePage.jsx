import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSwiper from '../components/Home/HeroSwiper'
import Categories from '../components/Home/Categories'
import ProductCard from '../components/Home/ProductCard'
import Footer from '../components/Footer'

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-black/95 py-5'>
      <Navbar />
      <HeroSwiper />
      <Categories activeCategory={activeCategory} onSelect={setActiveCategory} />
      <ProductCard activeCategory={activeCategory} />
      <Footer />
    </div>
  )
}

export default HomePage
