import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import XLSX from "xlsx";

function App() {
  const [csvData, setCsvData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        setCsvData(results.data);
      
        
         axios.post("http://127.0.0.1:8000/upload-csv/", results.data)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      },
    });
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleFilterClick = () => {
    // Send an AJAX request to the backend to get the filtered data
    let filteredData = csvData;
    if (startDate && endDate) {
      filteredData = csvData.filter(
        (row) =>
          new Date(row.timestamp) >= new Date(startDate) &&
          new Date(row.timestamp) <= new Date(endDate)
      );
    }
    setCsvData(filteredData);
    // // Get the distinct count of objects_detected
    // const distinctCount = new Set(filteredData.map((row) => row.objects_detected)).size;
    // console.log(distinctCount);
  
    //  filtered data to excel
    // const worksheet = XLSX.utils.json_to_sheet(filteredData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // XLSX.writeFile(workbook, "filtered_data.xlsx");
  };
  return (
    <div>
      <p>Upload a CSV file:</p>
      <input type="file" onChange={handleCsvUpload} accept=".csv" />
      {csvData && (
        <div>
          <p>Select date range:</p>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <input type="date" value={endDate} onChange={handleEndDateChange} />
          <button onClick={handleFilterClick}>Filter</button>
          <p>Filtered results:</p>
          <table>
            <thead>
              <tr>
                <th>Image Name</th>
                <th>Objects Detected</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  <td>{row.image_name}</td>
                  <td>{row.objects_detected}</td>
                  <td>{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default App;