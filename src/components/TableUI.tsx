import React from 'react';
import { Address } from 'viem';
import { ArrowUpDown, MoreHorizontal, Search } from 'lucide-react';
import { GetAllUser } from '@/app/Server/GetAllUser';
const RoleBadge = ({ roleId }: { roleId: number }) => {
  const roles: Record<number, { name: string; color: string }> = {
    1: { 
      name: 'Guest', 
      color: 'bg-blue-500/50  text-blue-600 dark:text-white-50' 
    },
    2: { 
      name: 'Owner', 
      color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
    },
    3: { 
      name: 'Admin', 
      color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' 
    }
  };
  
  const role = roles[roleId] || { 
    name: `Role ${roleId}`, 
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100' 
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color} transition-colors`}>
      {role.name}
    </span>
  );
};

// Address formatter
const WalletAddress = ({ address }: { address: string }) => {
  return (
    <div className="flex items-center">
      <span className="text-sm font-mono bg-[#301050] p-1 rounded">
        {address.substring(0, 6)}...{address.substring(address.length - 4)}
      </span>
    </div>
  );
};

// Table header component
const TableHeader = () => { 
  return (
    <div className="dark:bg-black-50 p-4 border-b dark:border-gray-800 transition-component transition-bg bg-gray-100 border-gray-200 rounded-t-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-white-50 transition-component text-gray-900">User Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border dark:border-gray-800 transition-component dark:text-gray-100 text-neutral-900 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
          </div>
          <button className="bg-[#BF00FF] hover:bg-[#301050] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

const ModernTableUI = async () => {
  // const darkMode = useSelector((state : RootState) => state.theme.darkMode);
  const data = await GetAllUser();
  return (
    <div className="w-full dark:bg-black-50 transition-bg bg-gray-100 rounded-lg shadow-lg overflow-hidden">
      <TableHeader />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y transition-bg dark:divide-gray-800 transition-component divide-gray-400">
          <thead className="dark:bg-black-50 transition-bg bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:text-gray-700">
                  ID
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:text-gray-700">
                  Wallet Address
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:text-gray-700">
                  Role
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:text-gray-700">
                  Name
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="dark:bg-neutral-800 transition-bg bg-slate-100 divide-y transition-component dark:divide-gray-800 divide-gray-200">
            {(data ?? []).map((user) => (
              <tr key={user.id} className="dark:hover:bg-neutral-700 hover:bg-slate-200 transition-bg">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium dark:text-white-50 transition-component text-gray-900">#{user.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <WalletAddress address={user.wallet_address} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge roleId={user.role_id} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium transition-component dark:text-white-50 text-gray-900">{user.nama}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(data ?? []).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
      
      <div className="dark:bg-black-50 bg-gray-100 border-gray-400 px-6 py-4 border-t transition-bg transition-component dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{data?.length}</span> users
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 transition-component rounded-md text-sm bg-[#BF00FF] hover:bg-[#301050]">
              Previous
            </button>
            <button className="px-3 py-1 transition-component rounded-md text-sm bg-[#BF00FF] hover:bg-[#301050]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTableUI;