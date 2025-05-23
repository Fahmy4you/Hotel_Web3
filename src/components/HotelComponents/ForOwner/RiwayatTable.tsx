import WrapperTable from '@/components/root/WrapperTable'
import TableHeader from '@/components/TableAtom/TableHeader'
import React from 'react'

const RiwayatTable = () => {
  return (
    <WrapperTable>
        <TableHeader
        onSearch={(query: string) => console.log(query)}  
        title="Riwayat"
        />
        <div className="overflow-x-auto">
          
        </div>
    </WrapperTable>
  )
}

export default RiwayatTable