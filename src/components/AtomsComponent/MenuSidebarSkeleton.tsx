'use client';
import React from 'react';
import { Skeleton } from '@heroui/react';

const MenuSidebarSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <div className={`flex ${isCollapsed ? 'items-center justify-between' : 'justify-center'} p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300`}>
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-md" />
        {isCollapsed && <Skeleton className="w-32 h-8 rounded-md" />}
      </div>
    </div>
  )
}

export default MenuSidebarSkeleton
