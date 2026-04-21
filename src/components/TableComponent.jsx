import React, { useRef } from 'react';
import { Eye, Pencil, Trash, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import ExcelPDfDownload from './ExcelPDfDownload';


const GenericTable = ({
    data,
    columns,
    loading,
    currentPage = 1,
    totalPages = 1,
    itemsPerPage = 10,
    onPreviousPage,
    onNextPage,
    onViewItem,
    onEditItem,
    onDeleteItem,
    onToggleStatus,
    setImageViewModalFlag,
    setSelectedItem,
    // New prop for PDF export functionality
    tableRef,
}) => {

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                {/* Replace with your actual Spinner component */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <p className="ml-2 text-gray-700 dark:text-gray-300">Loading data...</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <ExcelPDfDownload tableRef={tableRef} data={data} fileName="Inventory_Report" />
            </div>

            <div className="overflow-x-auto rounded-md border border-gray-300 dark:border-gray-600">
                <table ref={tableRef} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.headerClassName || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {(onViewItem || onEditItem || onDeleteItem || onToggleStatus) && (
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data?.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (onViewItem || onEditItem || onDeleteItem || onToggleStatus ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No data found.
                                </td>
                            </tr>
                        ) : (
                            data?.map((item, index) => (
                                <tr key={item._id || index}>
                                    {columns.map((column) => (
                                        <td
                                            key={`${item._id || index}-${column.key}`}
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || 'text-gray-900 dark:text-gray-100'}`}
                                        >
                                            {column.render
                                                ? column.render(item, index, currentPage, itemsPerPage)
                                                : item[column.key]}
                                        </td>
                                    ))}
                                    {(onViewItem || onEditItem || onDeleteItem || onToggleStatus) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <div className='flex items-center'>
                                                {onViewItem && (
                                                    <Eye
                                                        onClick={() => onViewItem(item)}
                                                        size={24}
                                                        className="mx-1 cursor-pointer text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    />
                                                )}
                                                {onEditItem && (
                                                    <Pencil
                                                        onClick={() => onEditItem(item)}
                                                        size={20}
                                                        className="mx-1 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    />
                                                )}
                                                {onDeleteItem && (
                                                    <Trash
                                                        onClick={() => onDeleteItem(item._id)}
                                                        size={20}
                                                        className="mx-1 cursor-pointer text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    />
                                                )}
                                                {onToggleStatus && typeof item.isActive !== 'undefined' && (
                                                    item.isActive ? (
                                                        <X
                                                            onClick={() => onToggleStatus(item._id, item.isActive)}
                                                            className={'mx-1 cursor-pointer text-red-600 hover:text-red-500'}
                                                            size={24}
                                                        />
                                                    ) : (
                                                        <Check
                                                            onClick={() => onToggleStatus(item._id, item.isActive)}
                                                            className={"mx-1 cursor-pointer text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"}
                                                            size={24}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-4">
                    <Button
                        variant="outline"
                        onClick={onPreviousPage}
                        disabled={currentPage === 1 || loading}
                    >
                        Previous
                    </Button>
                    <span className="text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={onNextPage}
                        disabled={currentPage === totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
};

export default GenericTable;