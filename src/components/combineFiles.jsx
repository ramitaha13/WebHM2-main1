import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
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
import { useDarkMode } from "../Style/DarkModeContext"; // Import useDarkMode from your context

// Optimized Excel date conversion function
const EXCEL_DATE_OFFSET = 25569;
const MS_PER_DAY = 86400000;
function excelDateToJSDate(serial) {
  // Check if the serial number is within a reasonable date range
  if (serial < 1 || serial > 2958465) { // 2958465 is Excel's representation of 9999-12-31
    return null;
  }
  return new Date((serial - EXCEL_DATE_OFFSET) * MS_PER_DAY);
}

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).replace(",", "");
}

export default function CombineFiles() {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context
  const [excelFiles, setExcelFiles] = useState([]);
  const [columns, setColumns] = useState({});
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [sharedColumns, setSharedColumns] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const rowsPerPage = 100;

  const fileInputRef = useRef(null);

  const processExcelFile = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const validHeaders = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = worksheet[XLSX.utils.encode_cell({r:range.s.r, c:C})];
          if (cell && cell.v !== undefined && cell.v !== "") {
            validHeaders.push(cell.v);
          }
        }

        resolve({ name: file.name, worksheet, headers: validHeaders });
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    setIsProcessing(true);
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
      setIsProcessing(false);
    });
  }, [processExcelFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: true,
    onDropRejected: () => {
      setError("Please upload only Excel files (.xlsx or .xls)");
    },
  });

  const handleColumnSelect = useCallback((fileName, column) => {
    setSelectedColumns((prev) => {
      const existingIndex = prev.findIndex(
        (col) => col.column === column && col.fileName === fileName
      );
      if (existingIndex !== -1) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, { fileName, column }];
      }
    });
  }, []);

  const handleSharedColumnSelect = useCallback(
    (column) => {
      setSelectedColumns((prev) => {
        const isColumnSelected = Object.keys(columns).every((fileName) =>
          prev.some(
            (col) => col.column === column && col.fileName === fileName
          )
        );

        if (isColumnSelected) {
          return prev.filter((col) => col.column !== column);
        } else {
          const newSelections = Object.keys(columns)
            .filter(
              (fileName) =>
                !prev.some(
                  (col) => col.fileName === fileName && col.column === column
                )
            )
            .map((fileName) => ({
              fileName,
              column,
            }));
          return [...prev, ...newSelections];
        }
      });
    },
    [columns]
  );

  const handleDeleteFile = useCallback((fileName) => {
    setExcelFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      delete newColumns[fileName];
      return newColumns;
    });
    setSelectedColumns((prevSelected) =>
      prevSelected.filter((col) => col.fileName !== fileName)
    );
  }, []);

  const handleReplaceFile = useCallback(
    (fileName) => {
      fileInputRef.current.click();
      fileInputRef.current.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const processedFile = await processExcelFile(file);
          setExcelFiles((prevFiles) =>
            prevFiles.map((f) => (f.name === fileName ? processedFile : f))
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
                : col
            )
          );
        }
      };
    },
    [processExcelFile]
  );

  const combinedData = useMemo(() => {
    const data = {};
    selectedColumns.forEach(({ fileName, column }) => {
      if (!data[column]) {
        data[column] = [];
      }
      const file = excelFiles.find((f) => f.name === fileName);
      if (file) {
        const range = XLSX.utils.decode_range(file.worksheet['!ref']);
        const columnIndex = file.headers.indexOf(column);
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const cell = file.worksheet[XLSX.utils.encode_cell({r:R, c:columnIndex})];
          let value = cell ? cell.v : undefined;
          if (typeof value === "number") {
            const dateValue = excelDateToJSDate(value);
            if (dateValue && !isNaN(dateValue.getTime())) {
              value = formatDate(dateValue);
            }
          }
          data[column].push(value);
        }
      }
    });
    return data;
  }, [selectedColumns, excelFiles]);

  const previewData = useMemo(() => {
    const columns = Object.keys(combinedData);
    const maxLength = Math.max(
      ...columns.map((col) => combinedData[col].length)
    );

    return Array.from({ length: maxLength }, (_, rowIndex) => {
      const rowData = {};
      columns.forEach((column) => {
        rowData[column] = combinedData[column][rowIndex] || "";
      });
      return rowData;
    });
  }, [combinedData]);

  const totalPages = Math.ceil(previewData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return previewData.slice(startIndex, startIndex + rowsPerPage);
  }, [previewData, currentPage]);

  const downloadFilteredExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(previewData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Combined Data");
    XLSX.writeFile(workbook, "combined_data.xlsx");
  }, [previewData]);

  useEffect(() => {
    if (Object.keys(columns).length > 0) {
      const allColumns = Object.values(columns).flat();
      const shared = [
        ...new Set(
          allColumns.filter((column) =>
            Object.values(columns).every((fileColumns) =>
              fileColumns.includes(column)
            )
          )
        ),
      ];
      setSharedColumns(shared);
    }
  }, [columns]);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-indigo-600'}`}>
          Multi-Excel Column Selector
        </h1>

        <DropZone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />

        {error && <ErrorMessage message={error} />}

        {isProcessing && <p>Processing files, please wait...</p>}

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

        {previewData.length > 0 && (
          <DataPreview
            previewData={paginatedData}
            selectedColumns={selectedColumns}
            downloadFilteredExcel={downloadFilteredExcel}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".xlsx,.xls"
      />
    </MainLayout>
  );
}