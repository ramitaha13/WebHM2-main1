import React, { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import MainLayout from "../layouts/mainLayout";
import {
  FileList,
  FileListItem,
  SharedColumnsContainer,
  SharedColumnsList,
  ToggleButton,
  FileTable,
} from "../Style/comparisionStyle";
import { useDarkMode } from "../Style/DarkModeContext"; // Import useDarkMode from your context

// Main component for Excel file comparison
export default function Comparision() {
  // State to store processed Excel files
  const [excelFiles, setExcelFiles] = useState([]);
  // State to handle and display errors
  const [error, setError] = useState(null);
  // State to toggle display of original file contents
  const [showOriginalFiles, setShowOriginalFiles] = useState(false);

  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  // Function to process an individual Excel file
  const processFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Convert file to array buffer
          const data = new Uint8Array(e.target.result);
          // Read the Excel workbook
          const workbook = XLSX.read(data, { type: "array" });
          // Get the first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // Convert sheet to JSON
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve({ name: file.name, data: json });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // Callback function for handling file drops
  const onDrop = useCallback(
    (acceptedFiles) => {
      Promise.all(acceptedFiles.map(processFile))
        .then((newFiles) => {
          // Add new files to the existing list
          setExcelFiles((prevFiles) => [...prevFiles, ...newFiles]);
          setError(null);
        })
        .catch((error) => {
          console.error("Error processing files:", error);
          setError("Error processing files. Please try again.");
        });
    },
    [processFile],
  );

  // Set up react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // Accept only Excel file formats
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: true,
    onDropRejected: () => {
      setError("Please upload only Excel files (.xlsx or .xls)");
    },
  });

  // Calculate shared columns across all uploaded files
  const sharedColumns = useMemo(() => {
    if (excelFiles.length < 2) return [];
    const allColumns = excelFiles.map((file) =>
      Object.keys(file.data[0] || {}),
    );
    return allColumns.reduce((shared, current) =>
      shared.filter((column) => current.includes(column)),
    );
  }, [excelFiles]);

  // Function to delete a file from the list
  const deleteFile = useCallback((indexToDelete) => {
    setExcelFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToDelete),
    );
  }, []);

  // Function to replace a file in the list
  const replaceFile = useCallback(
    async (indexToReplace, newFile) => {
      try {
        const processedFile = await processFile(newFile);
        setExcelFiles((prevFiles) =>
          prevFiles.map((file, index) =>
            index === indexToReplace ? processedFile : file,
          ),
        );
      } catch (error) {
        console.error("Error replacing file:", error);
        setError("Error replacing file. Please try again.");
      }
    },
    [processFile],
  );

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? "text-white" : "text-indigo-600"}`}
        >
          Excel File Comparison
        </h1>

        {/* Dropzone for file uploads */}
        <div
          {...getRootProps()}
          className={`mb-6 p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <input {...getInputProps()} />
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {isDragActive
              ? "Drop the Excel files here ..."
              : "Drag 'n' drop Excel files here, or click to select files"}
          </p>
        </div>

        {/* Error display */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* List of uploaded files */}
        {excelFiles.length > 0 && (
          <FileList>
            {excelFiles.map((file, index) => (
              <FileListItem
                key={index}
                fileName={file.name}
                onReplace={(e) => replaceFile(index, e.target.files[0])}
                onDelete={() => deleteFile(index)}
              />
            ))}
          </FileList>
        )}

        {/* Display shared columns when more than one file is uploaded */}
        {excelFiles.length > 1 && (
          <SharedColumnsContainer>
            {sharedColumns.length > 0 ? (
              <SharedColumnsList columns={sharedColumns} />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                No Shared Columns Found
              </p>
            )}
          </SharedColumnsContainer>
        )}

        {/* Toggle button to show/hide original file contents */}
        {excelFiles.length > 0 && (
          <ToggleButton
            onClick={() => setShowOriginalFiles(!showOriginalFiles)}
            showOriginalFiles={showOriginalFiles}
          />
        )}

        {/* Display original file contents when toggled */}
        {showOriginalFiles &&
          excelFiles.map((file) => <FileTable key={file.name} file={file} />)}
      </div>
    </MainLayout>
  );
}
