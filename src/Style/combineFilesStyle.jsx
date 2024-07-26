import React from "react";

export const DropZone = React.memo(
  ({ getRootProps, getInputProps, isDragActive }) => (
    <div
      {...getRootProps()}
      className="mb-6 p-10 border-2 border-dashed rounded-lg text-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <input {...getInputProps()} />
      <p className="text-gray-600 dark:text-gray-300">
        {isDragActive
          ? "Drop the Excel files here ..."
          : "Drag 'n' drop Excel files here, or click to select files"}
      </p>
    </div>
  ),
);

export const ErrorMessage = React.memo(({ message }) => (
  <p className="text-red-500 mb-4">{message}</p>
));

export const SharedColumnSelection = React.memo(
  ({ sharedColumns, selectedColumns, handleSharedColumnSelect }) => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
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
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {column}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No shared columns found across all files.
        </p>
      )}
    </div>
  ),
);

export const ColumnSelection = React.memo(
  ({
    columns,
    selectedColumns,
    handleColumnSelect,
    handleDeleteFile,
    handleReplaceFile,
  }) => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        Select Columns
      </h2>
      {Object.entries(columns).map(([fileName, fileColumns]) => (
        <div key={fileName} className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
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
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {column}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
);

export const DataPreview = React.memo(
  ({ previewData, selectedColumns, downloadFilteredExcel }) => {
    const uniqueColumns = React.useMemo(() => {
      return [...new Set(selectedColumns.map(({ column }) => column))];
    }, [selectedColumns]);

    return (
      <>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Preview
        </h2>
        <div className="mb-6 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="overflow-x-auto">
            <div className="overflow-y-auto max-h-[400px]">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 sticky left-0 z-20 bg-gray-50 dark:bg-gray-800">
                      Row
                    </th>
                    {uniqueColumns.map((column) => (
                      <th
                        key={column}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 whitespace-nowrap"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-900 z-10">
                        {index + 1}
                      </td>
                      {uniqueColumns.map((column) => (
                        <td
                          key={column}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
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
