import React from 'react'
import { useGetCategories } from '../../hooks/get/useGetCategories'
import { FiGrid } from 'react-icons/fi'

const Categories = ({ activeCategory, onSelect }) => {
  const { data, isSuccess } = useGetCategories()
  return (
    <div className='w-full max-w-5xl h-auto p-2 mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4'>
      <button
        onClick={() => onSelect('All')}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 whitespace-nowrap ${
          activeCategory === 'All'
            ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20'
            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
        }`}
      >
        <FiGrid className="text-xl" />
        <span className='text-[15px] font-bold'>All</span>
      </button>

      {isSuccess && data.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.name)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 whitespace-nowrap ${
            activeCategory === item.name
              ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
          }`}
        >
          <span className='text-[20px]'>{item.icon}</span>
          <span className='text-[15px] font-bold'>{item.name}</span>
        </button>
      ))}
    </div>
  )
}

export default Categories
