import React from "react";
import { useDarkMode } from "./DarkModeContext"; // Import useDarkMode from your context

export const DropzoneContainer = ({ isDragActive, children }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <div
      className={`mb-6 p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${
        isDragActive
          ? "border-blue-400 bg-blue-100 dark:bg-blue-900"
          : `border-gray-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`
      }`}
    >
      {children}
    </div>
  );
};

export const DropzoneContent = ({ isDragActive }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
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
        <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Drag 'n' drop Excel files here, or click to select files
        </p>
      )}
    </div>
  );
};

export const FileList = ({ children }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <div className={`mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Uploaded Files
      </h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
};

export const FileListItem = ({ fileName, onReplace, onDelete }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <li className="flex items-center justify-between">
      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{fileName}</span>
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
};

export const SharedColumnsContainer = ({ children }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <div className={`mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Shared Columns
      </h2>
      {children}
    </div>
  );
};

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

export const FileTable = ({ file }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <div className={`mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
      <h2 className={`text-xl font-semibold p-4 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
        {file.name}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`bg-gray-50 ${isDarkMode ? 'bg-gray-800' : ''}`}>
            <tr>
              {Object.keys(file.data[0]).map((column) => (
                <th
                  key={column}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'dark:text-gray-300' : 'text-gray-500'}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`bg-white ${isDarkMode ? 'dark:bg-gray-900' : ''} divide-y divide-gray-200`}>
            {file.data.slice(0, 10).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, valueIndex) => (
                  <td
                    key={valueIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
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
};
