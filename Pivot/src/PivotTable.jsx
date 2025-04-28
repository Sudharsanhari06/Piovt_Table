// PivotTable.jsx
import React from "react";
import "./App.css";

const PivotTable = ({
  data,
  rows,
  columns,
  values,
  aggregation,
}) => {
  if (!data.length) return null;
  if (!rows.length || !columns.length || !values.length) {
    return (
      <div style={{ color: "gray", marginTop: 20 }}>
        Drag at least 1 Row, 1 Column and 1 Value.
      </div>
    );
  }

  // 1) Build unique row-keys and col-keys
  const rowKeys = [
    ...new Set(
      data.map((item) => rows.map((r) => item[r]).join(" | "))
    ),
  ];
  const colKeys = [
    ...new Set(
      data.map((item) => columns.map((c) => item[c]).join(" | "))
    ),
  ];

  // 2) Initialize pivot structure
  const pivot = {};
  rowKeys.forEach((rk) => {
    pivot[rk] = {};
    colKeys.forEach((ck) => {
      pivot[rk][ck] = [];
    });
  });

  // 3) Fill pivot with numeric values
  data.forEach((item) => {
    const rk = rows.map((r) => item[r]).join(" | ");
    const ck = columns.map((c) => item[c]).join(" | ");
    const raw = item[values[0]];
    const num = Number(raw);
    if (!isNaN(num)) pivot[rk][ck].push(num);
  });

  // 4) Aggregation function
  const aggregate = (arr) => {
    if (aggregation === "Sum") {
      return arr.reduce((a, b) => a + b, 0);
    }
    if (aggregation === "Avg") {
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    if (aggregation === "Count") {
      return arr.length;
    }
    return 0;
  };

  // 5) Compute row totals & col totals
  const rowTotals = rowKeys.map((rk) =>
    colKeys.reduce((sum, ck) => sum + aggregate(pivot[rk][ck]), 0)
  );
  const colTotals = colKeys.map((ck) =>
    rowKeys.reduce((sum, rk) => sum + aggregate(pivot[rk][ck]), 0)
  );
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="pivot-table">
      <table>
        <thead>
          <tr>
            <th >{rows.join(", ")}</th>
            {colKeys.map((ck) => (
              <th key={ck}>
                {ck}
              </th>
            ))}
            <th >Row Total</th>
          </tr>
        </thead>
        <tbody>
          {rowKeys.map((rk, ri) => (
            <tr key={rk}>
              <td >{rk}</td>
              {colKeys.map((ck) => (
                <td key={ck}>
                  {aggregate(pivot[rk][ck]).toFixed(0)}
                </td>
              ))}
              <td>
                {rowTotals[ri].toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Column Total</td>
            {colTotals.map((ct, i) => (
              <td key={i} >
                {ct.toFixed(0)}
              </td>
            ))}
            <td>
              {grandTotal.toFixed(0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default PivotTable;
