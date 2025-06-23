export interface FilterOption {
  value: string;
  label: string;
}

interface BaseFilter {
  label: string;
}

interface SingleSelectFilter extends BaseFilter {
  type: 'dropdown' | 'year' | 'month' | 'date';
  value: string;
  onChange: (value: string) => void;
  options?: FilterOption[];
  minDate?: string;
}

interface MultiSelectFilter extends BaseFilter {
  type: 'multi-select';
  value: string[];
  onChange: (value: string[]) => void;
  options: FilterOption[];
}

interface WeekRangeFilter extends BaseFilter {
  type: 'week-range';
  value: { startDate: Date; endDate: Date } | null;
  onChange: (value: { startDate: Date; endDate: Date }) => void;
}

export type Filter = SingleSelectFilter | MultiSelectFilter | WeekRangeFilter;