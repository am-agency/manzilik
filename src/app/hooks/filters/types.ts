import { FilterKey } from '../search/useSearchFilters';

export interface FilterOption {
  title: string;
  count: number;
}

export interface FilterObject {
  title: string;
  data: FilterOption[];
}

export interface FiltersDataSource {
  [key: string]: FilterObject;
}

export type FilterOptionType = 'checkbox' | 'rating' | 'price-range';

export interface FilterViewOption extends FilterOption {
  type: FilterOptionType;
  filter: FilterObject;
}

export interface FilterViewItem extends FilterObject {
  type: FilterOptionType;
  key: FilterKey;
  options: FilterViewOption[];
}

export type FiltersViewSource = FilterViewItem[];

export type PriceRange = [number, number];
export type FilterValueType = boolean | PriceRange | null;

export interface FilterChangeDetail {
  filterSource: FilterViewItem;
  option: FilterViewOption;
  value: FilterValueType;
}

export type FilterChangeHandler = (detail: FilterChangeDetail) => void;

export type FilterKeyToFilterValues = Partial<
  {
    [key in FilterKey]: string[];
  }
>;
