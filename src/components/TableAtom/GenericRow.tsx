import { formatDate } from '../../utils/Helper';
interface Props {
  data: Record<string, any>;
  columns: string[];
  actions?: React.ReactNode;
  customRender?: Record<string, (value: any, data: Record<string, any>) => React.ReactNode>;
}

const GenericRow = ({ data, columns, actions, customRender }: Props) => {
    return (
        <tr className="hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors">
            {columns.map((col, idx) => (
                <td key={idx} className="px-6 py-4 whitespace-nowrap">
                    {customRender?.[col] ? customRender[col](data[col],[col]) : 
                     <div className="text-sm font-medium text-gray-900 dark:text-white-50">
                     {typeof data[col] === 'boolean'
                        ? data[col] ? 'Yes' : 'No'
                        : data[col] instanceof Date
                            ? formatDate(data[col])
                            : data[col]
                    }
                 </div>
                    }
                </td>
            ))}
            {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    {actions}
                </td>
            )}
        </tr>
    )
}

export default GenericRow;