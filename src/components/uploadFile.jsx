import React, { useState, useMemo } from "react";
import MainLayout from "../layouts/mainLayout";
import * as XLSX from "xlsx";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function UploadFile() {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({
    x: "",
    y: "",
    pie: "",
    table: [],
  });
  const [filters, setFilters] = useState({});
  const [currentFilter, setCurrentFilter] = useState("");

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    }
  };

  const handleColumnSelect = (type, column) => {
    setSelectedColumns((prev) => ({ ...prev, [type]: column }));
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [column]: value };
      if (value === "") {
        delete newFilters[column];
      }
      return newFilters;
    });
    // Removed setCurrentFilter("") from here
  };

  const clearFilter = (column) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
    if (currentFilter === column) {
      setCurrentFilter("");
    }
  };

  const prepareLineChartData = () => {
    if (!excelData || !selectedColumns.x || !selectedColumns.y) return null;

    const labels = excelData.map((row) => row[selectedColumns.x]);
    const data = excelData.map((row) => row[selectedColumns.y]);

    return {
      labels,
      datasets: [
        {
          label: selectedColumns.y,
          data: data,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  const preparePieChartData = () => {
    if (!excelData || !selectedColumns.pie) return null;

    const data = excelData.reduce((acc, row) => {
      const value = row[selectedColumns.pie];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    };
  };

  const filteredData = useMemo(() => {
    if (!excelData) return [];
    return excelData.filter((row) =>
      Object.entries(filters).every(
        ([key, value]) =>
          value === "" ||
          row[key].toString().toLowerCase().includes(value.toLowerCase()),
      ),
    );
  }, [excelData, filters]);

  const lineChartData = prepareLineChartData();
  const pieChartData = preparePieChartData();

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Upload Excel & Visualize Data
        </h3>

        <form className="mb-6" onSubmit={handleFileSubmit}>
          <input
            type="file"
            className="block w-full text-sm text-gray-500 dark:text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              dark:file:bg-blue-900 dark:file:text-blue-200
              dark:hover:file:bg-blue-800"
            required
            onChange={handleFile}
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            UPLOAD
          </button>
          {typeError && (
            <div
              className="mt-4 p-4 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-200"
              role="alert"
            >
              {typeError}
            </div>
          )}
        </form>

        {excelData && (
          <div className="mb-4">
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Select Columns for Graphs
            </h4>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Line Chart X-Axis
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => handleColumnSelect("x", e.target.value)}
                >
                  <option value="">Select column</option>
                  {excelData &&
                    Object.keys(excelData[0]).map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Line Chart Y-Axis
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => handleColumnSelect("y", e.target.value)}
                >
                  <option value="">Select column</option>
                  {excelData &&
                    Object.keys(excelData[0]).map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pie Chart Data
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => handleColumnSelect("pie", e.target.value)}
                >
                  <option value="">Select column</option>
                  {excelData &&
                    Object.keys(excelData[0]).map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {lineChartData && (
            <div className="mt-4 w-full lg:w-1/2">
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Line Chart
              </h4>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: "rgb(156, 163, 175)",
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: "rgb(156, 163, 175)" },
                        grid: { color: "rgba(156, 163, 175, 0.2)" },
                      },
                      y: {
                        ticks: { color: "rgb(156, 163, 175)" },
                        grid: { color: "rgba(156, 163, 175, 0.2)" },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {pieChartData && (
            <div className="mt-4 w-full lg:w-1/2">
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Pie Chart
              </h4>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: "rgb(156, 163, 175)",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {excelData && (
          <div className="mt-6">
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Data Table with Filters
            </h4>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={(e) => setCurrentFilter(e.target.value)}
                value={currentFilter}
              >
                <option value="">Select a filter</option>
                {excelData &&
                  Object.keys(excelData[0]).map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
              </select>
              {currentFilter && (
                <input
                  type="text"
                  className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={`Filter ${currentFilter}`}
                  onChange={(e) =>
                    handleFilterChange(currentFilter, e.target.value)
                  }
                  value={filters[currentFilter] || ""}
                />
              )}
            </div>
            <div className="mb-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Filters:
              </h5>
              <div className="flex flex-wrap mt-1">
                {Object.entries(filters).map(
                  ([key, value]) =>
                    value && (
                      <span
                        key={key}
                        className="mr-2 mb-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
                      >
                        {key}: {value}
                        <button
                          className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                          onClick={() => clearFilter(key)}
                        >
                          ×
                        </button>
                      </span>
                    ),
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    {excelData &&
                      Object.keys(excelData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(row).map((key) => (
                        <td
                          key={key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                        >
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
