import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const Section = ({ id, items, title, removeItem, isValueBox, aggregation, setAggregation }) => (
  <Droppable droppableId={id}>
    {(provided) => (
      <div className="box" ref={provided.innerRef} {...provided.droppableProps}>
        <h4>{title}</h4>
        {items.map((f, i) => (
          <Draggable key={f} draggableId={f} index={i}>
            {(prov) => (
              <div
                ref={prov.innerRef}
                {...prov.draggableProps}
                {...prov.dragHandleProps}
                className={`item ${id}-item`}
              >
                {f}
                {removeItem && <span className="close-btn" onClick={() => removeItem(id, f)}>×</span>}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
        {isValueBox && items.length > 0 && (
          <select className="aggregation" value={aggregation} onChange={(e) => setAggregation(e.target.value)}>
            <option>Sum</option>
            <option>Avg</option>
            <option>Count</option>
          </select>
        )}
      </div>
    )}
  </Droppable>
);

const FieldBox = ({ fields, rows, columns, values, removeItem, aggregation, setAggregation }) => {

  return (
    <div className="boxes">
      <div className="fields-rows">
        <Section id="fields" title="Fields" items={fields} />
        <Section id="rows" title="Rows" items={rows} removeItem={removeItem} />
      </div>
      <div className="columns-values">
      <Section id="columns" title="Columns" items={columns} removeItem={removeItem} />
        <Section id="values" title="Values" items={values}
          removeItem={removeItem}
          isValueBox={true}
          aggregation={aggregation}
          setAggregation={setAggregation}
        />
      </div>
    </div>
  );
};

export default FieldBox;
