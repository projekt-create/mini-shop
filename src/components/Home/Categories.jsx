import React from 'react'
import { useGetCategories } from '../../hooks/get/useGetCategories'

const Categories = () => {
  const {data , isSuccess, error, isLoading} = useGetCategories()
  return (
    <div className='w-600px h-auto p-4 mt-6 flex items-center backdrop-blur bg-white/10 rounded-2xl' >
      {isSuccess && data.map(item => (
        <div key={item.id} className='flex items-center gap-4 border-r-2 border-white/10 px-4'>
          <span className='text-[24px] font-bold'>{item.icon}</span>
          <span className='text-[16px] font-normal text-white hover:text-sky-400 transition-all duration-300 ease'>{item.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Categories
