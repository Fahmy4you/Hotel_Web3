import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../libs/store';

interface Props {
    onRowsPerPageChange: React.ChangeEventHandler<HTMLSelectElement>;
    users: any[]
}
const CounterTableData = ( { onRowsPerPageChange, users }: Props) => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  return (
    <div className="flex justify-between items-center">
              <span className={`text-small ${darkMode ? "text-gray-300" : "text-default-400"}`}>
                Total {users.length} users
              </span>
              <label className={`flex items-center text-small ${darkMode ? "text-gray-300" : "text-default-400"}`}>
                Rows per page:
                <select
                  className={`bg-transparent outline-none text-small ml-2 ${darkMode ? "text-gray-300" : "text-default-400"}`}
                  onChange={onRowsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </label>
            </div>
  )
}

export default CounterTableData