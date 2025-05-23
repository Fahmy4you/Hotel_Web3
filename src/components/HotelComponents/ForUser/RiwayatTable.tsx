import WrapperTable from '@/components/root/WrapperTable'
import TableHeader from '@/components/TableAtom/TableHeader'
import { useHooksUser } from '@/hooks/useHooksUser'
import { useMyData } from '@/hooks/useMyData'
import { Skeleton } from '@heroui/react'
import GenericRow from '@/components/TableAtom/GenericRow'
import React, { useEffect } from 'react'
import TableFooter from '@/components/TableAtom/TableFooter'

const RiwayatTable = () => {
  const { user } = useHooksUser();
  const {
    transactions,
    loading,
    itemPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    setQuery
  } = useMyData(user?.id ?? 0);

  const filteredData = transactions.filter(transactions =>
    transactions.tanggal_pesan
  );

  const columns = ['id', 'kamar', 'hotel', 'pemesan', 'whatsapp',
    'check_in', 'check_out', 'total', 'tanggal_pesan'];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  return (
    <WrapperTable>
      <TableHeader
        onSearch={setQuery}
        title="Riwayat Transaksi"
        addButtonText='Filter'
      />
      <div className="overflow-x-auto">

      <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-800">
        <thead className="bg-gray-100 dark:bg-black-50">
          <tr className="divide-x divide-gray-200 dark:divide-gray-800">
            {columns.map(column => (
              <th
                key={column}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column === 'kamar'
                  ? 'Kamar'
                  : column === 'nama_hotel'
                    ? 'Hotel'
                    : column === 'nama_pemesan'
                      ? 'Pemesan' :
                      column === 'whatsapp'
                        ? 'WhatsApp' :
                        column === 'check_in'
                          ? 'Check In' :
                          column === 'check_out'
                            ? 'Check Out'
                            : column === 'total'
                              ? 'Total'
                              : column === 'tanggal_pesan'
                                ? 'Tanggal Reservasi'
                                : column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-slate-100 dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-800">
          {loading ? (
            Array.from({ length: itemPerPage }).map((_, index) => (
              <tr
                key={index}
                className="hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-full rounded-md" />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            filteredData.map(hotel => (
              <GenericRow
                key={hotel.id}
                data={hotel}
                columns={columns}
                showActionsCol={false}
              />
            ))
          )}
        </tbody>
      </table>
      </div>
      {!filteredData.length && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No Transactions Record</p>
        </div>
      )}
      <TableFooter
        itemCount={totalItems}
        itemName="Transactions"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemPerPage}
      />
    </WrapperTable>
  )
}

export default RiwayatTable