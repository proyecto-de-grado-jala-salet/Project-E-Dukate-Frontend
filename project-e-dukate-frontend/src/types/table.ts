export interface GenericItem {
  id: string;
  [key: string]: string;
}

export interface Specialty extends GenericItem {
  typeOfSpecialty: string;
}

export interface ColumnConfig<T extends GenericItem = GenericItem> {
  header: string;
  key: string;
  width?: string | number;
  render?: (item: T, index: number) => React.ReactNode;
}