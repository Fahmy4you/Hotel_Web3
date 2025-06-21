'use client'
import WrapperTable from '@/components/root/WrapperTable'
import ActionButton from '@/components/TableAtom/ActionButton';
import GenericRow from '@/components/TableAtom/GenericRow';
import TableFooter from '@/components/TableAtom/TableFooter';
import TableHeader from '@/components/TableAtom/TableHeader';
import { useHooksUser } from '@/hooks/useHooksUser';
import { useManageKamar } from '@/hooks/useManageKamar';
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce';

const TableKamar = () => {
  const columns = ['id', 'nama_kamar', 'nama_hotel', 'kategori', 'price', 'is_kyc', 'status'];
  const { user } = useHooksUser();
  const [searchText, setSearchText] = useState('');
  const [debounce] = useDebounce(searchText, 500);
  const { kamars, isLoading, fetchKamars, setQuery } = useManageKamar(user?.id || 0);

  useEffect(() => {
    if (searchText) setQuery(searchText);
  }, [debounce]);

  return (
    <WrapperTable>
      <TableHeader title="Kelola Kamar" onSearch={setSearchText} />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-800">
          <thead className="bg-gray-100 dark:bg-black-50">
            <tr className="divide-x divide-gray-200 dark:divide-gray-800">
              {columns.map(column => (
                <th key={column} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column === 'nama_kamar' ? 'Nama Kamar' :
                   column === 'nama_hotel' ? 'Hotel' :
                   column === 'price' ? 'Harga/Malam' :
                   column === 'is_kyc' ? 'kyc?' : column}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-slate-100 dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-800">
            {kamars.map((kamar) => (
              <GenericRow
                showActionsCol={true}
                key={kamar.id}
                data={kamar}
                columns={columns}
                actions={<ActionButton showDetailButton={true} onDetail={() => {}} onEdit={() => {}} onDelete={() => {}} />}
              />
            ))}
          </tbody>
        </table>

        {!kamars.length && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hotels found</p>
          </div>
        )}
      </div>

      <TableFooter itemCount={kamars.length} itemName="kamars" currentPage={1} totalPages={1} onPageChange={() => {}} itemsPerPage={10} />
    </WrapperTable>
  )
}

export default TableKamar