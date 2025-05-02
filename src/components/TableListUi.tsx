// 'use client'
// import React, { SVGProps,  useState, useEffect } from "react";
//   import {
//     Table,
//     TableHeader,
//     TableColumn,
//     TableBody,
//     TableRow,
//     TableCell,
//     Button,
//     DropdownTrigger,
//     Dropdown,
//     DropdownMenu,
//     DropdownItem,
//     Chip,
//     User,
//     Selection,
//     ChipProps,
//     SortDescriptor,
//   } from "@heroui/react";
//   import { useDispatch, useSelector } from "react-redux";
//   import { RootState } from "../../libs/store";
//   import { GoPlus } from "react-icons/go";
//   import { IoSearch } from "react-icons/io5";
//   import { HiDotsVertical } from "react-icons/hi";
//   import PaginationUI from "./PaginationUI";
//   import InputUI from "./InputUI";
//   import NextPrev from "./NextPrev";
//   import { fetchUsers } from "../../libs/slices/userSlice";
//   import FilterDropdown from "./DropdownFilter";
//   import CounterTableData from "./CounterTableData";
// import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

// export type IconSvgProps = SVGProps<SVGSVGElement> & {};

// export function capitalize(s: string) {
//    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
//  }

//  export const columns = [
//    { name: "ID", uid: "id", sortable: true },
//    { name: "NAME", uid: "name", sortable: true },
//    { name: "AGE", uid: "age", sortable: true },
//    { name: "ROLE", uid: "role", sortable: true },
//    { name: "TEAM", uid: "team" },
//    { name: "EMAIL", uid: "email" },
//    { name: "STATUS", uid: "status", sortable: true },
//    { name: "ACTIONS", uid: "actions" },
//  ];

//  export const statusOptions = [
//    { name: "Active", uid: "active" },
//    { name: "Paused", uid: "paused" },
//    { name: "Vacation", uid: "vacation" },
//  ];

//  interface UserData {
//    id: number;
//    nama: string;
//    no_wa: string;
//    email: string;
//    password: string;
//    is_active: boolean;
//    role_id: number;
//    createdAt: string;
//    deletedAt: string | null;
//    updatedAt: string;
//  }

//   const statusColorMap: Record<string, ChipProps["color"]> = {
//     active: "success",
//     paused: "danger",
//     vacation: "warning",
//   };

//  const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];


//  export default async function App() {
//     const darkMode = useSelector((state: RootState) => state.theme.darkMode);
//     const dispatch = useDispatch();
//     const {list : users, status} = useSelector((state: RootState) => state.users);
//     const [filterValue, setFilterValue] = React.useState("");
//     const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
//     const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
//       new Set(INITIAL_VISIBLE_COLUMNS),
//     );

//     useEffect(() => {
//       dispatch(fetchUsers());
//     }, [dispatch]);
  

//     const [statusFilter, setStatusFilter] = React.useState<"all" | Set<string>>("all");
//     const [rowsPerPage, setRowsPerPage] = React.useState(5);
//     const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
//       column: "age",
//       direction: "ascending",
//     });

//     const [page, setPage] = React.useState(1);

//     const hasSearchFilter = Boolean(filterValue);

//     const headerColumns = React.useMemo(() => {
//       if (visibleColumns === "all") return columns;

//       return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
//     }, [visibleColumns]);

//     const filteredItems = React.useMemo(() => {
//       let filteredUsers = [...(users || [])];

//       if (hasSearchFilter) {
//         filteredUsers = filteredUsers.filter((user) =>
//           user.nama.toLowerCase().includes(filterValue.toLowerCase()),
//         );
//       }
//       if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
//         filteredUsers = filteredUsers.filter((user) =>
//           Array.from(statusFilter).includes(user.is_active.toString()),
//         );
//       }

//       return filteredUsers;
//     }, [users, filterValue, statusFilter]);

//     const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

//     const items = React.useMemo(() => {
//       const start = (page - 1) * rowsPerPage;
//       const end = start + rowsPerPage;

//       return filteredItems.slice(start, end);
//     }, [page, filteredItems, rowsPerPage]);

//     const sortedItems = React.useMemo(() => {
//       return [...items].sort((a: UserData, b: UserData) => {
//         const first = a[sortDescriptor.column as keyof UserData] as number;
//         const second = b[sortDescriptor.column as keyof UserData] as number;
//         const cmp = first < second ? -1 : first > second ? 1 : 0;

//         return sortDescriptor.direction === "descending" ? -cmp : cmp;
//       });
//     }, [sortDescriptor, items]);

//     const renderCell = React.useCallback((user: UserData, columnKey: React.Key) => {
//       const cellValue = user[columnKey as keyof UserData];

//       switch (columnKey) {
//         case "name":
//           return (
//             <User
//               avatarProps={{ radius: "lg", src: user.no_wa }}
//               description={user.email}
//               name={cellValue}
//               className={darkMode ? "text-white" : "text-gray-800"}
//             >
//               {user.email}
//             </User>
//           );
//         case "role":
//           return (
//             <div className="flex flex-col">
//               <p className={`text-bold text-small capitalize ${darkMode ? "text-white" : "text-gray-800"}`}>{cellValue}</p>
//               <p className={`text-bold text-tiny capitalize ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{user.no_wa}</p>
//             </div>
//           );
//         case "status":
//           return (
//             <Chip
//               className={`capitalize ${darkMode ? "dark-theme-chip" : ""}`}
//               color={statusColorMap[user.email]}
//               size="sm"
//               variant={darkMode ? "solid" : "flat"}
//             >
//               {cellValue}
//             </Chip>
//           );
//         case "actions":
//           return (
//             <div className="relative flex justify-end items-center gap-2">
//               <Dropdown>
//                 <DropdownTrigger>
//                   <Button
//                     isIconOnly
//                     size="sm"
//                     variant={darkMode ? "flat" : "light"}
//                     className={darkMode ? "text-white" : ""}
//                   >
//                     <HiDotsVertical className={darkMode ? "text-white-50 " : "text-gray-900"} />
//                   </Button>
//                 </DropdownTrigger>
//                 <DropdownMenu
//                   className={darkMode ? "bg-black-50 text-white-50" : " text-gray-900 bg-white"}
//                 >
//                   <DropdownItem key="view">View</DropdownItem>
//                   <DropdownItem key="edit">Edit</DropdownItem>
//                   <DropdownItem key="delete">Delete</DropdownItem>
//                 </DropdownMenu>
//               </Dropdown>
//             </div>
//           );
//         default:
//           return (
//             <span className={darkMode ? "text-white" : ""}>
//               {cellValue}
//             </span>
//           );
//       }
//     }, [darkMode]);

//     const onNextPage = React.useCallback(() => {
//       if (page < pages) {
//         setPage(page + 1);
//       }
//     }, [page, pages]);

//     const onPreviousPage = React.useCallback(() => {
//       if (page > 1) {
//         setPage(page - 1);
//       }
//     }, [page]);

//     const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
//       setRowsPerPage(Number(e.target.value));
//       setPage(1);
//     }, []);

//     const onSearchChange = React.useCallback((value?: string) => {
//       if (value) {
//         setFilterValue(value);
//         setPage(1);
//       } else {
//         setFilterValue("");
//       }
//     }, []);

//     const onClear = React.useCallback(() => {
//       setFilterValue("");
//       setPage(1);
//     }, []);

//     const topContent = React.useMemo(() => {
//       return (
//         <div className={`flex flex-col gap-4 ${darkMode ? "text-white" : ""}`}>
//           <div className="flex justify-between gap-3 items-end">
//             <InputUI placeholder="Search by name..." type="search" icon={IoSearch} onValueChange={onSearchChange} onClear={onClear} value={filterValue}/>
//             <div className="flex gap-3">
//               <FilterDropdown label="Role" options={statusOptions} selectedKeys={statusFilter} onSelectionChange={setStatusFilter} />
//               <FilterDropdown label="Columns" options={columns} selectedKeys={visibleColumns as Set<string>} onSelectionChange={setVisibleColumns} />
//               <Button
//                 color="secondary"
//                 endContent={<GoPlus className="text-xl" />}
//                 className={darkMode ? "dark-secondary-button" : ""}
//               >
//                 Add New
//               </Button>
//             </div>
//           </div>
//           <CounterTableData onRowsPerPageChange={onRowsPerPageChange} users={users || []} />
//         </div>
//       );
//     }, [
//       filterValue,
//       statusFilter,
//       visibleColumns,
//       onSearchChange,
//       onRowsPerPageChange,
//       (users?.length || 0),
//       hasSearchFilter,
//       darkMode,
//     ]);

//     const bottomContent = React.useMemo(() => {
//       return (
//         <div className={`py-2 px-2 flex justify-between items-center ${darkMode ? "text-white" : ""}`}>
//           <span className={`w-[30%] text-small ${darkMode ? "text-gray-300" : "text-default-400"}`}>
//             {selectedKeys === "all"
//               ? "All items selected"
//               : `${selectedKeys.size} of ${filteredItems.length} selected`}
//           </span>

//           <PaginationUI page={page} pages={pages} setPage={setPage} />
//           <NextPrev onPreviousPage={onPreviousPage} onNextPage={onNextPage} pages={pages} />

//         </div>
//       );
//     }, [selectedKeys, items.length, page, pages, hasSearchFilter, darkMode, filteredItems.length]);


//     return (
//       <div className={darkMode ? "bg-black-100 p-4 rounded-lg" : "p-4 rounded-lg bg-gray-100"}>
//         <Table
//           isHeaderSticky
//           aria-label="Example table with custom cells, pagination and sorting"
//           bottomContent={bottomContent}
//           bottomContentPlacement="outside"
//           classNames={{
//             wrapper: `max-h-[382px] ${darkMode ? "bg-black-50 text-white" : "bg-white text-gray-900"}`,
//             th: darkMode ? "bg-gray-800 text-white" : "bg-violet-100 text-gray-900",
//           }}
//           selectedKeys={selectedKeys}
//           selectionMode="multiple"
//           sortDescriptor={sortDescriptor}
//           topContent={topContent}
//           topContentPlacement="outside"
//           onSelectionChange={setSelectedKeys}
//           onSortChange={setSortDescriptor}
//         >
//           <TableHeader columns={headerColumns}>
//             {(column) => (
//               <TableColumn
//                 key={column.uid}
//                 align={column.uid === "actions" ? "center" : "start"}
//                 allowsSorting={column.sortable}
//                 className={darkMode ? "!text-white" : " !text-gray-900"}
//               >
//                 {column.name}
//               </TableColumn>
//             )}
//           </TableHeader>
//           <TableBody
//             emptyContent={<div className={darkMode ? "!text-white" : "!text-gray-900"}>No users found</div>}
//             items={sortedItems}
//           >
//             {(item) => (
//              <TableRow
//              key={item.id}
//              className={darkMode 
//                ? "!text-white transition-component hover:!bg-gray-900" 
//                : "!text-gray-900 transition-component hover:!bg-gray-100"}
//            >
//                 {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     );
// }

// // Removed the incorrect custom useEffect definition.
