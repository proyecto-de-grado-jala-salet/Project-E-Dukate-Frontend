/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GenericItem {
  id: string;
  [key: string]: any;
}

export interface Specialty extends GenericItem {
  typeOfSpecialty: string;
}

export interface SpecialtyResponse {
  items: Specialty[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ColumnConfig<T> {
  header: string;
  key: keyof T | string;
  width?: string;
  render?: (item: T, index: number, pagination?: { currentPage: number; pageSize: number }) => React.ReactNode;
}