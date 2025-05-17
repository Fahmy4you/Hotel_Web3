import { MdOutlinePhotoCamera } from "react-icons/md";
import { Skeleton, Textarea } from "@heroui/react";
import { FaPencil } from "react-icons/fa6";


export const LoadingInfoUser = () => {
  return (
    <div className="md:overflow-hidden h-auto md:h-[500px] bg-white dark:bg-neutral-800 p-5 rounded-lg border border-gray-200 dark:border-neutral-700 backdrop-blur-md text-gray-900 dark:text-white">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="w-40 h-40 rounded-full">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200 dark:border-neutral-600 shadow-md">
                    <img
                      src="default.jpg"
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    className="absolute bottom-2 right-2 bg-blue-100 dark:bg-blue-900 p-2 rounded-full shadow-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                  >
                    <MdOutlinePhotoCamera size={20} className="text-blue-600 dark:text-blue-300" />
                  </button>
                </div>
              </Skeleton>
                <div className="text-center flex flex-col gap-2">
                  <Skeleton className="w-40">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Loading</h3>
                  </Skeleton>
                  <Skeleton>
                  <p className="text-gray-600 dark:text-gray-300">Loading</p>
                  </Skeleton>
                </div>
            </div>
    
            {/* Profile Information Section */}
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informasi Profil</h2>
    
                <div className="flex gap-3">
                  <Skeleton className="w-32 h-8 rounded-md">
                      <button
                        className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <FaPencil size={16} />
                        Edit Profil
                      </button>
                    </Skeleton>
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
                    <Skeleton className="rounded-md">
                      <input
                        type="text"
                        id="nama_user"
                        name="nama_user"
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-neutral-900 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                      />
                    </Skeleton>
                  </div>
    
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <Skeleton className="rounded-md">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-neutral-900 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                      />
                    </Skeleton>
                  </div>
    
                  {/* Nomor Whatsapp */}
                  <div>
                    <label
                      htmlFor="no_whatsapp"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      Nomor Whatsapp
                    </label>
                    <Skeleton className="rounded-md">
                      <input
                        type="tel"
                        id="no_whatsapp"
                        name="no_whatsapp"
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-neutral-900 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                      />
                    </Skeleton>
                  </div>
    
                  {/* Wallet Address (Disabled) */}
                  <div>
                    <label
                      htmlFor="wallet"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      Wallet Address
                    </label>
                    <Skeleton className="rounded-md">
                      <input
                        type="text"
                        id="wallet"
                        name="wallet_address"
                        value='default wallet address'
                        disabled
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-gray-100 dark:bg-neutral-900 text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors duration-200"
                      />
                    </Skeleton>
                  </div>
    
                  {/* Join Date (Disabled) */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="join_date"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      Tanggal Bergabung
                    </label>
                    <Skeleton className="rounded-md">
                      <Textarea
                        type="text"
                        id="join_date"
                        name="join_date"
                        value='default join date'
                        disabled
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-600 bg-gray-100 dark:bg-neutral-900 text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors duration-200"
                      />
                    </Skeleton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default LoadingInfoUser