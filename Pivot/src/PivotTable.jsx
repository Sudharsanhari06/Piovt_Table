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

  const windowPrint = () => {
    window.print();
  }

  // unique row and col
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


  const pivot = {};
  rowKeys.forEach((rk) => {
    pivot[rk] = {};
    colKeys.forEach((ck) => {
      pivot[rk][ck] = [];
    });
  });

  data.forEach((item) => {
    const rk = rows.map((r) => item[r]).join(" | ");
    const ck = columns.map((c) => item[c]).join(" | ");
    const raw = item[values[0]];
    const num = Number(raw);
    if (!isNaN(num)) pivot[rk][ck].push(num);
  });


  // Aggregation function
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

  //  row and col totals
  const rowTotals = rowKeys.map((rk) =>
    colKeys.reduce((sum, ck) => sum + aggregate(pivot[rk][ck]), 0)
  );
  const colTotals = colKeys.map((ck) =>
    rowKeys.reduce((sum, rk) => sum + aggregate(pivot[rk][ck]), 0)
  );
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="pivot-table">
      {/* <table>
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
      </table> */}
      <table>
        {/* <thead>
          <tr>
            {rows.map((r) => (
              <th key={r}>{r}</th>
            ))}
            {colKeys.map((ck) => (
              <th key={ck}>{ck}</th>
            ))}
            <th>Row Total</th>
          </tr>
        </thead> */}
        <thead>
          {/* First row: row fields + top-level column groups */}
          <tr>
            {rows.map((r) => (
              <th key={r} rowSpan={columns.length}>{r}</th>
            ))}
            {(() => {
              const topLevelHeaders = [...new Set(colKeys.map(ck => ck.split(" | ")[0]))];
              return topLevelHeaders.map(name => {
                const colSpan = colKeys.filter(ck => ck.startsWith(name + " |")).length;
                return <th key={name} colSpan={colSpan}>{name}</th>;
              });
            })()}
            <th rowSpan={columns.length}>Row Total</th>
          </tr>

          {/* Second row: sub-group headers (only if more than one column field) */}
          <tr>
    {colKeys.map((ck, i) => {
      const subHeader = ck.split(" | ")[1]; // Date
      return <th key={`sub-${i}`}>{subHeader}</th>;
    })}
  </tr>
        
        </thead>

        <tbody>
          {rowKeys.map((rk, ri) => {
            const rowValues = rk.split(" | ");
            return (
              <tr key={rk}>
                {rowValues.map((v, i) => (
                  <td key={i}>{v}</td>
                ))}
                {colKeys.map((ck) => (
                  <td key={ck}>
                    {aggregate(pivot[rk][ck]).toFixed(0)}
                  </td>
                ))}
                <td>{rowTotals[ri].toFixed(0)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={rows.length}>Column Total</td>
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


      <button onClick={windowPrint} className="print-btn">Print</button>
    </div>
  );
};
export default PivotTable;
