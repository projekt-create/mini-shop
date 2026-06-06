import { useGetProducts } from "../../hooks/get/useGetProducts"

const ProductCard = () => {

    const {data, isSuccess} = useGetProducts()

  return (
    <div id='products' className='w-full max-w-6xl mt-10 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {isSuccess && data.map(item => (
        <div key={item.id} id={`product-${item.id}`} className='scroll-mt-24 h-full flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur transition-all duration-300 hover:border-sky-400/60 hover:bg-white/15'>
            <img className='h-[220px] w-full rounded-xl object-cover' src={item.image} alt={item.title} />
            <div className='flex flex-1 flex-col gap-3'>
              <p className="text-[18px] font-bold text-white hover:text-sky-400 transition-all duration-300 ease">{item.title}</p>
              <p className="text-[14px] font-normal leading-6 text-white/70">{item.description}</p>
              <p className="mt-auto text-[18px] font-bold text-sky-400">{item.price.toLocaleString("uz-UZ")} so'm</p>
            </div>
        </div>
      ))}
    </div>
  )
}

export default ProductCard
