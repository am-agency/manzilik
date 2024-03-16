import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FilterKeyToFilterValues,
  FilterChangeDetail,
  FilterViewItem,
  FilterViewOption,
  FilterValueType,
  PriceRange,
} from './types';
import { FilterKey } from '../search/useSearchFilters';

export type TFiltersForm = ReturnType<typeof useFiltersForm>;

interface FilterFormEvents {
  onSubmit?: (formValues: FilterKeyToFilterValues) => void;
}

export type OptionalValueType = FilterValueType | undefined;

export const useFiltersForm = (events: FilterFormEvents = {}) => {
  const submitNextFlag = useRef(false);
  const snapshot = useRef<FilterKeyToFilterValues>({});
  const didInit = useRef(false);
  const awaitInit = useRef<
    [resolver: (value: OptionalValueType) => void, filter: FilterViewItem, option: FilterViewOption][]
  >([]);
  const [filterKeyToFilterValue, setFilterKeyToFilterValue] = useState<FilterKeyToFilterValues>({});

  const updateKey = <K extends FilterKey, V extends FilterKeyToFilterValues[K]>(key: K, fn: (value: V) => V) => {
    return setFilterKeyToFilterValue((pre) => {
      const current = pre[key] as V;
      return { ...pre, [key]: fn(current) };
    });
  };

  const updateList = (detail: FilterChangeDetail) => {
    const key = detail.filterSource.key;
    if (detail.value === true) {
      updateKey(key, (pre) => (pre ? [...pre, detail.option.title] : [detail.option.title]));
    } else {
      updateKey(key, (pre) => (pre ? pre.filter((value) => value !== detail.option.title) : []));
    }
  };

  const setFiltersFormValue = (detail: FilterChangeDetail) => {
    switch (detail.option.type) {
      case 'checkbox':
        updateList(detail);
        break;
      case 'rating':
        updateList(detail);
        break;
      case 'price-range':
        const key = detail.filterSource.key;
        if (detail.value === null) {
          updateKey(key, () => []);
        } else {
          const [min, max] = detail.value as PriceRange;
          updateKey(key, () => [min.toString(), max.toString()]);
        }
    }
  };

  const saveSnapshot = () => {
    snapshot.current = JSON.parse(JSON.stringify(filterKeyToFilterValue));
  };

  const restoreSnapshot = () => {
    setFilterKeyToFilterValue(snapshot.current);
  };

  const submitNextUpdate = () => {
    submitNextFlag.current = true;
  };

  useEffect(() => {
    if (submitNextFlag.current === true) {
      submit();
      submitNextFlag.current = false;
    }
  }, [filterKeyToFilterValue]);

  const submit = () => {
    events.onSubmit?.(filterKeyToFilterValue);
  };

  const initForm = (values: FilterKeyToFilterValues) => {
    if (!didInit.current) {
      setFilterKeyToFilterValue(values);
      awaitInit.current = [];
      didInit.current = true;
    }
  };

  const reset = (execlude: FilterKey[] = []) => {
    const next: FilterKeyToFilterValues = {};
    for (const key in filterKeyToFilterValue) {
      if (execlude.includes(key as FilterKey)) {
        continue;
      } else {
        next[key as FilterKey] = [];
      }
    }
    setFilterKeyToFilterValue(next);
  };

  const getValuesCount = (formValues: FilterKeyToFilterValues) => {
    const count: { items: Partial<Record<FilterKey, number>>; total: number } = { total: 0, items: {} };
    for (const [key, values] of Object.entries(formValues) as [FilterKey, string[]][]) {
      if (key === FilterKey.PRICE) {
        count.items[FilterKey.PRICE] = values.length === 0 ? 0 : 1;
      } else {
        count.items[key] = values.length;
      }
    }
    for (const itemsCount of Object.values(count.items)) {
      count.total += itemsCount;
    }
    return count;
  };

  const getFilterKeyValue = (key: FilterKey) => {
    return filterKeyToFilterValue[key];
  };

  return {
    setFiltersFormValue,
    submit,
    initForm,
    reset,
    getValuesCount,
    saveSnapshot,
    restoreSnapshot,
    filterKeyToFilterValue,
    getFilterKeyValue,
    submitNextUpdate,
  };
};
