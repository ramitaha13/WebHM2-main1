import React from "react";
import { useDarkMode } from "../Style/DarkModeContext"; // Import useDarkMode from your context

export const DropZone = React.memo(
  ({ getRootProps, getInputProps, isDragActive }) => {
    const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

    return (
      <div
        {...getRootProps()}
        className={`mb-6 p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <input {...getInputProps()} />
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {isDragActive
            ? "Drop the Excel files here ..."
            : "Drag 'n' drop Excel files here, or click to select files"}
        </p>
      </div>
    );
  },
);

export const ErrorMessage = React.memo(({ message }) => (
  <p className="text-red-500 mb-4">{message}</p>
));

export const SharedColumnSelection = React.memo(
  ({ sharedColumns, selectedColumns, handleSharedColumnSelect }) => {
    const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

    return (
      <div className="mb-6">
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Shared Columns
        </h2>
        {sharedColumns.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sharedColumns.map((column) => {
              const isSelected = selectedColumns.some(
                (col) => col.column === column,
              );
              return (
                <button
                  key={column}
                  onClick={() => handleSharedColumnSelect(column)}
                  className={`px-3 py-1 rounded ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : `${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`
                  }`}
                >
                  {column}
                </button>
              );
            })}
          </div>
        ) : (
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No shared columns found across all files.
          </p>
        )}
      </div>
    );
  },
);

export const ColumnSelection = React.memo(
  ({
    columns,
    selectedColumns,
    handleColumnSelect,
    handleDeleteFile,
    handleReplaceFile,
  }) => {
    const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

    return (
      <div className="mb-6">
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Select Columns
        </h2>
        {Object.entries(columns).map(([fileName, fileColumns]) => (
          <div key={fileName} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {fileName}
              </h3>
              <div>
                <button
                  onClick={() => handleDeleteFile(fileName)}
                  className="px-3 py-1 bg-red-500 text-white rounded mr-2 hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleReplaceFile(fileName)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Replace
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {fileColumns.map((column) => (
                <button
                  key={`${fileName}-${column}`}
                  onClick={() => handleColumnSelect(fileName, column)}
                  className={`px-3 py-1 rounded ${
                    selectedColumns.some(
                      (col) => col.fileName === fileName && col.column === column,
                    )
                      ? "bg-blue-500 text-white"
                      : `${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`
                  }`}
                >
                  {column}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

export const DataPreview = React.memo(
  ({ previewData, selectedColumns, downloadFilteredExcel }) => {
    const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

    const uniqueColumns = React.useMemo(() => {
      return [...new Set(selectedColumns.map(({ column }) => column))];
    }, [selectedColumns]);

    return (
      <>
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Preview
        </h2>
        <div className="mb-6 overflow-hidden border border-gray-200 rounded-lg">
          <div className="overflow-x-auto">
            <div className="overflow-y-auto max-h-[400px]">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`bg-gray-50 ${isDarkMode ? 'bg-gray-800' : ''} sticky top-0 z-10`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Row
                    </th>
                    {uniqueColumns.map((column) => (
                      <th
                        key={column}
                        className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider whitespace-nowrap`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} divide-y divide-gray-200`}>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900 bg-white'} sticky left-0 z-10`}>
                        {index + 1}
                      </td>
                      {uniqueColumns.map((column) => (
                        <td
                          key={column}
                          className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                        >
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <button
          onClick={downloadFilteredExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Download Combined Excel
        </button>
      </>
    );
  },
);
