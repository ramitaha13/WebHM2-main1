// uploadFileStyle.jsx
import React from "react";

// Container for the entire component
export const Container = ({ children }) => (
  <div className="max-w-7xl mx-auto p-8 bg-gray-100 min-h-screen">
    {children}
  </div>
);

// Page title styling
export const PageTitle = ({ children }) => (
  <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
    {children}
  </h1>
);

// Styling for the upload button
export const UploadButton = ({ children, ...props }) => (
  <label
    className="bg-indigo-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-indigo-700 transition duration-300"
    {...props}
  >
    {children}
  </label>
);

// Hidden file input
export const FileInput = React.forwardRef((props, ref) => (
  <input type="file" className="hidden" ref={ref} {...props} />
));

// Grid layout for cards
export const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">{children}</div>
);

// Card styling
export const Card = ({ children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">{children}</div>
);

// Card title styling
export const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold text-indigo-600 mb-4">{children}</h2>
);

// File list styling
export const FileList = ({ children }) => (
  <ul className="space-y-2">{children}</ul>
);

// File item styling
export const FileItem = ({ children }) => (
  <li className="flex justify-between items-center bg-gray-50 p-3 rounded">
    {children}
  </li>
);

// File name styling
export const FileName = ({ children, ...props }) => (
  <span
    className="text-gray-700 cursor-pointer hover:text-indigo-600 transition duration-300"
    {...props}
  >
    {children}
  </span>
);

// Delete button styling
export const DeleteButton = ({ children, ...props }) => (
  <button
    className="text-red-500 hover:text-red-700 transition duration-300"
    {...props}
  >
    {children}
  </button>
);

// Label styling for form inputs
export const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {children}
  </label>
);

// Select input styling
export const Select = ({ children, ...props }) => (
  <select
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 mb-4"
    {...props}
  >
    {children}
  </select>
);

// Generate button styling
export const GenerateButton = ({ children, ...props }) => (
  <button
    className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition duration-300"
    {...props}
  >
    {children}
  </button>
);

// Chart container styling
export const ChartContainer = ({ children }) => (
  <div className="bg-gray-50 p-4 rounded">{children}</div>
);