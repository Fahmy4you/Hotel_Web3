import React from 'react';

interface Props {
  data: Record<string, any>;
  columns: string[];
  actions?: React.ReactNode;
  showActionsCol? : boolean;
  customRender?: Record<string, (value: any, data: Record<string, any>) => React.ReactNode>;
}

const GenericRow = ({ data, columns, actions, customRender, showActionsCol = true }: Props) => {
  return (
    <tr className="hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors divide-x divide-gray-200 dark:divide-gray-800">
      {columns.map((col) => (
        <td 
          key={col} 
          className={`px-6 py-4 whitespace-nowrap ${
            col === 'id' ? 'text-center w-12' : 
            col === 'kategori' ? 'text-left font-medium text-blue-600 dark:text-blue-400' : 
            col === 'Jumlah Kamar' ? 'text-center' : 
            col === 'Status' ? 'text-center' : 
            col === 'isBaned' ? 'text-center' :
            col === 'Hotel' ? 'text-left' :
            'text-left'
          }`}
        >
          {customRender?.[col] ? (
            customRender[col](data[col], data)
          ) : (
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {typeof data[col] === 'boolean' ? (data[col] ? 'Yes' : 'No') : data[col]}
            </div>
          )}
        </td>
      ))}
      {showActionsCol && actions === true && (
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {actions}
        </td>
      )}
    </tr>
  );
};

export default GenericRow;