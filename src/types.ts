export type Columns = Record<string, Column>
export type TextAlignment = 'left' | 'center' | 'right'
export type FieldType = 'text' | 'image';

export interface Column {
  type?: FieldType;
  description: string;
  alignment: TextAlignment;
  imageUrl: string
}

export interface SelectedElement {
  rowId: string | null;
  columnId: string | null;
}