import React from "react";
const RawPreview = ({ data }) => {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]).filter(h => h !== "__parsed_extra");

  return (
    <section className="csv-preview">
      <h2>CSV Data Preview</h2>
      <div className="table-container">
        <table border="2">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((key, cellIndex) => (
                  <td key={cellIndex}>{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RawPreview;
