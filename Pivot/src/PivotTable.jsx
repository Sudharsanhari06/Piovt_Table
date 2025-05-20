import React from "react";
const PivotTable = ({ data, rows, columns, values, aggregation }) => {
  
  if (!data.length || (rows.length === 0 && columns.length === 0)) return null;

  const rowKeys = [
    ...new Set(data.map((item) => rows.map((r) => item[r] || "").join(" | "))),
  ];

  const colKeys = [
    ...new Set(data.map((item) => columns.map((c) => item[c] || "").join(" | "))),
  ];

  const pivot = {};
  rowKeys.forEach((rk) => {
    pivot[rk] = {};
    colKeys.forEach((ck) => {
      pivot[rk][ck] = [];
    });
  });

  // Fill the pivot data
  data.forEach((item) => {
    const rk = rows.map((r) => item[r] || "").join(" | ");
    const ck = columns.map((c) => item[c] || "").join(" | ");

    const raw = item[values[0]];
    const num = Number(raw);
    if (!isNaN(num)) {
      pivot[rk][ck].push(num);
    }

    // if (values.length) {
    //   const raw = item[values[0]];
    //   const num = Number(raw);
    //   if (!isNaN(num)) pivot[rk][ck].push(num);
    // } else {
    //   // Push 1 to represent a count even if no value field
    //   pivot[rk][ck].push(1);
    // }

  });

  // Aggregation logic
  const aggregate = (arr) => {
    if (!arr || arr.length === 0) return 0;
    if (aggregation === "Sum") return arr.reduce((a, b) => a + b, 0);
    if (aggregation === "Avg") return arr.reduce((a, b) => a + b, 0) / arr.length;
    if (aggregation === "Count") return arr.length;
    return 0;
  };

  // Totals
  const rowTotals = rowKeys.map((rk) =>
    colKeys.reduce((sum, ck) => sum + (Number(aggregate(pivot[rk][ck])) || 0), 0)
  );
  const colTotals = colKeys.map((ck) =>
    rowKeys.reduce((sum, rk) => sum + (Number(aggregate(pivot[rk][ck])) || 0), 0)
  );

  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);
  const showRowTotal = columns.length > 0;
  const showColTotal = rows.length > 0;
  
  return (

    <div className="pivot-table">
      <table>
        <thead>
          {Array.from({ length: columns.length || 1 }).map((_, level) => (
            <tr key={`header-row-${level}`}>
              {level === 0 &&
                rows.map((r, i) => (
                  <th key={`row-header-${i}`} rowSpan={columns.length || 1}>
                    {r}
                  </th>
                ))}
              {colKeys.length > 0 ? (
                colKeys.map((ck, i) => {
                  const parts = ck.split(" | ");
                  return (
                    <th key={`col-header-${i}-${level}`}>
                      {parts[level] || ""}
                    </th>
                  );
                })
              ) : (
                <th>{values[0]}</th>
              )}
              {level === 0 && showRowTotal && <th rowSpan={columns.length}>Row Total</th>}
            </tr>
          ))}
        </thead>
        <tbody>
          {rowKeys.length > 0 ? (
            rowKeys.map((rk, ri) => {
              const rowValues = rk.split(" | ");
              return (
                <tr key={rk}>
                  {rowValues.map((v, i) => (
                    <td key={`row-val-${i}`}>{v}</td>
                  ))}
                  {colKeys.length > 0 ? (
                    colKeys.map((ck) => (
                      <td key={ck}>
                        {Number(aggregate(pivot[rk][ck]) || 0).toFixed(0)
                        }
                      </td>
                    ))
                  ) : (
                    <td>{aggregate(pivot[rk][""]).toFixed(0)}</td>
                  )}
                  {showRowTotal && (
                    <td>{rowTotals[ri].toFixed(0)}</td>
                  )}
                </tr>
              );
            })
          ) : (
            colKeys.map((ck, ci) => (
              <tr key={ck}>
                <td>{ck}</td>
                <td>{colTotals[ci].toFixed(0)}</td>
              </tr>
            ))
          )}
        </tbody>
        {showColTotal && (
          <tfoot>
            <tr>
              <td colSpan={rows.length}>Column Total</td>
              {colTotals.map((ct, i) => (
                <td key={i}>{ct.toFixed(0)}</td>
              ))}
              {showRowTotal && <td>{grandTotal.toFixed(0)}</td>}
            </tr>
          </tfoot>
        )}
      </table>

    </div>
  );
};

export default PivotTable;
