export interface GenericItem {
  id: string;
  [key: string]: string;
}

export interface Specialty extends GenericItem {
  typeOfSpecialty: string;
}

export interface ColumnConfig<T> {
  header: string;
  key: string;
  width?: string;
  render?: (item: T, index: number, pagination?: { currentPage: number; pageSize: number }) => React.ReactNode;
}