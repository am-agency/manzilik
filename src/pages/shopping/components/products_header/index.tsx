import { Row } from 'antd';
import React, { useMemo } from 'react';
import { FilterKeyToFilterValues, FiltersViewSource } from '../../../../app/hooks/filters/types';
import { TFiltersForm } from '../../../../app/hooks/filters/useFiltersForm';
import { SortMethod } from '../../../../app/hooks/search/useSearchOptions';
import { CustomCarousal } from '../../../../components/carousal';
import { Filters } from '../../../../components/filters';
import { SearchTags } from '../../../../components/search_tags';
import { useSearchTags } from '../../../../components/search_tags/hooks/useSearchTags';
import Separator from '../../../../components/separator';
import { ProductsRange } from '../products_range';
import { ProductsSort } from '../products_sort';
import { FiltersCache } from '../../../../app/hooks/filters/useFiltersParser';

interface Props {
  totalProducts: number;
  filtersForm: TFiltersForm;
  range: number[];
  filtersSource: FiltersViewSource;
  filtersCache: FiltersCache;
  keywords: string;
  setKeywords: (keywords: string) => void;
  onSubmitKeywords: (keywords: string) => void;
  sortMethod: SortMethod;
  onSort: (sortMethod: SortMethod) => void;
  clear: () => void;
}

export const ProductsHeader = ({
  totalProducts,
  keywords,
  setKeywords,
  filtersCache,
  filtersSource,
  onSubmitKeywords,
  range,
  clear,
  sortMethod,
  onSort,
  filtersForm,
}: Props) => {
  const searchKeywordTag = useMemo(() => {
    if (keywords.trim().length > 0) {
      return {
        title: keywords,
        onClear: () => {
          setKeywords('');
        },
      };
    }
  }, [keywords, window.location.search]);

  const { tags } = useSearchTags(filtersForm, filtersCache, searchKeywordTag);

  return (
    <>
      <Filters
        keyword={keywords}
        onSubmitKeyword={onSubmitKeywords}
        filtersSource={filtersSource}
        filtersForm={filtersForm}
      />

      <Separator vertical={18} />
      <SearchTags tags={tags} onClearAllTags={clear} />
      <Row justify="space-between" className="list-header">
        <ProductsSort onSortchange={onSort} sortedValue={sortMethod} />
        <Row justify="center" align="middle" className="products-count">
          <ProductsRange range={range} total={totalProducts} />
        </Row>
      </Row>
    </>
  );
};
