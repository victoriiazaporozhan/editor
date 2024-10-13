import { FC, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Column } from "../column";
import { Icons } from "../icons";
import { ImagePlaceholder } from "../image-placeholder";
import { Markdown } from "../markdown";
import { Row } from "../row";
import { Stage } from "../stage";

export const EditorStaticExample: FC = () => {
  interface Column {
    type?: 'text' | 'image';
    title: string;
    alignment: 'center' | 'left' | 'right';
    imageUrl: string
  }
  
  type Columns = Record<string, Column>

  interface SelectedRow {
    rowId: string | null;
    columnId: string | null;
  }

  const [rows, setRows] = useState<Record<string, Columns>>({})
  const [selectedRow, setSelectedRow] = useState<SelectedRow>({ rowId: null, columnId: null })

  const addRow = () => {
    const rowId = uuidv4()
  
    setRows({
      ...rows,
      [rowId]: {}
    })

    setSelectedRow({ rowId, columnId: null })
  }

  const addColumn = () => {
    const columnId = uuidv4()
    const newValue = {...rows};

    newValue[selectedRow.rowId!][columnId] = {
      title: '',
      alignment: 'center',
      imageUrl: ''
    };

    setRows(newValue)
    setSelectedRow({...selectedRow, columnId})
  }

  const changeAlignment = (alignment: 'left' | 'center' | 'right') => {
    if (selectedRow.rowId && selectedRow.columnId) {
      const newValue = {...rows};
  
      newValue[selectedRow.rowId][selectedRow.columnId].alignment = alignment;
      setRows(newValue)
    }
  }

  const changeType = (type: 'text' | 'image') => {
    const newValue = {...rows};

    newValue[selectedRow.rowId!][selectedRow.columnId!].type = type;
    setRows(newValue)
  }

  const deleteColumn = () => {
    const newValue = {...rows}
    delete newValue[selectedRow.rowId!][selectedRow.columnId!]
    selectedRow.columnId = null;
    setRows(newValue)
  }

  const deleteRow = () => {
    const newValue = {...rows}
    delete newValue[selectedRow.rowId!]
    selectedRow.rowId = null;
    setRows(newValue)
  }

  return (
    <div className="editor">
      <Stage onSelect={() => console.log("Stage selected")}>
        {!Object.keys(rows).length && <h5 className="text-align-center">Add first row to begin</h5>}
        {Object.keys(rows).map((rowId) => {
            return (
              <Row
                key={rowId}
                onSelect={() => setSelectedRow({ rowId, columnId: null })}
                selected={!selectedRow.columnId && selectedRow.rowId === rowId}
              >
                {Object.keys(rows[rowId]).map((columnId) => {
                  const column = rows[rowId][columnId]
                  return (
                    <Column
                      key={columnId}
                      onSelect={() => setSelectedRow({ rowId, columnId})}
                      selected={selectedRow.columnId === columnId}
                    >
                      { column.type === 'text' &&
                        <Markdown className={`text-align-${column.alignment}`}>
                          { column.title }
                        </Markdown>
                      }
                      { column.type === 'image' && (
                        column.imageUrl ? 
                          <img src={column.imageUrl} alt="" />
                          :
                          <ImagePlaceholder />
                        )
                      }
                    </Column>
                  )
                })}
              </Row>
            )
          })
        }
      </Stage>

      <div className="properties">
        <div className="section">
          <div className="section-header">Page</div>
          <div className="actions">
            <button title="Add new row" className="action" onClick={addRow}>Add row</button>
          </div>
        </div>

        {selectedRow.rowId && <div className="section">
          <div className="button-group-field">
            <label>Row</label>
            { selectedRow.rowId &&
              <button
                onClick={deleteRow}
                className="button"
                title="Delete selected row"
              >
                <Icons.Delete />
              </button>
            }
          </div>
          <div className="actions">
            <button title="Add new column" className="action" onClick={addColumn}>Add column</button>
          </div>
        </div>}

        { selectedRow.columnId && selectedRow.rowId && <div className="section">
          <div className="button-group-field">
            <label>Column</label>
            { selectedRow.columnId &&
              <button 
                onClick={deleteColumn}
                className="button"
                title="Delete selected column"
              >
                <Icons.Delete />
              </button>
            }
          </div>
          <div className="button-group-field">
            <label>Contents</label>
            <div className="button-group">
              <button
                title="Insert Text"
                onClick={() => changeType('text')}
                className={rows[selectedRow.rowId][selectedRow.columnId].type === 'text' ? 'selected' : ''}
              >
                <Icons.Text />
              </button>
              <button
                title="Insert Image"
                onClick={() => changeType('image')}
                className={rows[selectedRow.rowId][selectedRow.columnId].type === 'image' ? 'selected' : ''}
              >
                <Icons.Image />
              </button>
            </div>
          </div>
        </div>}

        {selectedRow.rowId && selectedRow.columnId && 
          <>
           { rows[selectedRow.rowId][selectedRow.columnId].type === 'text' && <div className="section">
              <div className="section-header">Text</div>
              <div className="button-group-field">
                <label>Alignment</label>
                <div className="button-group">
                  <button 
                    title="Left"
                    onClick={() => changeAlignment('left')}
                    className={rows[selectedRow.rowId][selectedRow.columnId].alignment === 'left' ? 'selected' : ''}
                  >
                    <Icons.TextAlignLeft />
                  </button>
                  <button 
                    title="Center"
                    onClick={() => changeAlignment('center')}
                    className={rows[selectedRow.rowId][selectedRow.columnId].alignment === 'center' ? 'selected' : ''}>
                    <Icons.TextAlignCenter />
                  </button>
                  <button
                    title="Right"
                    onClick={() => changeAlignment('right')}
                    className={rows[selectedRow.rowId][selectedRow.columnId].alignment === 'right' ? 'selected' : ''}>
                    <Icons.TextAlignRight />
                  </button>
                </div>
              </div>
              <div className="textarea-field">
                <textarea
                  rows={8}
                  placeholder="Enter text" 
                  onChange={(e) => {
                    if (selectedRow.rowId && selectedRow.columnId) {
                      const newRows = {...rows};

                      newRows[selectedRow.rowId][selectedRow.columnId].title = e.target.value;
                      setRows(newRows)
                    }
                  }}
                  value={rows[selectedRow.rowId][selectedRow.columnId].title}
                ></textarea>
              </div>
            </div>}
            
            {rows[selectedRow.rowId][selectedRow.columnId].type === 'image' && <div className="section">
              <div className="section-header">Image</div>
              <div className="text-field">
                <label htmlFor="image-url">URL</label>
                <input 
                  id="image-url" 
                  type="text" 
                  onChange={(e) => {
                    if (selectedRow.rowId && selectedRow.columnId) {
                      const newRows = {...rows};

                      newRows[selectedRow.rowId][selectedRow.columnId].imageUrl = e.target.value;
                      setRows(newRows)
                    }
                  }}
                  value={rows[selectedRow.rowId][selectedRow.columnId].imageUrl}
                />
              </div>
            </div>}
          </>
        }

      </div>
    </div>
)};
