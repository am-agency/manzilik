import React from 'react';
import { Row, Col } from 'antd';
import { FunctionComponent } from 'react';
import { StockRecord } from '../../../../../API';
import { withPagination, WithPaginationProps } from '../../../../../app/hooks/with_pagination';
import ProductCard from '../../../components/product_card';
import { listHomePageSpecialStockRecords } from '../../api';

interface Props extends WithPaginationProps<StockRecord> {}

const DepartmentsProductsList: FunctionComponent<Props> = ({ list }: Props) => {
  return (
    <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      {list?.map((item) => (
        <Col className="gutter-row" key={item.id} xl={6} lg={6} md={8} sm={8} xs={12}>
          <ProductCard stockRecord={item} />
        </Col>
      ))}
    </Row>
  );
};

export default withPagination<StockRecord>(listHomePageSpecialStockRecords, DepartmentsProductsList);
