import React from "react";

export const DropzoneContainer = ({ isDragActive, children }) => (
  <div
    className={`mb-6 p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${
      isDragActive
        ? "border-blue-400 bg-blue-100 dark:bg-blue-900"
        : "border-gray-300 bg-gray-50 dark:bg-gray-800"
    }`}
  >
    {children}
  </div>
);

export const DropzoneContent = ({ isDragActive }) => (
  <div className="flex flex-col items-center justify-center">
    <svg
      className="w-16 h-16 mb-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      ></path>
    </svg>
    {isDragActive ? (
      <p className="text-lg font-semibold text-blue-500 dark:text-blue-300">
        Drop the Excel files here ...
      </p>
    ) : (
      <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
        Drag 'n' drop Excel files here, or click to select files
      </p>
    )}
  </div>
);

export const FileList = ({ children }) => (
  <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
      Uploaded Files
    </h2>
    <ul className="space-y-2">{children}</ul>
  </div>
);

export const FileListItem = ({ fileName, onReplace, onDelete }) => (
  <li className="flex items-center justify-between">
    <span className="text-gray-700 dark:text-gray-300">{fileName}</span>
    <div>
      <label className="mr-2 px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
        Replace
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={onReplace}
        />
      </label>
      <button
        onClick={onDelete}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </li>
);

export const SharedColumnsContainer = ({ children }) => (
  <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
      Shared Columns
    </h2>
    {children}
  </div>
);

export const SharedColumnsList = ({ columns }) => (
  <div className="flex flex-wrap gap-2">
    {columns.map((column) => (
      <span key={column} className="px-3 py-1 bg-blue-500 text-white rounded">
        {column}
      </span>
    ))}
  </div>
);

export const ToggleButton = ({ onClick, showOriginalFiles }) => (
  <div className="flex justify-center mb-6">
    <button
      onClick={onClick}
      className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
    >
      {showOriginalFiles ? "Hide Original Files" : "Show Original Files"}
    </button>
  </div>
);

export const FileTable = ({ file }) => (
  <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    <h2 className="text-xl font-semibold p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
      {file.name}
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {Object.keys(file.data[0]).map((column) => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {file.data.slice(0, 10).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
