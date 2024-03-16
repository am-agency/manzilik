import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Col, Divider, Row, Skeleton, Table, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { shoppingIcons } from '../../../../assets/icons/shopping';
import { Basket, BasketLine, BasketLinesGroupedByPartnerObject, OrderLine } from '../../../../API';
import {
  ARE_YOU_SURE_DELETE_IDEA,
  BASKET_IS_EMPTY,
  CANCEL,
  DELETE,
  MANZILIK_STORE,
  OPERATION,
  PRICE,
  QUANTITY,
  START_ADDING_PRODUCT_TO_BASKET,
  THE_PRODUCT,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import DropdownPopover from '../../../../components/dropdown_popover';
import { useMainContext } from '../../../../app/providers/main';
import {
  LOADING_ANYTHING,
  LOADING_LOW_PRIORITY_GLOBAL,
  LOADING_UPLOADING_PRODUCT,
} from '../../../../app/providers/main/loading_constants';
import { changeQuantity, deleteProductLineFromBasket, listBasketProducts } from '../api';
import { CheckoutStateType, CurrentOrder } from '..';
import { CheckoutProductDetails } from '../components/checkout_product_details';
import Separator from '../../../../components/separator';
import { PRODUCTS_MAIN_ROUTE } from '../../../../utils/routes';
import { profileIcons } from '../../../../assets/icons/profile';

interface DataType {
  key: number;
  name?: ReactNode;
  productQuantity?: ReactNode;
  price?: ReactNode;
}

interface Props {
  clientBasket?: Basket;
  updateOrder: (values: CurrentOrder) => void;
  updateUserBasket: Function;
  basketProducts?: BasketLinesGroupedByPartnerObject[];
  setBasketProducts: (products: BasketLinesGroupedByPartnerObject[]) => void;
  dispatchNextState: (next: CheckoutStateType) => void;
}

export const StepBasket = ({
  clientBasket,
  updateOrder,
  updateUserBasket,
  basketProducts,
  setBasketProducts,
  dispatchNextState,
}: Props) => {
  useEffect(() => {
    dispatchNextState(CheckoutStateType.ENTER_BASKET);
  }, []);
  const [quantityTrigger, setQuantityTrigger] = useState<{ elm: BasketLine; newQuantity: number }>();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { requestApi, loadingMap } = useMainContext();
  const [counter, setCounter] = useState<{ count: number; operator?: string }>({ count: 0 });
  const { t } = useTranslation();

  const removeBasketProductLine = (targetId: number, products: BasketLinesGroupedByPartnerObject[]) => {
    const nextProducts: BasketLinesGroupedByPartnerObject[] = [];
    for (const product of products) {
      if (!product.lines) {
        continue; // skip empty product lines
      }
      const nextLines: BasketLine[] = [];
      for (const line of product.lines) {
        if (!line?.id) {
          continue; // skip line missing id
        }
        if (line.id === targetId) {
          continue; // skip deleted line
        } else {
          nextLines.push(line);
        }
      }
      if (nextLines.length > 0) {
        nextProducts.push({ ...product, lines: nextLines });
      }
    }
    return nextProducts;
  };

  const onDeleteProductLine = (resourceId: number) => {
    if (!clientBasket?.id || !basketProducts) {
      return;
    }
    requestApi(
      deleteProductLineFromBasket,
      { id: clientBasket.id, resourceId },
      (response: string, error: string) => {
        if (error) {
          return;
        }

        const updatedBasket = removeBasketProductLine(resourceId, basketProducts);

        if (updatedBasket.length === 0) {
          dispatchNextState(CheckoutStateType.BASKET_WAS_CLEARED);
        }

        setBasketProducts(updatedBasket);
        updateUserBasket();
      },
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };

  const onVisibleChange = () => {
    setIsOpen(false);
    setTimeout(() => {
      // reset the state
      setIsOpen(true);
    }, 1000);
  };

  const onChangeQuantity = () => {
    if (!basketProducts) {
      return;
    }
    const { elm, newQuantity } = quantityTrigger!;
    const { count } = counter;
    const updatedQuantity = counter.operator == '+' ? newQuantity + count : newQuantity - count;

    if (updatedQuantity <= 0) {
      onDeleteProductLine(elm.id!);
      setCounter({ count: 0 });
    } else {
      requestApi(
        changeQuantity,
        {
          id: elm.basket_id!,
          quantity: updatedQuantity,
          product_id: elm.product?.id,
          stockrecord_id: elm.stockrecord?.id,
          resourceId: elm.id,
        },
        (response: BasketLine, error: string) => {
          if (error) {
            return;
          }
          setCounter({ count: 0 });
          const updatedBasketProducts = basketProducts.filter((elm) => {
            return elm.lines?.map((item) => {
              if (item?.id == response.id) {
                item!.quantity = response.quantity;
                item!.price_currency = response.price_currency;
                item!.price_incl_tax = response.price_incl_tax;
                item!.original_price_incl_tax = response.original_price_incl_tax;
              }
              return item;
            });
          });

          setBasketProducts(updatedBasketProducts);
          updateUserBasket();
        },
        LOADING_ANYTHING
      );
    }
  };

  const onQuantityTrigger = (elm: BasketLine, operator: string) => {
    const { count } = counter;

    setCounter({ count: count + 1, operator });
    setQuantityTrigger({ elm, newQuantity: elm?.quantity! });
  };

  useEffect(() => {
    // to avoid multiple requests while the user changing the quantity
    if (quantityTrigger) {
      const slot = setTimeout(() => {
        onChangeQuantity();
      }, 500);
      return () => clearTimeout(slot);
    }
  }, [quantityTrigger]);

  useEffect(() => {
    updateOrder({ products: basketProducts });
  }, [basketProducts]);

  const renderDeleteConfirmation = (item: BasketLine, key?: string) => {
    return (
      <DropdownPopover
        trigger={'click'}
        placement="bottom"
        className="delete-address-popover"
        showPopOver={isOpen}
        content={
          <div>
            <Typography.Text className="delete-msg">{t(ARE_YOU_SURE_DELETE_IDEA)}</Typography.Text>
            <br />
            <Row gutter={12} className="btns-container">
              <Col span={12}>
                <Button className="popover-btn delete" onClick={() => onDeleteProductLine(item?.id!)}>
                  {t(DELETE)}
                </Button>
              </Col>
              <Col span={12}>
                <Button className="popover-btn cancel" onClick={onVisibleChange}>
                  {t(CANCEL)}
                </Button>
              </Col>
            </Row>
          </div>
        }
      >
        {key == 'close' ? (
          <div className="delete-wrapper clickable"> x </div>
        ) : (
          <img src={shoppingIcons.blackDeleteIcon} />
        )}
      </DropdownPopover>
    );
  };

  return (
    <div className="step-one">
      {basketProducts && basketProducts.length == 0 && !loadingMap[LOADING_UPLOADING_PRODUCT] ? (
        <div className="empty-basket">
          <img src={shoppingIcons.emptyBasket} alt="empty-basket" />
          <Separator vertical={5} />
          <h5> {t(BASKET_IS_EMPTY)} </h5>
          <h6> {t(START_ADDING_PRODUCT_TO_BASKET)} </h6>
          <Separator vertical={8} />
          <Button type="primary">
            <Link to={PRODUCTS_MAIN_ROUTE}>{t(MANZILIK_STORE)} </Link>
          </Button>
        </div>
      ) : (
        <>
          <Row className="header-section" justify="space-between" align="middle">
            <div className="product-title">
              <Typography.Text>{t(THE_PRODUCT)}</Typography.Text>
            </div>
            <div className="quantity-wrapper">
              <Typography.Text>{t(QUANTITY)}</Typography.Text>
            </div>
            <div className="price-wrapper">
              <Typography.Text>{t(PRICE)}</Typography.Text>
            </div>
            <div />
          </Row>
          <Separator vertical={7} />
          {basketProducts &&
            basketProducts.map((elm) => {
              return (
                <>
                  {elm?.lines?.length! > 0 && (
                    <>
                      <div key={elm.partner?.id} className="partner-products-section">
                        <div className="partner-products_header">
                          <img src={profileIcons.store} />
                          <Separator horizontal={4} />
                          <Typography.Text>{elm.partner?.name}</Typography.Text>
                        </div>
                        <Separator vertical={6} />
                        {elm.lines?.map((item, index) => {
                          return (
                            <>
                              <Row key={item?.id} justify="space-between" align="middle" className="products-wrapper">
                                <CheckoutProductDetails product={item?.product!} />
                                <div>
                                  {loadingMap[LOADING_ANYTHING] ? (
                                    <Row wrap={false} align="middle" justify="center">
                                      <Skeleton.Button active shape="round" />
                                      <Typography.Text> {item?.quantity} </Typography.Text>
                                      <Skeleton.Button active shape="round" />
                                    </Row>
                                  ) : (
                                    <Row className="quantity-container" justify="space-between" align="middle">
                                      <Button className="increase-icon" onClick={() => onQuantityTrigger(item!, '+')}>
                                        +
                                      </Button>
                                      <Typography.Text> {item?.quantity} </Typography.Text>
                                      <Button
                                        className={
                                          item?.quantity == 1 ? 'decrease-icon decrease-icon-delete' : 'decrease-icon'
                                        }
                                      >
                                        {item?.quantity == 1 ? (
                                          renderDeleteConfirmation(item)
                                        ) : (
                                          <span onClick={() => onQuantityTrigger(item!, '-')}>-</span>
                                        )}
                                      </Button>
                                    </Row>
                                  )}
                                </div>
                                <div className="price-container">
                                  <Typography.Text className="offer-price">
                                    {item?.price_incl_tax!} {item?.price_currency!}
                                  </Typography.Text>
                                  &nbsp;&nbsp;
                                  {item?.price_incl_tax! < item?.original_price_incl_tax! && (
                                    <Typography.Text className="origninal-price">
                                      {item?.original_price_incl_tax!} {item?.price_currency!}
                                    </Typography.Text>
                                  )}
                                </div>
                                {renderDeleteConfirmation(item!, 'close')}
                              </Row>
                              {elm.lines?.length !== index + 1 && <Divider type="horizontal" />}
                            </>
                          );
                        })}
                        <Separator vertical={6} />
                        <div className="partner-products_footer">
                          <img src={shoppingIcons.info} />
                          <Separator horizontal={4} />
                          <Typography.Text>{elm.partner?.policy}</Typography.Text>
                        </div>
                      </div>
                      <Separator vertical={11} />
                    </>
                  )}
                </>
              );
            })}
        </>
      )}
    </div>
  );
};
