import { FaGithub, FaInstagram, FaTelegramPlane } from 'react-icons/fa'
import { FaShop } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className='w-full mt-16 border-t border-white/10 bg-black/40 px-5 py-10 text-white'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between'>
        <div className='max-w-sm'>
          <div className='flex items-center gap-3'>
            <FaShop className='text-[26px] text-sky-400' />
            <h2 className='text-[22px] font-bold'>TechUz</h2>
          </div>
          <p className='mt-4 text-[14px] leading-6 text-white/60'>
            Sifatli texnika mahsulotlari, qulay narxlar va tezkor xizmat.
          </p>
        </div>

        <div className='grid w-full gap-8 sm:grid-cols-3 md:max-w-2xl'>
          <div>
            <h3 className='text-[15px] font-bold text-white'>Menu</h3>
            <div className='mt-4 flex flex-col gap-3 text-[14px] text-white/60'>
              <a className='transition-colors hover:text-sky-400' href='#top'>Home</a>
              <a className='transition-colors hover:text-sky-400' href='#products'>Products</a>
              <a className='transition-colors hover:text-sky-400' href='#'>About</a>
              <a className='transition-colors hover:text-sky-400' href='#'>Contact</a>
            </div>
          </div>

          <div>
            <h3 className='text-[15px] font-bold text-white'>Aloqa</h3>
            <div className='mt-4 flex flex-col gap-3 text-[14px] text-white/60'>
              <a className='transition-colors hover:text-sky-400' href='tel:+998901234567'>+998 90 123 45 67</a>
              <a className='transition-colors hover:text-sky-400' href='mailto:info@techuz.uz'>info@techuz.uz</a>
              <span>Toshkent, Uzbekistan</span>
            </div>
          </div>

          <div>
            <h3 className='text-[15px] font-bold text-white'>Social</h3>
            <div className='mt-4 flex items-center gap-3'>
              <a className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:border-sky-400 hover:text-sky-400' href='#' aria-label='Telegram'>
                <FaTelegramPlane />
              </a>
              <a className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:border-sky-400 hover:text-sky-400' href='#' aria-label='Instagram'>
                <FaInstagram />
              </a>
              <a className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:border-sky-400 hover:text-sky-400' href='#' aria-label='GitHub'>
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto mt-8 flex w-full max-w-6xl flex-col gap-3 border-t border-white/10 pt-5 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between'>
        <p>&copy; 2026 TechUz. Barcha huquqlar himoyalangan.</p>
        <p>Mini shop loyihasi</p>
      </div>
    </footer>
  )
}

export default Footer
