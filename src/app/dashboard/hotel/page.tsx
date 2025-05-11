'use client'
import TableHotel from '@/components/HotelComponents/ForOwner/TableHotel'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../libs/store'

const page = () => {
    const user = useSelector((state:RootState) => state.users);

  return (
    <div>
        {user.role_id === 3 ? <h1>Admin</h1> :  <TableHotel /> }
    </div>
  )
}

export default page