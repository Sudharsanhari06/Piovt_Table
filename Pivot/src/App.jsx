import React, { useState } from "react";
import Papa from "papaparse";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PivotTable from "./PivotTable";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState([]);
  const [aggregation, setAggregation] = useState("Sum");


  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setFields(
          Object.keys(results.data[0]).filter((f) => f !== "__parsed_extra")
        );
        setRows([]);
        setColumns([]);
        setValues([]);
      },
    });
  };


  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    if (!destination) return; // If dropped outside, do nothing

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
  
    const sourceList = getListById(source.droppableId);
    const destinationList = getListById(destination.droppableId);
  
    const [movedItem] = sourceList.splice(source.index, 1); // remove item from source
    destinationList.splice(destination.index, 0, movedItem); // add item to destination

    // Update the state
    setFields([...fields]);
    setRows([...rows]);
    setColumns([...columns]);
    setValues([...values]);
  };
  
  // helper to get correct list by id
  const getListById = (id) => {
    switch (id) {
      case "fields":
        return fields;
      case "rows":
        return rows;
      case "columns":
        return columns;
      case "values":
        return values;
      default:
        return [];
    }
  };
  
  // const updateList = (id, list) => {
  //   switch (id) {
  //     case "fields": setFields(list); break;
  //     case "rows": setRows(list); break;
  //     case "columns": setColumns(list); break;
  //     case "values": setValues(list); break;
  //   }
  // };

  // const removeItem = (id, item) => {
  //   const list = getList(id).filter((f) => f !== item);
  //   updateList(id, list);
  //   setFields((prev) => [...prev, item]); // Return item to "Fields"
  // };



  const removeItem = (section, item) => {
    switch (section) {
      case 'rows':
        setRows(rows.filter((row) => row !== item));
        break;
      case 'columns':
        setColumns(columns.filter((column) => column !== item));
        break;
      case 'values':
        setValues(values.filter((value) => value !== item));
        break;
      default:
        break;
    }
  };
  


  return (
    <div className="app-container">
     <h2>CSV Table To Pivot Table</h2>
    <input type="file" accept=".csv" onChange={handleCSVUpload} />

      {/* Show simple table preview */}
      {data.length > 0 && (
        <section className="csv-preview">
          <h2>CSV Data Preview</h2>
          <div className="table-container">
            <table border="2">
              <thead>
                <tr>
                  {Object.keys(data[0]).filter(h => h !== "__parsed_extra").map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.entries(row)
                      .filter(([key]) => key !== "__parsed_extra")
                      .map(([key, value], cellIndex) => (
                        <td key={cellIndex}>{value}</td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Drag and drop pivot section */}
  
      {data.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="boxes">
            {/* Fields */}
            <Droppable droppableId="fields">
              {(provided) => (
                <div className="box" ref={provided.innerRef} {...provided.droppableProps}>
                  <h4>Fields</h4>
                  {fields.map((f, i) => (
              <Draggable key={f} draggableId={f}    index={i}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="item fields-item"
                        >
                          {f}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Rows */}
            <Droppable droppableId="rows">
              {(provided) => (
                <div className="box" ref={provided.innerRef} {...provided.droppableProps}>
                  <h4>Rows</h4>
                  {rows.map((f, i) => (
                    <Draggable key={f} draggableId={f} index={i}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="item rows-item"
                        >
                          {f}
                          <span className="close-btn" onClick={() => removeItem("rows", f)}>×</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Columns */}
            <Droppable droppableId="columns">
              {(provided) => (
                <div className="box" ref={provided.innerRef} {...provided.droppableProps}>
                  <h4>Columns</h4>
                  {columns.map((f, i) => (
                    <Draggable key={f} draggableId={f} index={i}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="item columns-item"
                        >{f}
                          <span className="close-btn" onClick={() => removeItem("columns", f)}>×</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Values */}
            <Droppable droppableId="values">
              {(provided) => (
                <div className="box" ref={provided.innerRef} {...provided.droppableProps}>
                  <h4>Values</h4>
                  {values.map((f, i) => (
                    <Draggable key={f} draggableId={f} index={i}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="item values-item"
                        >{f}
                          <span className="close-btn" onClick={() => removeItem("values", f)}>×</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {values.length > 0 && (
                    <select
                      className="aggregation"
                      value={aggregation}
                      onChange={(e) => setAggregation(e.target.value)}
                    >
                      <option>Sum</option>
                      <option>Avg</option>
                      <option>Count</option>
                    </select>
                  )}
                </div>
              )}
            </Droppable>

          </div>
          {/* Pivot Table with Row and Column Totals */}
          <PivotTable
            data={data}
            rows={rows}
            columns={columns}
            values={values}
            aggregation={aggregation}
            showTotals={true} 
          />
        </DragDropContext>
      )}
    </div>
  );
};

export default App;
