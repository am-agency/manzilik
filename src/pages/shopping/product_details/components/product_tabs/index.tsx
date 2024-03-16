import React, { useEffect, useMemo } from 'react';
import { Tabs, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import ReadMoreText from '../../../../../components/read_more_text';
import {
  CATEGORY,
  COLOR,
  MANUFACTORY,
  MANZILIK,
  PRODUCT_DESCRIPTION,
  PRODUCT_NUMBER,
  PRODUCT_SHIPPING,
  PRODUCT_SPECIFICATION,
  READ_MORE,
  SIZE_OR_WEIGHT,
  SOLD_BY,
} from '../../../../../locales/strings';
import { StockRecord } from '../../../../../API';
import { getProductCategories } from '../../../utils';
import { SelectedAttributes } from '../../hooks/useProductAttributes';
const { TabPane } = Tabs;

interface Props {
  stockRecord: StockRecord;
  selectedAttributes?: SelectedAttributes;
}

export const ProductTabs = ({ stockRecord, selectedAttributes }: Props) => {
  const product = stockRecord?.product;
  const partner = stockRecord?.partner;

  const { t } = useTranslation();

  const columns = [
    {
      dataIndex: 'specification',
    },
    {
      dataIndex: 'value',
    },
  ];

  const specifications = [
    { specification: t(PRODUCT_NUMBER), value: stockRecord?.partner_sku },
    { specification: t(MANUFACTORY), value: product?.manufactory?.name },
    { specification: t(SOLD_BY), value: partner?.name },
    { specification: t(SIZE_OR_WEIGHT), value: product?.dimensions },
    { specification: t(COLOR), value: product?.color },
    { specification: t(CATEGORY), value: product?.section?.title },
  ];

  const activeSpecification = useMemo(() => {
    return specifications.map((spec) => {
      if (spec.specification === 'Color') {
        return { ...spec, value: selectedAttributes?.color?.value };
      } else if (spec.specification === 'Size/Weight') {
        return { ...spec, value: selectedAttributes?.dimensions?.value };
      } else {
        return spec;
      }
    });
  }, [specifications, selectedAttributes]);

  return (
    <Tabs defaultActiveKey="2" className="product-tabs">
      <TabPane tab={t(PRODUCT_DESCRIPTION)} key="1">
        <ReadMoreText actionText={t(READ_MORE)} text={product?.description!} />
      </TabPane>
      <TabPane tab={t(PRODUCT_SPECIFICATION)} key="2">
        <Table
          columns={columns}
          dataSource={activeSpecification}
          showHeader={false}
          bordered={true}
          pagination={false}
        />
      </TabPane>
      <TabPane tab={t(PRODUCT_SHIPPING)} key="3">
        <ReadMoreText text={stockRecord?.partner?.policy || ''} actionText={t(READ_MORE)} />
      </TabPane>
    </Tabs>
  );
};
