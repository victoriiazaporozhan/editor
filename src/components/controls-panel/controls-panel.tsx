import { FC } from "react";
import { Column, FieldType, TextAlignment } from "../../types";
import { Icons } from "../icons";

const icons = {
  left: <Icons.TextAlignLeft />,
  center: <Icons.TextAlignCenter />,
  right: <Icons.TextAlignRight />,
  text: <Icons.Text />,
  image: <Icons.Image />,
  delete: <Icons.Delete />,
}

export const ControlsPanel: FC<{
  selectedRow: any;
  selectedColumn: Column;
  addRow: () => void;
  deleteRow: () => void;
  addColumn: () => void;
  deleteColumn: () => void;
  changeType: (params: FieldType) => void;
  changeAlignment: (params: TextAlignment) => void;
  changeDescription: (value: string) => void;
  changeImageUrl: (value: string) => void;
}> = ({ selectedRow, selectedColumn, addRow, deleteRow, addColumn, deleteColumn, changeType, changeAlignment, changeDescription, changeImageUrl }) => (
  
  <div className="properties">
    <div className="section">
      <div className="section-header">Page</div>
      <div className="actions">
        <button title="Add new row" className="action" onClick={addRow}>Add row</button>
      </div>
    </div>

    {selectedRow && <div className="section">
      <div className="button-group-field">
        <label>Row</label>

        {selectedRow &&
          <button
            onClick={deleteRow}
            className="button"
            title="Delete selected row"
          >
            {icons.delete}
          </button>}
      </div>
      <div className="actions">
        <button title="Add new column" className="action" onClick={addColumn}>Add column</button>
      </div>
    </div>}

    { selectedColumn && <div className="section">
      <div className="button-group-field">
        <label>Column</label>

        {selectedColumn &&
          <button
            onClick={deleteColumn}
            className="button"
            title="Delete selected column"
          >
            <Icons.Delete />
          </button>}
      </div>
      <div className="button-group-field">
        <label>Contents</label>

        <div className="button-group">
          {(['text', 'image'] as FieldType[]).map((type) => (
            <button
              key={type}
              title={`Insert ${type}`}
              onClick={() => changeType(type)}
              className={selectedColumn.type === type ? 'selected' : ''}
            >
              {icons[type]}
            </button>))}
        </div>
      </div>
    </div>}

    {selectedColumn?.type === 'text' && <div className="section">
      <div className="section-header">Text</div>
      <div className="button-group-field">
        <label>Alignment</label>

        <div className="button-group">
          {(['left', 'center', 'right'] as TextAlignment[]).map((align) => (
            <button
              key={align}
              title={align}
              onClick={() => changeAlignment(align)}
              className={selectedColumn.alignment === align ? 'selected' : ''}
            >
              {icons[align]}
            </button>))}
        </div>
      </div>
      <div className="textarea-field">
        <textarea
          rows={8}
          placeholder="Enter text" 
          onChange={(e) => changeDescription(e.target.value)}
          value={selectedColumn.description}
        />
      </div>
    </div>}
        
    {selectedColumn?.type === 'image' && <div className="section">
      <div className="section-header">Image</div>
      <div className="text-field">
        <label htmlFor="image-url">URL</label>
        <input 
          id="image-url" 
          type="text" 
          onChange={(e) => changeImageUrl(e.target.value)}
          value={selectedColumn.imageUrl}
        />
      </div>
    </div>}
  </div>
 )