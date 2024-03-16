import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Rate, Typography, Select, Row, Col, Button, message, Tag, Space, Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import icons from '../../../../../assets/icons';
import Separator from '../../../../../components/separator';
import {
  ADD_TO_CART,
  BY,
  DISCOUNT,
  ITEMS_LEFT,
  ITEM_COLOR,
  ITEM_DIMENSIONS,
  QUANTITY,
  SOMETHING_WENT_WRONG,
} from '../../../../../locales/strings';
import { getLayoutDirection } from '../../../../../app/layouts';
import { StatusLabel } from '../../../components/product_card/status_label';
import { Basket, Product, ProductAttribute } from '../../../../../API';
import { Link } from 'react-router-dom';
import { VENDOR_ROUTE } from '../../../../../utils/routes';
import { useMainContext } from '../../../../../app/providers/main';
import { addProductToBasket } from '../../api';
import { useModal } from '../../../../../app/providers/modal';
import { ModalTitle } from '../../../../../components/modal_title';
import { AddProductToBasket } from '../add_product_to_basket';
import { StockRecord } from '../../../../../API';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../../../app/providers/main/loading_constants';
import { getUserBasket } from '../../../../../app/providers/user/userBasket';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import { colorsHexCode, getColorValue } from '../../../../ideas/utils';
import { AttributeOption, SelectedAttributes } from '../../hooks/useProductAttributes';

interface Props {
  onSelectQuantity: (value: string, itemsLeft: number) => void;
  quantity: string;
  id: string;
  attributes: AttributeOption[];
  onSelectAttribute: (selected: SelectedAttributes) => void;
  selectedAttribute?: SelectedAttributes;
  reviewRate: number | null | undefined;
}

export const ProductDetailsSection = ({
  onSelectQuantity,
  quantity,
  id,
  selectedAttribute,
  onSelectAttribute,
  attributes,
  reviewRate,
}: Props) => {
  const { t, i18n } = useTranslation();
  const stockRecord = selectedAttribute?.color?.stockRecord;
  const {
    requestApi,
    userState: { isAuthenticated },
    dispatchUser,
  } = useMainContext();
  const { showModal } = useModal();

  const quantityList = useMemo(() => {
    const max = stockRecord?.available_number_in_stock || 1;
    const qty = [];
    for (let i = 1; i < max; i++) {
      qty.push(i);
    }
    return qty;
  }, [stockRecord?.available_number_in_stock]);

  const hasAttribute = useMemo(() => {
    const color = !(attributes.length === 1 && attributes[0].value === '');
    let dimensions = false;
    if (selectedAttribute?.color && selectedAttribute.color.relatedAttributes.length) {
      dimensions = true;
    }
    return { color, dimensions };
  }, [attributes, selectedAttribute]);

  const onAddToCart = () => {
    if (!stockRecord || !stockRecord.product) {
      return;
    }
    if (isAuthenticated) {
      requestApi(
        addProductToBasket,
        { resourceId: stockRecord.id, quantity },
        (result: Basket, error: string) => {
          if (error) {
            message.error(t(SOMETHING_WENT_WRONG));
            return;
          }
          getUserBasket(dispatchUser);
          showModal(
            <ModalTitle />,
            <AddProductToBasket product={stockRecord.product as Product} />,
            'modal-wrapper add-product-to-basket-modal modal-with-custom-footer',
            '',
            <div />
          );
        },
        LOADING_LOW_PRIORITY_GLOBAL
      );
    } else {
      showModal(<ModalTitle />, <div />, '', '');
    }
  };

  return (
    <div className="product-details-section">
      <h5 className="title">{stockRecord?.product?.title}</h5>
      <Typography.Text className="by">{t(BY)}</Typography.Text>&nbsp;
      <Link to={`${VENDOR_ROUTE}/${selectedAttribute?.color?.stockRecord?.partner?.id!}`}>
        <span className="username">{selectedAttribute?.color?.stockRecord?.partner?.name}</span>
      </Link>
      <br />
      <Space direction="vertical" size="small" className="full-width">
        <Space direction="horizontal" size="small">
          <Rate disabled value={reviewRate || 0} /> &nbsp;
          <Typography.Text>{`(${reviewRate || 0})`}</Typography.Text>
          {stockRecord?.product?.labels?.length !== 0 && (
            <>
              <Separator vertical={12} />
              <StatusLabel labels={stockRecord?.product?.labels!} />
            </>
          )}
          {/* {selectedAttribute?.color?.stockRecord.discount_value &&
            selectedAttribute?.color?.stockRecord.discount_value > 0 && (
              <Tag className="custom-antd-tag">{t(DISCOUNT)}</Tag>
            )} */}
        </Space>
        <Separator vertical={2} />
        {selectedAttribute?.color?.stockRecord?.price && (
          <Typography.Text className="price">
            {`${selectedAttribute?.color?.stockRecord?.price}
        ${t(selectedAttribute?.color?.stockRecord?.currency as string)}`}
          </Typography.Text>
        )}
        {selectedAttribute?.color?.stockRecord?.discount_value ? (
          <span className="prev-price">
            {selectedAttribute?.color?.stockRecord.original_price}
            {t(selectedAttribute?.color?.stockRecord?.currency as string)}
          </span>
        ) : null}

        <section>
          <img src={icons.blackBell.icon} /> &nbsp;
          <span className="extra-info">
            {selectedAttribute?.color?.stockRecord?.available_number_in_stock} {t(ITEMS_LEFT)}
          </span>
        </section>

        <Collapse defaultActiveKey={['1']} className="custom-collapse">
          {hasAttribute.color && (
            <CollapsePanel
              showArrow={false}
              header={t(ITEM_COLOR)}
              key="1"
              extra={
                <section className="collapse-extra">
                  <span
                    style={{ background: getColorValue(selectedAttribute?.color?.value) }}
                    className="color-box"
                  ></span>
                  {selectedAttribute?.color?.value}
                  <img className="collapse-icon" src={icons.sort_tool.icon} alt="collapse" />
                </section>
              }
            >
              <Space direction="vertical" className="full-width">
                {attributes.map((attr) => (
                  <Row
                    key={attr.value}
                    justify="space-between"
                    align="middle"
                    onClick={() => onSelectAttribute({ color: attr })}
                    className="attr-option"
                  >
                    <Row align="middle">
                      <span style={{ background: getColorValue(attr.value) }} className="color-box"></span>
                      <span>{attr.value}</span>
                    </Row>
                    <Row align="middle">
                      <span className="check-option">
                        {selectedAttribute?.color?.value === attr.value ? (
                          <img className="check-option" src={icons.check_filled.icon} alt="check" />
                        ) : null}
                      </span>
                    </Row>
                  </Row>
                ))}
              </Space>
            </CollapsePanel>
          )}

          {hasAttribute.dimensions && (
            <CollapsePanel
              showArrow={false}
              header={t(ITEM_DIMENSIONS)}
              key="2"
              extra={
                <section className="collapse-extra">
                  <span className="dimension-value">{selectedAttribute?.dimensions?.value}</span>
                  <img className="collapse-icon" src={icons.sort_tool.icon} alt="collapse" />
                </section>
              }
            >
              {selectedAttribute?.color?.relatedAttributes.map((dim) => (
                <Row
                  key={dim.value}
                  justify="space-between"
                  align="middle"
                  onClick={() => onSelectAttribute({ dimensions: dim })}
                  className="attr-option"
                >
                  <span className="dimension-value">{dim.value}</span>
                  <Row align="middle">
                    <span className="check-option">
                      {selectedAttribute.dimensions?.value === dim.value ? (
                        <img className="check-option" src={icons.check_filled.icon} alt="check" />
                      ) : null}
                    </span>
                  </Row>
                </Row>
              ))}
            </CollapsePanel>
          )}
        </Collapse>
        <Row justify="space-between" align="middle" gutter={24}>
          <Col span={12}>
            {selectedAttribute?.color?.stockRecord?.available_number_in_stock! > 0 && (
              <Select
                className="product-select"
                dropdownClassName={`${getLayoutDirection(i18n.language)}`}
                onChange={(value) =>
                  onSelectQuantity(value, selectedAttribute?.color?.stockRecord?.available_number_in_stock!)
                }
                value={`${t(QUANTITY)}: ${quantity}`}
              >
                {quantityList?.slice(0, 10).map((elm) => {
                  return (
                    <Select.Option value={elm} key={elm}>
                      {elm !== 10 ? elm : `+ ${elm}`}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Col>
          <Col span={12}>
            <Button className="custom-antd-btn" onClick={onAddToCart}>
              {t(ADD_TO_CART)}
            </Button>
          </Col>
        </Row>
      </Space>
    </div>
  );
};
