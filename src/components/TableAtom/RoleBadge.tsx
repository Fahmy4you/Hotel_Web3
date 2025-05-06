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

export default RoleBadge;