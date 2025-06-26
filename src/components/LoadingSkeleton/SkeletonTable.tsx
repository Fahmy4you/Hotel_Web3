import { LoadingTableProps } from "@/types/TypePropsLoadingTable";
import { Skeleton } from "@heroui/react";

const SkeletonTable = ({ dataLength, columns }: LoadingTableProps) => {
  return (
    <>
      {Array.from({ length: dataLength }).map((_, index) => (
        <tr
          key={index}
          className="hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors"
        >
          {columns.map((col, idx) => (
            <td key={idx} className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-full rounded-md" />
            </td>
          ))}
          <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
            <Skeleton className="h-8 w-16 rounded-md inline-block" />
            <Skeleton className="h-8 w-16 rounded-md inline-block" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default SkeletonTable;