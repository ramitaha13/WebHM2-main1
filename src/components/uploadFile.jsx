import React, { useState, useMemo } from "react";
import MainLayout from "../layouts/mainLayout";
import * as XLSX from "xlsx";
import { Line, Bar, Pie, Scatter, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

export default function UploadFile() {
  const [excelFiles, setExcelFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [typeError, setTypeError] = useState("");

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return ['xlsx', 'xls', 'csv'].includes(fileExtension);
    });

    if (validFiles.length !== files.length) {
      setTypeError("Please upload only Excel files (.xlsx, .xls, .csv)");
      return;
    }

    const newFiles = validFiles.map(file => ({
      file,
      data: null,
      chartConfig: {
        chartType: "",
        xAxis: "",
        yAxis: "",
      }
    }));

    setExcelFiles(prevFiles => [...prevFiles, ...newFiles]);
    setTypeError("");
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (excelFiles.length === 0) {
      setTypeError("Please upload a file.");
      return;
    }

    const updatedFiles = await Promise.all(excelFiles.map(async (fileObj) => {
      if (fileObj.data) return fileObj;

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const binaryString = event.target.result;
          const workbook = XLSX.read(binaryString, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Convert timestamp to desired format
          data.forEach((row, index) => {
            if (index > 0 && row[0]) {
              const date = XLSX.SSF.parse_date_code(row[0]);
              row[0] = `${date.d.toString().padStart(2, '0')}/${date.m.toString().padStart(2, '0')}/${date.y} ${date.H.toString().padStart(2, '0')}:${date.M.toString().padStart(2, '0')}`;
            }
          });

          resolve({ ...fileObj, data });
        };

        reader.onerror = (error) => {
          setTypeError("Error reading file.");
          console.error(error);
          resolve(fileObj);
        };

        reader.readAsBinaryString(fileObj.file);
      });
    }));

    setExcelFiles(updatedFiles);
    setCurrentFileIndex(0);
    setTypeError("");
  };

  const selectFile = (index) => {
    setCurrentFileIndex(index);
  };

  const deleteFile = (index) => {
    const newFiles = excelFiles.filter((_, i) => i !== index);
    setExcelFiles(newFiles);

    if (index === currentFileIndex) {
      if (newFiles.length === 0) {
        setCurrentFileIndex(null);
      } else {
        setCurrentFileIndex(Math.min(currentFileIndex, newFiles.length - 1));
      }
    }
  };

  const updateChartConfig = (key, value) => {
    setExcelFiles(prevFiles => prevFiles.map((file, index) => 
      index === currentFileIndex 
        ? { ...file, chartConfig: { ...file.chartConfig, [key]: value } }
        : file
    ));
  };

  const chartData = useMemo(() => {
    if (currentFileIndex === null) return null;

    const currentFile = excelFiles[currentFileIndex];
    const { data, chartConfig } = currentFile;

    if (data && chartConfig.xAxis && chartConfig.yAxis) {
      const xIndex = data[0].indexOf(chartConfig.xAxis);
      const yIndex = data[0].indexOf(chartConfig.yAxis);

      const labels = data.slice(1).map((row) => row[xIndex]);
      const chartValues = data.slice(1).map((row) => row[yIndex]);

      if (chartConfig.chartType === "line") {
        return {
          labels,
          datasets: [
            {
              label: chartConfig.yAxis,
              data: chartValues,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
      } else if (chartConfig.chartType === "bar") {
        return {
          labels,
          datasets: [
            {
              label: chartConfig.yAxis,
              data: chartValues,
              backgroundColor: "rgba(0, 119, 182, 0.6)",
              borderColor: "rgba(0, 119, 182, 1)",
              borderWidth: 1,
            },
          ],
        };
      } else if (chartConfig.chartType === "pie") {
        const uniqueLabels = [...new Set(labels)];
        const dataCount = uniqueLabels.map((label) =>
          labels.filter((l) => l === label).length
        );
        return {
          labels: uniqueLabels,
          datasets: [
            {
              data: dataCount,
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(153, 102, 255, 0.8)",
              ],
            },
          ],
        };
      } else if (chartConfig.chartType === "scatter") {
        return {
          labels,
          datasets: [
            {
              label: chartConfig.yAxis,
              data: data.slice(1).map((row) => ({
                x: row[xIndex],
                y: row[yIndex],
              })),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgb(75, 192, 192)",
            },
          ],
        };
      } else if (chartConfig.chartType === "radar") {
        return {
          labels,
          datasets: [
            {
              label: chartConfig.yAxis,
              data: chartValues,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgb(75, 192, 192)",
            },
          ],
        };
      }
    }
    return null;
  }, [excelFiles, currentFileIndex]);

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Upload Excel & Analyze Data
        </h3>

        <form className="mb-6" onSubmit={handleFileSubmit}>
          <input
            type="file"
            multiple
            accept=".xlsx,.xls,.csv"
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

        {excelFiles.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Uploaded Files
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {excelFiles.map((fileObj, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    index === currentFileIndex
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500"
                  }`}
                  onClick={() => selectFile(index)}
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {(fileObj.file.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(index);
                    }}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentFileIndex !== null && excelFiles[currentFileIndex].data && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Chart Configuration
            </h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chart Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                value={excelFiles[currentFileIndex].chartConfig.chartType}
                onChange={(e) => updateChartConfig("chartType", e.target.value)}
              >
                <option value="">Select Chart Type</option>
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
                <option value="scatter">Scatter</option>
                <option value="radar">Radar</option>
              </select>
            </div>

            {excelFiles[currentFileIndex].chartConfig.chartType && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    X-Axis
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    value={excelFiles[currentFileIndex].chartConfig.xAxis}
                    onChange={(e) => updateChartConfig("xAxis", e.target.value)}
                  >
                    <option value="">Select X-Axis</option>
                    {excelFiles[currentFileIndex].data[0].map((colName, index) => (
                      <option key={index} value={colName}>
                        {colName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Y-Axis
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    value={excelFiles[currentFileIndex].chartConfig.yAxis}
                    onChange={(e) => updateChartConfig("yAxis", e.target.value)}
                  >
                    <option value="">Select Y-Axis</option>
                    {excelFiles[currentFileIndex].data[0].map((colName, index) => (
                      <option key={index} value={colName}>
                        {colName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {excelFiles[currentFileIndex].chartConfig.chartType && chartData && (
              <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                {excelFiles[currentFileIndex].chartConfig.chartType === "line" && <Line data={chartData} />}
                {excelFiles[currentFileIndex].chartConfig.chartType === "bar" && <Bar data={chartData} />}
                {excelFiles[currentFileIndex].chartConfig.chartType === "pie" && <Pie data={chartData} />}
                {excelFiles[currentFileIndex].chartConfig.chartType === "scatter" && <Scatter data={chartData} />}
                {excelFiles[currentFileIndex].chartConfig.chartType === "radar" && <Radar data={chartData} />}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}