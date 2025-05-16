import React, { useState, useEffect } from 'react';
import { UploadProfileModals } from '@/components/Modals/Users/UploadProfileModal';
import { openModals, closeModals } from '../../../../libs/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { addToast } from '@heroui/react';
import { FaPencil } from 'react-icons/fa6';
import { setUser } from '../../../../libs/slices/userSlice';
import { useHooksUser } from '@/hooks/useHooksUser';
import { formatDateWithDay } from '@/utils/dateFormater';

const MyProfileSection = () => {
  const { user } = useHooksUser();
  const [isEditing, setIsEditing] = useState(false);
  const modals = useSelector((state: RootState) => state.modals);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    nama_user: '',
    email: '',
    no_whatsapp: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        nama_user: user.nama_user ?? '',
        email: user.email ?? '',
        no_whatsapp: user.no_wa ?? '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('nama_user', userData.nama_user);
      formData.append('email', userData.email);
      formData.append('no_whatsapp', userData.no_whatsapp);

      const response = await fetch(`/api/me/update-information/${user?.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal memperbarui profil');
      }

      const updatedUser = await response.json();
      addToast({
        title: 'Berhasil',
        description: 'Profil berhasil diperbarui',
        variant: 'flat',
        color: 'success',
      });

      console.log('Profil berhasil diperbarui:', updatedUser);
      dispatch(setUser(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      addToast({
        title: 'Gagal',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui profil',
        variant: 'flat',
        color: 'danger',
      });
    }
  };

  if (!user) {
    return <div className="p-6 text-gray-400 dark:text-gray-500">Loading...</div>;
  }

  return (
    <div className="md:overflow-hidden h-auto md:h-[500px] bg-white dark:bg-neutral-800 p-5 rounded-lg border border-gray-200 dark:border-neutral-700 backdrop-blur-md text-gray-900 dark:text-white">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200 dark:border-neutral-600 shadow-md">
              <img
                src={`/uploads/profile_pict/${user.profile_pict ?? 'default.jpg'}`}
                alt={user.profile_pict ?? 'default.jpg'}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => dispatch(openModals('addProfilePicture'))}
              className="absolute bottom-2 right-2 bg-blue-100 dark:bg-blue-900 p-2 rounded-full shadow-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <MdOutlinePhotoCamera size={20} className="text-blue-600 dark:text-blue-300" />
            </button>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{userData.nama_user}</h3>
            <p className="text-gray-600 dark:text-gray-300">{user.role}</p>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informasi Profil</h2>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium rounded-md border border-gray-200 dark:border-neutral-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                  >
                    Simpan
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaPencil size={16} />
                  Edit Profil
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div>
                <label
                  htmlFor="nama_user"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="nama_user"
                  name="nama_user"
                  value={userData.nama_user}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-neutral-900 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-neutral-900 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                />
              </div>

              {/* Nomor Whatsapp */}
              <div>
                <label
                  htmlFor="no_whatsapp"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                >
                  Nomor Whatsapp
                </label>
                <input
                  type="tel"
                  id="no_whatsapp"
                  name="no_whatsapp"
                  value={userData.no_whatsapp}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-neutral-900 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                />
              </div>

              {/* Wallet Address (Disabled) */}
              <div>
                <label
                  htmlFor="wallet"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                >
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="wallet"
                  name="wallet_address"
                  value={user?.wallet_address ?? ''}
                  disabled
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-gray-100 dark:bg-neutral-900 text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors duration-200"
                />
              </div>

              {/* Join Date (Disabled) */}
              <div className="md:col-span-2">
                <label
                  htmlFor="join_date"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                >
                  Tanggal Bergabung
                </label>
                <textarea
                  id="join_date"
                  name="join_date"
                  rows={4}
                  value={formatDateWithDay(user?.join_date ?? '')}
                  disabled
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-gray-100 dark:bg-neutral-900 text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <UploadProfileModals
        isOpen={modals.addProfilePicture}
        onClose={() => dispatch(closeModals('addProfilePicture'))}
      />
    </div>
  );
};

export default MyProfileSection;