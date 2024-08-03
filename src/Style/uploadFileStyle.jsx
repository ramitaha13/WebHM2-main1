// src/Style/uploadFileStyle.jsx
import React from "react";
import { useDarkMode } from "./DarkModeContext"; // Import the dark mode context

// Container for the entire component
export const Container = ({ children }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <div
      className={`max-w-7xl mx-auto p-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} min-h-screen`}
    >
      {children}
    </div>
  );
};

// Page title styling
export const PageTitle = ({ children }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <h1
      className={`text-4xl font-bold text-center ${isDarkMode ? "text-gray-100" : "text-indigo-600"} mb-8`}
    >
      {children}
    </h1>
  );
};

// Styling for the upload button
export const UploadButton = ({ children, ...props }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <label
      className={`py-2 px-4 rounded cursor-pointer hover:bg-indigo-700 transition duration-300 ${isDarkMode ? "bg-indigo-700 text-white" : "bg-indigo-600 text-white"}`}
      {...props}
    >
      {children}
    </label>
  );
};

// Hidden file input
export const FileInput = React.forwardRef((props, ref) => (
  <input type="file" className="hidden" ref={ref} {...props} />
));

// Grid layout for cards
export const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">{children}</div>
);

// Card styling
export const Card = ({ children }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      {children}
    </div>
  );
};

// Card title styling
export const CardTitle = ({ children }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <h2
      className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-gray-100" : "text-indigo-600"}`}
    >
      {children}
    </h2>
  );
};

// File list styling
export const FileList = ({ children }) => (
  <ul className="space-y-2">{children}</ul>
);

// File item styling
export const FileItem = ({ children }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <li
      className={`flex justify-between items-center p-3 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
    >
      {children}
    </li>
  );
};

// File name styling
export const FileName = ({ children, ...props }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <span
      className={`cursor-pointer hover:text-indigo-600 transition duration-300 ${isDarkMode ? "text-gray-100" : "text-indigo-600"}`}
      {...props}
    >
      {children}
    </span>
  );
};

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
export const Label = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-2 ${isDarkMode ? "text-gray-100" : "text-indigo-600"}`}
    >
      {children}
    </label>
  );
};

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
