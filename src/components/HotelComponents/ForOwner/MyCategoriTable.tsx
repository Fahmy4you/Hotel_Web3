import TableHeader from '@/components/TableAtom/TableHeader';
import React from 'react'
import AddKategoriModal from '@/components/Modals/Kategori/AddKategoriModal';
import { FaTrashAlt } from 'react-icons/fa';
import { useManageKategori } from '@/hooks/useManageKategori';
import { RiPencilLine } from 'react-icons/ri';
import GenericRow from '@/components/TableAtom/GenericRow';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import ConfirmDeleteKategoriModal from '@/components/Modals/Kategori/ModalConfirmDelete';
import { KategoriData } from '../../../../types/kategoriData';
import TableFooter from '@/components/TableAtom/TableFooter';
import WrapperTable from '@/components/root/WrapperTable';

const MyCategoriTable = () => {
  const userID = useSelector((state: RootState) => state.users.id)?.toString() || '';
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentKategori, setCurrentKategori] = React.useState<KategoriData | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedKategoriId, setSelectedKategoriId] = React.useState<number | null>(null);

  const {
    kategori,
    setQuery,
    query,
    deleting,
    editKategori,
    submitKategori,
    handleDeleteKategori,
  } = useManageKategori(userID);

  const filteredData = kategori.filter(kategori =>
    (kategori.kategori || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentKategori(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentKategori(null);
    setIsEditMode(false);
  };

  const handleAddNewKategori = (kategoriData: { kategori: string }) => {
    if (isEditMode && currentKategori) {
      editKategori({ ...currentKategori, kategori: kategoriData.kategori });
      handleCloseModal();
    } else {
      submitKategori(userID, kategoriData.kategori, handleCloseModal);
    }
  };

  const handleEditKategori = (kategori: KategoriData) => {
    setIsEditMode(true);
    setIsModalOpen(true);
    setCurrentKategori(kategori);
    // editKategori(kategori);
  }

  const handleDeleteHotel = (kategori: KategoriData) => {
    if (kategori.id === undefined) return;
    setSelectedKategoriId(kategori.id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteHotel = async () => {
    if (selectedKategoriId === null) return;
    await handleDeleteKategori(selectedKategoriId);
    setIsDeleteModalOpen(false);
  };

  const col = ['id', 'kategori'];
  return (
    <WrapperTable>
      <TableHeader title="Kategori"
        onSearch={() => { }}
        onAddButtonClick={handleOpenAddModal}
        renderModal={() => (
          <AddKategoriModal
            isEdit={isEditMode}
            initialData={currentKategori}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddNewKategori} />
        )} />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-800 transition-colors">
          <thead className="bg-gray-100 dark:bg-black-50 transition-colors">
            <tr>
              {col.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column === 'id' ? 'ID' : column === 'kategori' ? 'Kategori' : column === 'Kamar' ? 'Kamar' : column === 'isBaned' ? 'Status' : column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-slate-100 dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-800 transition-colors">
            {filteredData.map(hotel => (
              <GenericRow
                key={hotel.id}
                data={hotel}
                columns={col}
                actions={
                  <div className='space-x-2'>
                    <button className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-yellow-500 bg-yellow-900/10 border border-yellow-500/50 hover:bg-yellow-900/20 hover:shadow-[0_0_5px_rgba(234,179,8,0.5)] transition-all duration-200 text-xs'
                      onClick={() => handleEditKategori(hotel)}>
                      Edit
                      <RiPencilLine className="h-5 w-5" />
                    </button>
                    <button
                      className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-red-500 bg-red-900/10 border border-red-500/50 hover:bg-red-900/20 hover:shadow-[0_0_5px_rgba(239,68,68,0.5)] transition-all duration-200 text-xs'
                      onClick={() => handleDeleteHotel(hotel)}>
                      Hapus
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                } />
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No Categories Found</p>
          </div>
        )}
      </div>
      <TableFooter itemCount={filteredData.length} itemName="Kategori" onPrev={() => { }} onNext={() => { }} />
      <ConfirmDeleteKategoriModal
        hotelId={selectedKategoriId || 0}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteHotel}
        isLoading={deleting}
      />
    </WrapperTable>
  )
}

export default MyCategoriTable