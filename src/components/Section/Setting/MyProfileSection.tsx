import React, { useState, useEffect } from 'react';
import { UploadProfileModals } from '@/components/Modals/Users/UploadProfileModal';
import { openModals, closeModals } from '../../../../libs/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { addToast, Button, Form, Input, Textarea } from '@heroui/react';
import { FaPencil } from 'react-icons/fa6';
import { useHooksUser } from '@/hooks/useHooksUser';
import { formatDateWithDay } from '@/utils/dateFormater';
import LoadingInfoUser from '@/components/WhileLoading/LoadingInfoUser';
import { UserFormData } from '@/utils/zod';

const MyProfileSection = () => {
  const { user, updateUser, setIsEdit, editLoading, isEdit, error } = useHooksUser();
  const modals = useSelector((state: RootState) => state.modals);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<UserFormData>({
    nama_user: '',
    email: '',
    no_whatsapp: '',
  });

  const [initialUserData, setInitialUserData] = useState({
    nama_user: '',
    email: '',
    no_whatsapp: '',
  });

  useEffect(() => {
    if (user) {
      const initialData = {
        nama_user: user.nama_user ?? '',
        email: user.email ?? '',
        no_whatsapp: user.no_wa ?? '',
      };
      setFormData(initialData);
      setInitialUserData(initialData); // Simpan data awal
    }
  }, [user]);

  const handleCancel = () => {
    setFormData(initialUserData); // Kembalikan ke data awal
    setIsEdit(false);
  };

  const handleHeroInputChange = (value: string, name: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(formData);
    } catch (err) {
      console.error('Error saving profile:', err);
      addToast({
        title: 'Gagal',
        description: err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui profil',
        variant: 'flat',
        color: 'danger',
      });
    }
  };

  if (!user) {
    return <LoadingInfoUser />;
  }

  return (
    <div className="md:overflow-hidden h-auto md:h-[500px] bg-white dark:bg-neutral-800 p-5 rounded-lg border border-gray-200 dark:border-neutral-700 backdrop-blur-md text-gray-900 dark:text-white">
      <div className="flex flex-col md:flex-row gap-12 md:gap-12">
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {formData.nama_user.length <= 19 ? formData.nama_user : formData.nama_user.slice(0, 19) + '...'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{user.role}</p>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informasi Profil</h2>

            <div className="flex gap-3">
              {isEdit ? (
                <>
                  {editLoading ? (
                    <>
                      <Button
                        isDisabled
                        onPress={handleCancel}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-gray-200 dark:border-neutral-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                      >
                        Batal
                      </Button>
                      <Button
                        isLoading
                        onPress={handleSaveProfile}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                      >
                        Simpan
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onPress={handleCancel}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-gray-200 dark:border-neutral-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                      >
                        Batal
                      </Button>
                      <Button
                        onPress={handleSaveProfile}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                      >
                        Simpan
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaPencil size={16} />
                  Edit Profil
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Form validationErrors={error || undefined} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                labelPlacement='outside'
                isRequired
                radius="sm"
                variant="bordered"
                size="lg"
                color={error?.nama_user ? 'danger' : 'default'}
                errorMessage={error?.nama_user || null}
                type="text"
                id="nama_user"
                name="nama_user"
                value={formData.nama_user}
                onValueChange={(value) => handleHeroInputChange(value, 'nama_user')}
                isDisabled={!isEdit}
                classNames={{ input: [isEdit ? 'cursor-pointer' : 'cursor-not-allowed'] }}
              />


              {/* Email */}
              <Input
                label="Email"
                labelPlacement='outside'
                isRequired
                radius="sm"
                variant="bordered"
                size="lg"
                color={error?.email ? 'danger' : 'default'}
                errorMessage={error?.email || null}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onValueChange={(value) => handleHeroInputChange(value, 'email')}
                isDisabled={!isEdit}
                classNames={{ input: [isEdit ? 'cursor-pointer' : 'cursor-not-allowed'] }}
              />

              {/* Nomor Whatsapp */}
              <Input
                label="Nomor Whatsapp"
                labelPlacement='outside'
                isRequired
                radius="sm"
                variant="bordered"
                size="lg"
                color={error?.no_whatsapp ? 'danger' : 'default'}
                errorMessage={error?.no_whatsapp || null}
                type="tel"
                id="no_whatsapp"
                name="no_whatsapp"
                value={formData.no_whatsapp}
                onValueChange={(value) => handleHeroInputChange(value, 'no_whatsapp')}
                isDisabled={!isEdit}
                classNames={{ input: [isEdit ? 'cursor-pointer' : 'cursor-not-allowed'] }}
              />

              {/* Wallet Address (Disabled) */}

              <Input
                label="Wallet Address"
                labelPlacement='outside'
                isDisabled
                radius="sm"
                variant="bordered"
                size="lg"
                type="text"
                id="wallet"
                name="wallet_address"
                value={user?.wallet_address ?? ''}
                classNames={{ input: ['cursor-not-allowed'] }}

              />

              {/* Join Date (Disabled) */}
              <div className="md:col-span-2">
                <Textarea
                  label="Tanggal Bergabung"
                  labelPlacement='outside'
                  isDisabled
                  radius="sm"
                  variant="bordered"
                  size="lg"
                  id="join_date"
                  name="join_date"
                  rows={4}
                  value={formatDateWithDay(user?.join_date ?? '')}
                  classNames={{ input: ['cursor-not-allowed'] }}
                />
              </div>
            </Form>
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