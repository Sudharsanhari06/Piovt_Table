import React from "react";

function PivotTable({ data, rows, columns, values, aggregation }) {
  if (!data || data.length === 0) {
    return <div>No data loaded</div>;
  }

  if (rows.length === 0 || columns.length === 0 || values.length === 0) {
    return <div style={{ color: "gray" }}>Please drag at least one Row, one Column, and one Value.</div>;
  }

  const pivot = {};

  data.forEach((row) => {
    const rowKey = rows.map((r) => row[r]).join("|");
    const columnKey = columns.map((c) => row[c]).join("|");

    if (!pivot[rowKey]) {
      pivot[rowKey] = {};
    }
    if (!pivot[rowKey][columnKey]) {
      pivot[rowKey][columnKey] = [];
    }

    const val = parseFloat(row[values[0]]) || 0;
    pivot[rowKey][columnKey].push(val);
  });

  const aggregate = (values) => {
    switch (aggregation) {
      case "sum":
        return values.reduce((a, b) => a + b, 0);
      case "count":
        return values.length;
      case "avg":
        return values.reduce((a, b) => a + b, 0) / values.length;
      default:
        return 0;
    }
  };

  const uniqueColumns = Array.from(
    new Set(
      data.map((row) => columns.map((c) => row[c]).join("|"))
    )
  );

  const uniqueRows = Array.from(
    new Set(
      data.map((row) => rows.map((r) => row[r]).join("|"))
    )
  );

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>{rows.join(", ")}</th>
          {uniqueColumns.map((col) => (
            <th key={col} style={thStyle}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {uniqueRows.map((rowKey) => (
          <tr key={rowKey}>
            <td style={tdStyle}>{rowKey}</td>
            {uniqueColumns.map((colKey) => (
              <td key={colKey} style={tdStyle}>
                {pivot[rowKey] && pivot[rowKey][colKey]
                  ? aggregate(pivot[rowKey][colKey]).toFixed(2)
                  : "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f0f0f0",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default PivotTable;
