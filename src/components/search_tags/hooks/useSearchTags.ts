import { useEffect, useMemo } from 'react';
import { TSearchTag } from '..';
import {
  FilterKeyToFilterValues,
  FilterViewItem,
  FilterViewOption,
  FiltersViewSource,
} from '../../../app/hooks/filters/types';
import { SAR } from '../../../locales/strings';
import { defaultPriceRange } from '../../../pages/ideas/ideas_filter/filters_form/filters_options';
import { TFiltersForm } from '../../../app/hooks/filters/useFiltersForm';
import { useTranslation } from 'react-i18next';
import { FiltersCache } from '../../../app/hooks/filters/useFiltersParser';
import { FilterKey } from '../../../app/hooks/search/useSearchFilters';

export const useSearchTags = (filtersForm: TFiltersForm, filtersCache: FiltersCache, searchKeywordTag?: TSearchTag) => {
  const { t } = useTranslation();

  const withFilterSource = useMemo(() => {
    const result = Object.entries(filtersForm.filterKeyToFilterValue)
      .map(([key, values]) => {
        const filterViewItem = filtersCache.get(key as FilterKey);
        return filterViewItem ? [filterViewItem, values] : null;
      })
      .filter((filter) => filter !== null) as [FilterViewItem, string[]][];
    return result;
  }, [filtersForm.filterKeyToFilterValue]);

  const withFilterValuesOptions: [FilterViewItem, FilterViewOption[], string[]][] = useMemo(() => {
    return withFilterSource.map(([filterViewItem, values]) => {
      let options: FilterViewOption[];
      switch (filterViewItem.type) {
        case 'price-range':
          if (values.length === 0) {
            options = [];
          } else {
            options = [filterViewItem.options[0]];
          }
          break;

        default:
          options = values
            .map((value) => {
              const option = filterViewItem.options.find((option) => option.title === value);
              return option ? option : null;
            })
            .filter((option) => option !== null) as FilterViewOption[];
          break;
      }
      return [filterViewItem, options, values];
    });
  }, [withFilterSource]);

  const tags = useMemo(() => {
    const filterTags: TSearchTag[] = withFilterValuesOptions.flatMap(([filterSource, options, values]) => {
      return options.map((option) => {
        let title: string;
        switch (option.type) {
          case 'price-range':
            title = values.map((value) => `${value} ${t(SAR)}`).join(' : ');
            break;
          default:
            title = option.title;
            break;
        }
        const tag: TSearchTag = {
          title,
          onClear: () => {
            switch (option.type) {
              case 'price-range':
                filtersForm.setFiltersFormValue({ filterSource, option, value: null });
                break;
              default:
                filtersForm.setFiltersFormValue({ filterSource, option, value: false });
                break;
            }
            filtersForm.submitNextUpdate();
          },
        };
        return tag;
      });
    });

    if (searchKeywordTag) {
      filterTags.push(searchKeywordTag);
    }

    return filterTags;
  }, [withFilterValuesOptions, searchKeywordTag]);

  return { tags };
};
