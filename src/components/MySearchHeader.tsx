import { IoSearch } from 'react-icons/io5'

const MySearchHeader = ({placeholder = "Cari Lokasi Dan Nama Hotel...", onChange}: {placeholder?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <div className="w-full md:mx-0 mx-5 md:w-[700px] md:h-[50px] h-[40px] md:text-[16px] text-[13px] pl-5 bg-white-50/40 border border-white-50/70 rounded mt-3 flex justify-center items-center">
        <IoSearch size={20} className='text-gray-300'/>
        <input autoFocus placeholder={placeholder} onChange={onChange} type="text" name="search" className="flex-1 px-5 border-none outline-none placeholder:text-gray-300" />
    </div>
  )
}

export default MySearchHeader
