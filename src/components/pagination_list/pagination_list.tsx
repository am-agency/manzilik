import React, { useEffect } from 'react';
import { List } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../app/i18n';
import { getLayoutDirection } from '../../app/layouts';
import { THERE_ARE_NO_DATA } from '../../locales/strings';
import { CustomPagination } from '../pagination_item';
import { ListGridType } from 'antd/lib/list';

export type PaginationType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';

interface Props {
  currentPage: number;
  pageSize: number;
  total: number;
  dataSource: unknown[];
  grid?: ListGridType;
  onPageChange?: (page: number, pageSize?: number) => void;
  renderItem: (item: unknown, index: number) => React.ReactNode;
}

export const PaginationList = ({ grid, pageSize, total, currentPage, dataSource, renderItem, onPageChange }: Props) => {
  const { t } = useTranslation();

  const className = useMemo(() => {
    return `pagination ${getLayoutDirection(i18n.language)}`;
  }, [i18n.language]);

  return (
    <List
      grid={grid}
      size="large"
      itemLayout="vertical"
      locale={{ emptyText: t(THERE_ARE_NO_DATA) }}
      dataSource={dataSource}
      renderItem={renderItem}
      pagination={{
        total,
        pageSize,
        className,
        current: currentPage,
        itemRender: (page: number, type: PaginationType) => CustomPagination(page, type, t),
        hideOnSinglePage: true,
        showTitle: false,
        onChange: onPageChange,
      }}
    />
  );
};
