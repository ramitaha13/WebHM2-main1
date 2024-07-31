import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import MainLayout from "../layouts/mainLayout";
import {
  DropZone,
  ErrorMessage,
  SharedColumnSelection,
  ColumnSelection,
  DataPreview,
} from "../Style/combineFilesStyle";

// Function to convert Excel date serial number to JavaScript Date object
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;
  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds,
  );
}

// Function to format a Date object into a string
function formatDate(date) {
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

export default function CombineFiles() {
  // State variables
  const [excelFiles, setExcelFiles] = useState([]); // Stores processed Excel files
  const [columns, setColumns] = useState({}); // Stores column headers for each file
  const [selectedColumns, setSelectedColumns] = useState([]); // Stores user-selected columns
  const [sharedColumns, setSharedColumns] = useState([]); // Stores columns common to all files
  const [error, setError] = useState(null); // Stores error messages
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const rowsPerPage = 10; // Number of rows to display per page

  const fileInputRef = useRef(null); // Reference to hidden file input for file replacement

  // Function to process an Excel file
  const processExcelFile = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Extract and filter valid headers
        const headerRow = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        })[0];
        const validHeaders = headerRow.filter(
          (header) => header !== undefined && header !== "",
        );

        // Convert worksheet to JSON
        const json = XLSX.utils.sheet_to_json(worksheet, {
          header: validHeaders,
          range: 1,
          raw: false,
          dateNF: "yyyy-mm-dd hh:mm:ss",
        });

        resolve({ name: file.name, data: json, headers: validHeaders });
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // Function to handle file drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      Promise.all(acceptedFiles.map(processExcelFile)).then((filesData) => {
        setExcelFiles((prevFiles) => [...prevFiles, ...filesData]);
        setColumns((prevColumns) => {
          const newColumns = {};
          filesData.forEach((file) => {
            newColumns[file.name] = file.headers;
          });
          return { ...prevColumns, ...newColumns };
        });
        setError(null);
      });
    },
    [processExcelFile],
  );

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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

  // Function to handle column selection
  const handleColumnSelect = useCallback((fileName, column) => {
    setSelectedColumns((prev) => {
      const existingIndex = prev.findIndex(
        (col) => col.column === column && col.fileName === fileName,
      );
      if (existingIndex !== -1) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, { fileName, column }];
      }
    });
  }, []);

  // Function to handle shared column selection
  const handleSharedColumnSelect = useCallback(
    (column) => {
      setSelectedColumns((prev) => {
        const isColumnSelected = Object.keys(columns).every((fileName) =>
          prev.some(
            (col) => col.column === column && col.fileName === fileName,
          ),
        );

        if (isColumnSelected) {
          return prev.filter((col) => col.column !== column);
        } else {
          const newSelections = Object.keys(columns)
            .filter(
              (fileName) =>
                !prev.some(
                  (col) => col.fileName === fileName && col.column === column,
                ),
            )
            .map((fileName) => ({
              fileName,
              column,
            }));
          return [...prev, ...newSelections];
        }
      });
    },
    [columns],
  );

  // Function to handle file deletion
  const handleDeleteFile = useCallback((fileName) => {
    setExcelFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName),
    );
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      delete newColumns[fileName];
      return newColumns;
    });
    setSelectedColumns((prevSelected) =>
      prevSelected.filter((col) => col.fileName !== fileName),
    );
  }, []);

  // Function to handle file replacement
  const handleReplaceFile = useCallback(
    (fileName) => {
      fileInputRef.current.click();
      fileInputRef.current.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const processedFile = await processExcelFile(file);
          setExcelFiles((prevFiles) =>
            prevFiles.map((f) => (f.name === fileName ? processedFile : f)),
          );
          setColumns((prevColumns) => {
            const newColumns = { ...prevColumns };
            delete newColumns[fileName];
            newColumns[processedFile.name] = processedFile.headers;
            return newColumns;
          });
          setSelectedColumns((prevSelected) =>
            prevSelected.map((col) =>
              col.fileName === fileName
                ? { ...col, fileName: processedFile.name }
                : col,
            ),
          );
        }
      };
    },
    [processExcelFile],
  );

  // Memoized combined data from selected columns
  const combinedData = useMemo(() => {
    const data = {};
    selectedColumns.forEach(({ fileName, column }) => {
      if (!data[column]) {
        data[column] = [];
      }
      const file = excelFiles.find((f) => f.name === fileName);
      if (file) {
        const fileData = file.data.map((row) => {
          const value = row[column];
          return typeof value === "number" && value > 1
            ? formatDate(excelDateToJSDate(value))
            : value;
        });
        data[column] = [...data[column], ...fileData];
      }
    });
    return data;
  }, [selectedColumns, excelFiles]);

  // Memoized preview data
  const previewData = useMemo(() => {
    const columns = Object.keys(combinedData);
    const maxLength = Math.max(
      ...columns.map((col) => combinedData[col].length),
    );

    return Array.from({ length: maxLength }, (_, rowIndex) => {
      const rowData = {};
      columns.forEach((column) => {
        rowData[column] = combinedData[column][rowIndex] || "";
      });
      return rowData;
    });
  }, [combinedData]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(previewData.length / rowsPerPage);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return previewData.slice(startIndex, startIndex + rowsPerPage);
  }, [previewData, currentPage]);

  // Function to download combined data as Excel file
  const downloadFilteredExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(previewData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Combined Data");
    XLSX.writeFile(workbook, "combined_data.xlsx");
  }, [previewData]);

  // Effect to update shared columns when columns change
  useEffect(() => {
    if (Object.keys(columns).length > 0) {
      const allColumns = Object.values(columns).flat();
      const shared = [
        ...new Set(
          allColumns.filter((column) =>
            Object.values(columns).every((fileColumns) =>
              fileColumns.includes(column),
            ),
          ),
        ),
      ];
      setSharedColumns(shared);
    }
  }, [columns]);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Multi-Excel Column Selector
        </h1>

        {/* Dropzone for file upload */}
        <DropZone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />

        {/* Display error message if any */}
        {error && <ErrorMessage message={error} />}

        {/* Display shared column selection and individual column selection if columns exist */}
        {Object.keys(columns).length > 0 && (
          <>
            <SharedColumnSelection
              sharedColumns={sharedColumns}
              selectedColumns={selectedColumns}
              handleSharedColumnSelect={handleSharedColumnSelect}
            />
            <ColumnSelection
              columns={columns}
              selectedColumns={selectedColumns}
              handleColumnSelect={handleColumnSelect}
              handleDeleteFile={handleDeleteFile}
              handleReplaceFile={handleReplaceFile}
            />
          </>
        )}

        {/* Display data preview if there's data to show */}
        {previewData.length > 0 && (
          <DataPreview
            previewData={previewData}
            selectedColumns={selectedColumns}
            downloadFilteredExcel={downloadFilteredExcel}
          />
        )}
      </div>
      {/* Hidden file input for file replacement */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".xlsx,.xls"
      />
    </MainLayout>
  );
}
