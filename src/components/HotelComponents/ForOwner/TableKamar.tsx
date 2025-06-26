'use client'
import AddKamarModals from '@/components/Modals/Kamar/AddKamarModals';
import WrapperTable from '@/components/root/WrapperTable'
import ActionButton from '@/components/TableAtom/ActionButton';
import GenericRow from '@/components/TableAtom/GenericRow';
import TableFooter from '@/components/TableAtom/TableFooter';
import TableHeader from '@/components/TableAtom/TableHeader';
import { useHooksUser } from '@/hooks/useHooksUser';
import { useManageKamar } from '@/hooks/useManageKamar';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { closeModals, openModals } from '../../../../libs/slices/modalSlice';
import EditKamarModal from '@/components/Modals/Kamar/EditKamarModal';
import SkeletonTable from '@/components/LoadingSkeleton/SkeletonTable';
import DetailKamarModals from '@/components/Modals/Kamar/DetailKamarModals';
import { addToast } from '@heroui/react';
import DeleteModal from '@/components/Modals/sharedModals/DeleteModal';

const TableKamar = () => {
  const columns = ['id', 'nama_kamar', 'nama_hotel', 'kategori', 'price', 'is_kyc', 'status'];
  const { user } = useHooksUser();
  const [selectedKamar, setSelectedKamar] = useState<number | null>(null);
  const modalState = useSelector((state: RootState) => state.modals);
  const { kamars, isLoading, totalPages, setQuery, itemsPerPage, setCurrentPage, currentPage, deleteKamar, totalItems } = useManageKamar(user?.id || 0);
  const dispatch = useDispatch();

  const handleEditButtonClick = (id: number) => {
    setSelectedKamar(id);
    dispatch(openModals('editKamar'));
  };

  const handleDeleteButtonClick = (id: number) => {
    setSelectedKamar(id);
    dispatch(openModals('deleteKamar'));
  };

  const handleDetailButtonClick = (id: number) => {
    setSelectedKamar(id);
    dispatch(openModals('detailKamar'));
  };

  const confirmDeleteKamar = async () => {
    if (selectedKamar === null) {
      addToast({
        title: 'Error',
        description: 'Id kamar null',
        variant: 'flat',
        color: 'danger',
      });
      return;
    };

    try {
      await deleteKamar(selectedKamar);
    } catch (error) {
      console.error("Gagal menghapus kamar:", error);
      addToast({
        title: 'Error',
        description: 'Gagal menghapus kamar',
        variant: 'flat',
        color: 'danger',
      });
    } finally {
      dispatch(closeModals('deleteKamar'));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  return (
    <WrapperTable>
      <TableHeader onAddButtonClick={() => dispatch(openModals('addKamar'))} title="Kelola Kamar" onSearch={setQuery} />
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
            {isLoading ? (
              <SkeletonTable dataLength={itemsPerPage} columns={columns} />
            ) : (
              kamars.map((kamar) => (
                <GenericRow
                  showActionsCol={true}
                  key={kamar.id}
                  data={kamar}
                  columns={columns}
                  actions={
                    <ActionButton
                      showDetailButton={true}
                      onDetail={() => handleDetailButtonClick(kamar?.id || 0)}
                      onEdit={() => handleEditButtonClick(kamar?.id || 0)}
                      onDelete={() => handleDeleteButtonClick(kamar?.id || 0)} />}
                />
              ))
            )}
          </tbody>
        </table>

        {!kamars.length && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Kamar tidak ditemukan!</p>
          </div>
        )}
      </div>

      <TableFooter itemCount={totalItems} itemName="kamars" currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} itemsPerPage={itemsPerPage} />

      <AddKamarModals isOpen={modalState.addKamar} onClose={() => dispatch(closeModals('addKamar'))} />
      <EditKamarModal isOpen={modalState.editKamar} onClose={() => dispatch(closeModals('editKamar'))} selectedIdKamar={selectedKamar} />
      <DetailKamarModals isOpen={modalState.detailKamar} onClose={() => dispatch(closeModals('detailKamar'))} selectedIdKamar={selectedKamar} />
      <DeleteModal
        isOpen={modalState.deleteKamar}
        onClose={() => {
          setSelectedKamar(null);
          dispatch(closeModals('deleteKamar'));
        }}
        onConfirm={confirmDeleteKamar}
        ID={selectedKamar}
        isLoading={isLoading}
        title="Konfirmasi Hapus Kamar"
        description="Apakah Anda yakin ingin menghapus kamar ini?" />
    </WrapperTable>
  )
}

export default TableKamar