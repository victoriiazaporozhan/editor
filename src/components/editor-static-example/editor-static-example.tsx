import { FC, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Column } from "../column";
import { Markdown } from "../markdown";
import { Row } from "../row";
import { Stage } from "../stage";
import { ImageField } from "../image-field";
import { Columns, SelectedElement, TextAlignment } from "../../types";
import { ControlsPanel } from "../controls-panel";

export const EditorStaticExample: FC = () => {
  const [selectedElement, setSelectedElement] = useState<SelectedElement>({ rowId: null, columnId: null });

  const [rows, setRows] = useState<Record<string, Columns>>(() => {
    const persistedRows = localStorage.getItem("rows");
    return persistedRows ? JSON.parse(persistedRows) : {};
  });

  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  const addRow = () => {
    const rowId = uuidv4()
    setRows({
      ...rows,
      [rowId]: {}
    })

    setSelectedElement({ rowId, columnId: null })
  }

  const addColumn = () => {
    const columnId = uuidv4()
    const updatedRows = {...rows};

    updatedRows[selectedElement.rowId!][columnId] = {
      description: '',
      alignment: 'center',
      imageUrl: ''
    };

    setRows(updatedRows)
    setSelectedElement({...selectedElement, columnId})
  }

  const changeAlignment = (alignment: TextAlignment) => {
    const updatedRows = {...rows};
    updatedRows[selectedElement.rowId!][selectedElement.columnId!].alignment = alignment;
  
    setRows(updatedRows)
  }

  const changeType = (type: 'text' | 'image') => {
    const updatedRows = {...rows};
    updatedRows[selectedElement.rowId!][selectedElement.columnId!].type = type;
    setRows(updatedRows)
  }

  const deleteColumn = () => {
    const newValue = {...rows}
    delete newValue[selectedElement.rowId!][selectedElement.columnId!]
    selectedElement.columnId = null;
    setRows(newValue)
  }

  const deleteRow = () => {
    const newValue = {...rows}
    delete newValue[selectedElement.rowId!]
    selectedElement.rowId = null;
  
    setRows(newValue)
  }

  const changeDescription = (value: string) => {
    const newRows = {...rows};
    newRows[selectedElement.rowId!][selectedElement.columnId!].description = value;

    setRows(newRows)
  }

  const changeImageUrl = (value: string) => {
    const newRows = {...rows};
    newRows[selectedElement.rowId!][selectedElement.columnId!].imageUrl = value;

    setRows(newRows)
  }

  return (
    <div className="editor">
      <Stage onSelect={() => console.log("Stage selected")}>
        {!Object.keys(rows).length && <h5 className="text-align-center">Add first row to begin</h5>}
        {Object.keys(rows).map((rowId) => (
          <Row
            key={rowId}
            onSelect={() => setSelectedElement({ rowId, columnId: null })}
            selected={!selectedElement.columnId && selectedElement.rowId === rowId}
          >
            {Object.keys(rows[rowId]).map((columnId) => {
              const column = rows[rowId][columnId]

              return (
                <Column
                  key={columnId}
                  onSelect={() => setSelectedElement({ rowId, columnId})}
                  selected={selectedElement.columnId === columnId}
                >
                  {column.type === 'text' && <Markdown className={`text-align-${column.alignment}`}>{ column.description }</Markdown>}
                  {column.type === 'image' && <ImageField src={column.imageUrl} /> }
                </Column>)
            })}
          </Row>
        ))}
      </Stage>
      
      <ControlsPanel
        addColumn={addColumn}
        addRow={addRow}
        changeAlignment={changeAlignment}
        changeType={changeType}
        deleteColumn={deleteColumn}
        deleteRow={deleteRow}
        selectedRow={rows[selectedElement.rowId!]}
        selectedColumn={rows[selectedElement.rowId!]?.[selectedElement.columnId!]}
        changeDescription={changeDescription}
        changeImageUrl={changeImageUrl}
      />
    </div>
)};
