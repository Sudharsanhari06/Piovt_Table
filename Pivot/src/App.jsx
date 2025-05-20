import React, { useState } from "react";
import Papa from "papaparse";
import { DragDropContext } from "@hello-pangea/dnd";
import PivotTable from "./PivotTable";
import Loader from "./Loader";
import RawPreview from "./RawPreview";
import FieldBox from "./FieldBox";
import './index.css';

const App = () => {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState([]);
  const [aggregation, setAggregation] = useState("Sum");
  const [loading, setLoading] = useState(false);


  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
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
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceList = getListById(source.droppableId);
    const destinationList = getListById(destination.droppableId);

    const [movedItem] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedItem);

    setFields([...fields]);
    setRows([...rows]);
    setColumns([...columns]);
    setValues([...values]);
  };

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

  const removeItem = (section, fieldName) => {
    if (section === "rows") {
      setRows((prev) => prev.filter((f) => f !== fieldName));
    }
    if (section === "columns") {
      setColumns((prev) => prev.filter((f) => f !== fieldName));
    }
    if (section === "values") {
      setValues((prev) => prev.filter((f) => f !== fieldName));
    }
    setFields((prev) => [...prev, fieldName]);
  };

  const isPivotView = rows.length > 0 || columns.length > 0 || values.length > 0;

  console.log("isPivotView",isPivotView);
  return (
    <div className="app-container">
      <h2>CSV Table To Pivot Table</h2>
      <input type="file" accept=".csv" onChange={handleCSVUpload} />

      {loading && <Loader />}

      <div className="app-container__tables">
        <div className="left-side">
          {!isPivotView && <RawPreview data={data} />}
        </div>

        {data.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            {isPivotView && (
              <PivotTable
                data={data}
                rows={rows}
                columns={columns}
                values={values}
                aggregation={aggregation}
                showTotals={true}
              />
            )}

            <div className="right-side">
              <FieldBox
                fields={fields}
                rows={rows}
                columns={columns}
                values={values}
                removeItem={removeItem}
                aggregation={aggregation}
                setAggregation={setAggregation}
              />
              
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default App;
