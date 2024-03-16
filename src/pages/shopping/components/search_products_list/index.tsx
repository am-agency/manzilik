import React from 'react';
import { FunctionComponent } from 'react';
import { StockRecord } from '../../../../API';
import { PaginationList } from '../../../../components/pagination_list/pagination_list';
import { CardsSkeleton } from '../../../../components/skeletons/cards_grid_skeleton';
import ProductCard from '../product_card';

interface Props {
  loading?: boolean;
  stockRecords: StockRecord[];
  onPageChange: (page: number) => void;
  totalProducts: number;
  currentPage: number;
  pageSize: number;
}

export const ProductsList: FunctionComponent<Props> = ({
  stockRecords,
  totalProducts,
  currentPage,
  onPageChange,
  pageSize,
  loading,
}: Props) => {
  return loading ? (
    <CardsSkeleton cardsCount={20} colSpan={{ xl: 4, lg: 4, md: 4, sm: 12, xs: 12 }} />
  ) : (
    <PaginationList
      grid={{ gutter: 20, column: 5, xl: 5, lg: 3, md: 3, sm: 2, xs: 1, xxl: 5 }}
      currentPage={currentPage}
      pageSize={pageSize}
      total={totalProducts}
      dataSource={stockRecords}
      renderItem={(item: unknown) => {
        return <ProductCard stockRecord={item as StockRecord} />;
      }}
      onPageChange={onPageChange}
    />
  );
};
