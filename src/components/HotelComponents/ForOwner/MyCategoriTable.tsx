import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { RiPencilLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { openModals, closeModals } from '../../../../libs/slices/modalSlice';
import { KategoriData } from '../../../../types/kategoriData';
import { useManageKategori } from '@/hooks/useManageKategori';
import AddKategoriModal from '@/components/Modals/Kategori/AddKategoriModal';
import ConfirmDeleteKategoriModal from '@/components/Modals/Kategori/ModalConfirmDelete';
import GenericRow from '@/components/TableAtom/GenericRow';
import TableHeader from '@/components/TableAtom/TableHeader';
import TableFooter from '@/components/TableAtom/TableFooter';
import WrapperTable from '@/components/root/WrapperTable';
import BadgeUI from '@/components/AtomsComponent/BadgeUI';

const MyCategoriTable = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.users.id)?.toString() || '';
  const modalsState = useSelector((state: RootState) => state.modals);
  
  const [currentKategori, setCurrentKategori] = React.useState<KategoriData | null>(null);
  const [selectedKategoriId, setSelectedKategoriId] = React.useState<number | null>(null);
  const isEditMode = Boolean(currentKategori);

  const {
    kategori,
    query,
    deleting,
    setQuery,
    editKategori,
    submitKategori,
    handleDeleteKategori,
  } = useManageKategori(userId);

  const filteredData = kategori.filter(k => 
    (k.kategori || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setCurrentKategori(null);
    dispatch(openModals('add'));
  };

  const handleCloseModal = () => {
    setCurrentKategori(null);
    dispatch(closeModals(isEditMode ? 'edit' : 'add'));
  };

  const handleSubmitKategori = (data: KategoriData) => {
    if (!data.hotel_id) return;
    
    if (isEditMode && currentKategori) {
      editKategori({ ...currentKategori, ...data });
    } else {
      submitKategori(data.kategori, data.hotel_id, () => dispatch(closeModals('add')));
    }
    handleCloseModal();
  };

  const handleEdit = (kategori: KategoriData) => {
    setCurrentKategori(kategori);
    dispatch(openModals('edit'));
  };

  const handleDelete = (kategori: KategoriData) => {
    if (kategori.id) {
      setSelectedKategoriId(kategori.id);
      dispatch(openModals('delete'));
    }
  };

  const confirmDelete = async () => {
    if (selectedKategoriId) {
      await handleDeleteKategori(selectedKategoriId);
      dispatch(closeModals('delete'));
    }
  };

  const columns = ['id', 'kategori', 'Jumlah Kamar', 'isBaned'];

  const customRender = {
    isBaned: (value: boolean) => (
      <BadgeUI variant={value ? 'error' : 'success'}>
         {value ? 'Inactive' : 'Active'}
      </BadgeUI>
    ),
    "Jumlah Kamar": (_: any, data: Record<string, any>) => (
      <span className="text-sm flex w-1/2 justify-center items-center h-full font-medium text-gray-900 dark:text-white">
        {data._count?.kamar ?? 0}
      </span>
    )
  };

  return (
    <WrapperTable>
      <TableHeader 
        title="Kategori"
        onSearch={setQuery}
        onAddButtonClick={handleOpenAddModal}
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-800">
          <thead className="bg-gray-100 dark:bg-black-50">
            <tr>
              {columns.map(column => (
                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column === 'id' ? 'ID' : 
                   column === 'kategori' ? 'Kategori' : 
                   column === 'isBaned' ? 'Status' : column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-slate-100 dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredData.map(kategori => (
              <GenericRow
                key={kategori.id}
                data={kategori}
                columns={columns}
                customRender={customRender}
                actions={
                  <div className='space-x-2'>
                    <button 
                      className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-yellow-500 bg-yellow-900/10 border border-yellow-500/50 hover:bg-yellow-900/20 hover:shadow-[0_0_5px_rgba(234,179,8,0.5)] transition-all duration-200 text-xs'
                      onClick={() => handleEdit(kategori)}
                    >
                      Edit <RiPencilLine className="h-5 w-5" />
                    </button>
                    <button
                      className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-red-500 bg-red-900/10 border border-red-500/50 hover:bg-red-900/20 hover:shadow-[0_0_5px_rgba(239,68,68,0.5)] transition-all duration-200 text-xs'
                      onClick={() => handleDelete(kategori)}
                    >
                      Hapus <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                }
              />
            ))}
          </tbody>
        </table>

        {!filteredData.length && (
          <div className="text-center py-8">
            <p className="text-gray-500">No Categories Found</p>
          </div>
        )}
      </div>

      <TableFooter
        itemCount={filteredData.length} 
        itemName="Kategori" 
        onPrev={() => {}} 
        onNext={()=>{}}
      />

      <ConfirmDeleteKategoriModal
        hotelId={selectedKategoriId || 0}
        isOpen={modalsState.delete}
        onClose={() => dispatch(closeModals('delete'))}
        onConfirm={confirmDelete}
        isLoading={deleting}
      />

      <AddKategoriModal
        isEdit={isEditMode}
        initialData={currentKategori}
        isOpen={modalsState.add || modalsState.edit}
        onClose={handleCloseModal}
        onSubmit={handleSubmitKategori}
      />
    </WrapperTable>
  );
};

export default MyCategoriTable;