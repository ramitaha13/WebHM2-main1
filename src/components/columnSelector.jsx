import React, { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import MainLayout from "../layouts/mainLayout";

export default function ColumnSelector() {
  const [excelFiles, setExcelFiles] = useState([]);
  const [columns, setColumns] = useState({});
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    Promise.all(
      acceptedFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: "array" });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];

              // Get the header row
              const headerRow = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
              })[0];

              // Filter out empty headers
              const validHeaders = headerRow.filter(
                (header) => header !== undefined && header !== "",
              );

              // Use the valid headers to parse the rest of the data
              const json = XLSX.utils.sheet_to_json(worksheet, {
                header: validHeaders,
                range: 1,
              });

              resolve({ name: file.name, data: json, headers: validHeaders });
            };
            reader.readAsArrayBuffer(file);
          }),
      ),
    ).then((filesData) => {
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
  }, []);

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

  const combinedData = useMemo(() => {
    return selectedColumns.map(({ fileName, column }) => {
      const file = excelFiles.find((f) => f.name === fileName);
      return {
        [column]: file.data.map((row) => row[column]),
      };
    });
  }, [selectedColumns, excelFiles]);

  const previewData = useMemo(() => {
    return combinedData.reduce((acc, curr) => {
      const key = Object.keys(curr)[0];
      curr[key].forEach((value, index) => {
        if (!acc[index]) acc[index] = {};
        acc[index][key] = value;
      });
      return acc;
    }, []);
  }, [combinedData]);

  const downloadFilteredExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(previewData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Combined Data");
    XLSX.writeFile(workbook, "combined_data.xlsx");
  }, [previewData]);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Multi-Excel Column Selector
        </h1>

        <DropZone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />

        {error && <ErrorMessage message={error} />}

        {Object.keys(columns).length > 0 && (
          <ColumnSelection
            columns={columns}
            selectedColumns={selectedColumns}
            handleColumnSelect={handleColumnSelect}
          />
        )}

        {previewData.length > 0 && (
          <DataPreview
            previewData={previewData}
            selectedColumns={selectedColumns}
            downloadFilteredExcel={downloadFilteredExcel}
          />
        )}
      </div>
    </MainLayout>
  );
}

const DropZone = React.memo(({ getRootProps, getInputProps, isDragActive }) => (
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
));

const ErrorMessage = React.memo(({ message }) => (
  <p className="text-red-500 mb-4">{message}</p>
));

const ColumnSelection = React.memo(
  ({ columns, selectedColumns, handleColumnSelect }) => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        Select Columns
      </h2>
      {Object.entries(columns).map(([fileName, fileColumns]) => (
        <div key={fileName} className="mb-4">
          <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
            {fileName}
          </h3>
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

const DataPreview = React.memo(
  ({ previewData, selectedColumns, downloadFilteredExcel }) => (
    <>
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        Preview
      </h2>
      <div className="mb-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectedColumns.map(({ column }) => (
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
            {previewData.slice(0, 10).map((row, index) => (
              <tr key={index}>
                {selectedColumns.map(({ column }) => (
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

      <button
        onClick={downloadFilteredExcel}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
      >
        Download Combined Excel
      </button>
    </>
  ),
);
