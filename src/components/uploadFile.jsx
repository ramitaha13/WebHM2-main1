// UploadFile.jsx
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
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
} from "chart.js";
import MainLayout from "../layouts/mainLayout";
import {
  Container,
  PageTitle,
  UploadButton,
  FileInput,
  Grid,
  Card,
  CardTitle,
  FileList,
  FileItem,
  FileName,
  DeleteButton,
  Label,
  Select,
  GenerateButton,
  ChartContainer,
} from "../Style/uploadFileStyle";

// Register ChartJS components
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
);

const UploadFile = () => {
  // State variables
  const [files, setFiles] = useState([]); // Array of uploaded files
  const [selectedFile, setSelectedFile] = useState(null); // Currently selected file
  const [columns, setColumns] = useState([]); // Columns from the selected file
  const [chartData, setChartData] = useState(null); // Data for the chart
  const [chartType, setChartType] = useState(""); // Type of chart to display
  const [xAxis, setXAxis] = useState(""); // Selected X-axis
  const [yAxis, setYAxis] = useState(""); // Selected Y-axis
  const fileInputRef = useRef(null); // Reference to the file input element

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setColumns(jsonData[0]); // Set columns from the first row
      // Reset chart-related states
      setChartType("");
      setXAxis("");
      setYAxis("");
      setChartData(null);
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle file deletion
  const deleteFile = (fileToDelete) => {
    setFiles(files.filter((file) => file !== fileToDelete));
    if (selectedFile === fileToDelete) {
      // Reset states if the deleted file was selected
      setSelectedFile(null);
      setColumns([]);
      setChartType("");
      setXAxis("");
      setYAxis("");
      setChartData(null);
    }
  };

  // Generate chart data
  const generateChart = () => {
    if (!selectedFile || !chartType || !xAxis || !yAxis) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const labels = jsonData.map((row) => row[xAxis]);
      const values = jsonData.map((row) => row[yAxis]);

      const datasets = [
        {
          label: yAxis,
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ];

      if (chartType === "pie") {
        // Special handling for pie charts
        const uniqueLabels = [...new Set(labels)];
        const data = uniqueLabels.map((label) =>
          values
            .filter((_, index) => labels[index] === label)
            .reduce((a, b) => a + b, 0),
        );
        setChartData({
          labels: uniqueLabels,
          datasets: [
            { data, backgroundColor: generateColors(uniqueLabels.length) },
          ],
        });
      } else {
        setChartData({ labels, datasets });
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  // Generate colors for pie chart
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`);
    }
    return colors;
  };

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    if (!chartData) return null;

    const options = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        },
      },
    };

    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={options} />;
      case "line":
        return <Line data={chartData} options={options} />;
      case "pie":
        return <Pie data={chartData} options={options} />;
      case "scatter":
        return <Scatter data={chartData} options={options} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Container>
        <PageTitle>Excel File Analyzer</PageTitle>

        {/* File upload section */}
        <div>
          <UploadButton htmlFor="file-upload">Upload Excel Files</UploadButton>
          <FileInput
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv"
            multiple
          />
        </div>

        <Grid>
          {/* Uploaded files list */}
          <Card>
            <CardTitle>Uploaded Files</CardTitle>
            <FileList>
              {files.map((file, index) => (
                <FileItem key={index}>
                  <FileName onClick={() => handleFileSelect(file)}>
                    {file.name}
                  </FileName>
                  <DeleteButton onClick={() => deleteFile(file)}>
                    Delete
                  </DeleteButton>
                </FileItem>
              ))}
            </FileList>
          </Card>

          {/* Chart configuration section */}
          {selectedFile && (
            <Card>
              <CardTitle>Chart Configuration</CardTitle>
              <div>
                <Label>Chart Type</Label>
                <Select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="">Select Chart Type</option>
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="scatter">Scatter Plot</option>
                </Select>
                {chartType && (
                  <>
                    <Label>X-Axis</Label>
                    <Select
                      value={xAxis}
                      onChange={(e) => setXAxis(e.target.value)}
                    >
                      <option value="">Select X-Axis</option>
                      {columns.map((col, index) => (
                        <option key={index} value={col}>
                          {col}
                        </option>
                      ))}
                    </Select>
                    <Label>Y-Axis</Label>
                    <Select
                      value={yAxis}
                      onChange={(e) => setYAxis(e.target.value)}
                    >
                      <option value="">Select Y-Axis</option>
                      {columns.map((col, index) => (
                        <option key={index} value={col}>
                          {col}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
                <GenerateButton onClick={generateChart}>
                  Generate Chart
                </GenerateButton>
              </div>
            </Card>
          )}
        </Grid>

        {/* Chart display section */}
        {chartData && (
          <Card>
            <CardTitle>Chart</CardTitle>
            <ChartContainer>{renderChart()}</ChartContainer>
          </Card>
        )}
      </Container>
    </MainLayout>
  );
};

export default UploadFile;