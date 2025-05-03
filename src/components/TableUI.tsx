import React from 'react';
import { Address } from 'viem';
import { ArrowUpDown, MoreHorizontal, Search } from 'lucide-react';
import { GetAllUser } from '@/app/Server/GetAllUser';
const RoleBadge = ({ roleId }: { roleId: number }) => {
  const roles: Record<number, { name: string; color: string }> = {
    1: { name: 'Guest', color: 'bg-blue-100 text-blue-800' },
    2: { name: 'Owner', color: 'bg-green-100 text-green-800' },
    3: { name: 'Admin', color: 'bg-yellow-100 text-yellow-800' }
  };
  
  const role = roles[roleId] || { name: `Role ${roleId}`, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
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
    <div className="bg-black-50 p-4 border-b border-gray-800 rounded-t-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white-50">User Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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
    <div className="w-full bg-black-50 rounded-lg shadow-lg overflow-hidden">
      <TableHeader />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-black-50">
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
          <tbody className="bg-neutral-800 divide-y divide-gray-800">
            {(data ?? []).map((user) => (
              <tr key={user.id} className="hover:bg-neutral-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white-50">#{user.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <WalletAddress address={user.wallet_address} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge roleId={user.role_id} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white-50">{user.nama}</div>
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
      
      <div className="bg-black-50 px-6 py-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{data?.length}</span> users
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 transition-component rounded-md text-sm bg-[#7828C8] hover:bg-[#301050]">
              Previous
            </button>
            <button className="px-3 py-1 transition-component rounded-md text-sm bg-[#7828C8] hover:bg-[#301050]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTableUI;