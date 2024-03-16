import React from 'react';
import { Row, Col } from 'antd';
import { FunctionComponent } from 'react';
import { SearchData, StockRecord } from '../../../../../API';
import { withPagination, WithPaginationProps } from '../../../../../app/hooks/with_pagination';
import { listDepartmentStockRecords } from '../../api';
import ProductCard from '../../../components/product_card';
import Separator from '../../../../../components/separator';
import { CardsSkeleton } from '../../../../../components/skeletons/cards_grid_skeleton';
import { LOADING_UPLOADING_PRODUCT } from '../../../../../app/providers/main/loading_constants';
import { useMainContext } from '../../../../../app/providers/main';
import { ProductsSort } from '../../../components/products_sort';
import { PRODUCTS } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';

interface Props extends WithPaginationProps<StockRecord> {}

const ProductsList: FunctionComponent<Props> = ({ list }: Props) => {
  const { loadingMap } = useMainContext();
  const { t } = useTranslation();
  return (
    <>
      <Row justify="space-between" className="list-header">
        <ProductsSort />
        <Row justify="center" align="middle" className="products-count">
          <p> {`${list?.length} ${t(PRODUCTS)}`}</p>
        </Row>
      </Row>

      <Separator vertical={25} />
      <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {list?.map((item, index) => (
          <Col className="gutter-row" key={index} xl={6} lg={6} md={8} sm={12} xs={24}>
            <ProductCard stockRecord={item} />
          </Col>
        ))}
      </Row>
      <div>
        {loadingMap[LOADING_UPLOADING_PRODUCT] && (
          <CardsSkeleton cardsCount={4} colSpan={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }} />
        )}
      </div>
    </>
  );
};

export default withPagination<StockRecord>(listDepartmentStockRecords, ProductsList, false, LOADING_UPLOADING_PRODUCT);
