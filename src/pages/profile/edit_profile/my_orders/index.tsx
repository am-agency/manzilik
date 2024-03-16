import React, { FunctionComponent, useEffect, useState } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import { Button, Col, Input, Row, Select, Table, Tag, Typography } from 'antd';
import {
  Client,
  ClientAddress,
  OrderDetails as Order,
  OrderLine,
  OrderLinesGroupedByPartnerObject,
} from '../../../../API';
import i18n from '../../../../app/i18n';
import { useMainContext } from '../../../../app/providers/main';
import Separator from '../../../../components/separator';
import { AR } from '../../../../locales/constants';
import { getMyOrders, getOrderByNumber, getOrderById, listOrderProducts } from '../../api';
import { OrderDetails } from './order_details';
import { profileIcons } from '../../../../assets/icons/profile';
import { LOADING_UPLOADING_PRODUCT } from '../../../../app/providers/main/loading_constants';
import {
  ALL,
  CANCELED,
  DELIVERED,
  MY_ORDERS,
  NEW,
  ORDER_DETAILS,
  PENDING,
  SEARCH,
  SEARCH_BY_ORDER_NUMBER,
  THERE_ARE_NO_DATA,
  UNDER_PROCESSING,
  DELIVERY_ADDRESS,
  DETAILS,
  MORE,
  ORDER_DATE,
  ORDER_NUMBER,
  ORDER_STATUS,
  QUANTITY,
  TOTAL_PRICE,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import icons from '../../../../assets/icons';
import moment from 'moment';
import { renderTagBasedOnLanguage, renderTagColor } from '../utils';
import { Link, Link as section, useHistory, useLocation, useParams } from 'react-router-dom';
import { MY_ORDERS_ROUTE, PROFILE_ROUTE } from '../../../../utils/routes';
import { TabId } from '..';

const { Option } = Select;

interface Props {
  client: Client;
}

interface OrderParams {
  subId: string;
}

interface OrderQueryParams {
  id?: string;
  number?: string;
}

export const getOrderDetailsUrl = (query: OrderQueryParams) => {
  return `${MY_ORDERS_ROUTE}/order?${query.id ? 'id=' + query.id : 'number=' + query.number}`;
};

export const MyOrders: FunctionComponent<Props> = () => {
  const history = useHistory();
  const params = useParams<OrderParams>();
  const isArabic = i18n.language == AR;
  const { requestApi, loadingMap } = useMainContext();
  const { t } = useTranslation();
  const [isOrderDetails, showOrderDetails] = useState<boolean>(false);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedOrderParams, setSelectedOrderParams] = useState<OrderQueryParams | null>(null);
  const [orderProducts, setOrderProducts] = useState<OrderLinesGroupedByPartnerObject[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchedValue, setSearchedValue] = useState<string>('');
  const location = useLocation();

  const options = [
    { id: '0', label: t(ALL), value: '' },
    { id: '4', label: t(NEW), value: 'New' },
    { id: '1', label: t(UNDER_PROCESSING), value: 'Under processing' },
    { id: '3', label: t(DELIVERED), value: 'Delivered' },
    { id: '2', label: t(CANCELED), value: 'Canceled' },
    // { id: '5', label: t(PENDING), value: 'Pending' },
  ];

  const columns: ColumnsType<Order> = [
    {
      title: t(ORDER_NUMBER),
      dataIndex: 'number',
      key: 'number',
      render: (text) => <Typography.Text className="txt-bold">{text}</Typography.Text>,
    },
    {
      title: t(QUANTITY),
      dataIndex: 'num_items',
      key: 'num_items',
      render: (text) => <Typography.Text className="txt-bold">{text}</Typography.Text>,
    },
    {
      title: t(TOTAL_PRICE),
      dataIndex: 'total_incl_tax',
      key: 'total_incl_tax',
      render: (_, record: Order) => (
        <div>
          <Typography.Text className="txt-bold">{record?.total_incl_tax}</Typography.Text>
          <Typography.Text>({record?.currency})</Typography.Text>
        </div>
      ),
    },
    {
      title: t(ORDER_STATUS),
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Typography.Text className="txt-bold">{renderTagBasedOnLanguage(t, text)}</Typography.Text>,
    },
    {
      title: t(ORDER_DATE),
      dataIndex: 'date_placed',
      key: 'date_placed',
      render: (text) => {
        const date = moment(text).locale(i18n.language);
        return (
          <div>
            <Typography.Text className="txt-bold">{date.format('DD MMMM YYYY')}</Typography.Text>
            <div>
              <Typography.Text>{date.format('hh:mm a')}</Typography.Text>
            </div>
          </div>
        );
      },
    },
    {
      title: t(DELIVERY_ADDRESS),
      dataIndex: 'shipping_address',
      key: 'shipping_address',
      render: (text: ClientAddress) => (
        <div>
          <Typography.Text className="txt-bold">{`${text?.country?.name || ''} - ${text?.city?.name || ''} ${
            text?.description || ''
          }`}</Typography.Text>
        </div>
      ),
    },
    {
      title: t(DETAILS),
      key: 'tags',
      dataIndex: 'tags',
      render: (_, record: Order) => {
        const tag = record?.status!;
        // the translation is handled from the frontend side till it's done from backend
        const color = renderTagColor(tag);
        return (
          <>
            {
              <Row key={tag} align="middle" justify="space-between">
                <Tag color={color}>{renderTagBasedOnLanguage(t, tag!)}</Tag>
                <Link to={getOrderDetailsUrl({ number: record.number! })}>
                  <Typography.Text>{t(MORE)} ..</Typography.Text>
                  {isArabic ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
                </Link>
              </Row>
            }
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const orderQueryParams: OrderQueryParams = {};
    if (params.subId === 'order') {
      setOrder(null);
      setOrderProducts([]);
      const params = new URLSearchParams(location.search);
      const orderIdParam = params.get('id');
      if (orderIdParam) {
        orderQueryParams.id = orderIdParam;
      } else {
        const orderNumberParam = params.get('number');
        if (orderNumberParam) {
          orderQueryParams.number = orderNumberParam;
        }
      }
    }
    onQueryOrder(orderQueryParams);
  }, [params.subId]);

  const onHideOrderDetails = () => {
    showOrderDetails(false);
    listMyOrders();
    setSelectedOrderParams(null);
    history.push({ pathname: PROFILE_ROUTE + '/' + TabId.MY_ORDERS });
  };

  const handleChange = (value: string) => {
    setSelectedStatus(value);
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchedValue(value);
  };

  const searchByOrderNumber = () => {
    if (searchedValue) {
      requestApi(
        getMyOrders,
        { offset: 0, limit: 100, status: selectedStatus, order_number: searchedValue },
        (response: { results: Order[]; count: string }, error: string) => {
          if (error) {
            return;
          }
          setMyOrders(response.results);
        }
      );
    } else {
      listMyOrders();
    }
  };

  const listMyOrders = () => {
    requestApi(
      getMyOrders,
      { offset: 0, limit: 100, status: selectedStatus },
      (response: { results: Order[]; count: string }, error: string) => {
        if (error) {
          return;
        }
        const { results, count } = response;
        setMyOrders(results);
      },
      LOADING_UPLOADING_PRODUCT
    );
  };

  const getOrder = ({ id, number }: OrderQueryParams) => {
    const queryMethod = id ? getOrderById : getOrderByNumber;
    const input = id ? { id } : { id: number };
    requestApi(queryMethod, input, (response: Order, error: string) => {
      if (error) {
        return;
      }
      setOrder(response);
      setMyOrders([response]);
    });
  };

  useEffect(() => {
    if (order?.id) {
      getOrderProducts(order.id);
    }
  }, [order]);

  const getOrderProducts = (resourceId: number) => {
    requestApi(
      listOrderProducts,
      { resourceId },
      (response: { result: OrderLinesGroupedByPartnerObject[]; count: string }, error: string) => {
        if (error) {
          showOrderDetails(false);
          return;
        }
        const { result, count } = response;
        setOrderProducts(result);
      }
    );
  };

  const onQueryOrder = (query: OrderQueryParams) => {
    if (query.id || query.number) {
      showOrderDetails(true);
      setSelectedOrderParams(query);
      history.push({ pathname: getOrderDetailsUrl(query) });
    }
  };

  useEffect(() => {
    listMyOrders();
  }, [selectedStatus, i18n.language]);

  useEffect(() => {
    if (selectedOrderParams != null) {
      getOrder(selectedOrderParams);
    }
  }, [i18n.language, selectedOrderParams]);

  useEffect(() => {
    if (order?.id) {
      getOrderProducts(order.id);
    }
  }, [order]);

  return (
    <div className="profile_my-orders">
      {!isOrderDetails ? (
        <>
          <Row justify="space-between" align="middle">
            <Col>
              <Typography.Text className="section-title">{t(MY_ORDERS)}</Typography.Text>
            </Col>
            <Col className="actions-wrapper">
              <Select
                placeholder={t(ORDER_STATUS)}
                className="order-select"
                onChange={handleChange}
                dropdownClassName={`order-dropdown ${i18n.language}`}
              >
                {options.map((elm) => {
                  return (
                    <Option key={elm.id} value={elm.value}>
                      {elm.label}
                    </Option>
                  );
                })}
              </Select>
              <Separator horizontal={6} />
              <Input
                placeholder={t(SEARCH_BY_ORDER_NUMBER)}
                className="order-search-input"
                onChange={onSearch}
                prefix={<img src={icons.search.icon} />}
              />
              <Separator horizontal={5} />
              <Button type="primary" className="search-btn" onClick={searchByOrderNumber}>
                {t(SEARCH)}
              </Button>
            </Col>
          </Row>

          <Separator vertical={10} />
          <div className="table-wrapper">
            <Table
              columns={columns}
              dataSource={myOrders}
              pagination={false}
              bordered
              loading={loadingMap[LOADING_UPLOADING_PRODUCT]}
              locale={{ emptyText: t(THERE_ARE_NO_DATA) }}
            />
          </div>
        </>
      ) : (
        <div className="order-details">
          <Separator vertical={10} />
          <Row className="details-header" justify="space-between" align="middle" gutter={[2, 12]}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Row align="middle">
                <div className="arrow-wrapper clickable" onClick={onHideOrderDetails}>
                  {isArabic ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
                </div>
                <Separator horizontal={5} />
                <Typography.Text className="label"> {t(ORDER_DETAILS)} </Typography.Text>
              </Row>
            </Col>
            <Col>
              <Row className="order-number">
                <div>
                  {' '}
                  <img src={profileIcons.hash} />
                  <Typography.Text> {order?.number} </Typography.Text>
                </div>
                <div>
                  <img src={profileIcons.radar} />
                  <Typography.Text> {order?.status} </Typography.Text>
                </div>
                <div>
                  {' '}
                  <img src={profileIcons.tag} />
                  <Typography.Text>
                    {order?.total_incl_tax} ( {order?.currency} )
                  </Typography.Text>
                </div>
                <div>
                  <img src={profileIcons.quantity} />
                  <Typography.Text> {order?.num_items} </Typography.Text>
                </div>
                <div>
                  <img src={profileIcons.calendar} />
                  <Typography.Text>
                    {moment(order?.date_placed).locale(i18n.language).format('DD MMMM YYYY')}
                  </Typography.Text>
                </div>

                <Separator horizontal={7} />
              </Row>
            </Col>
          </Row>
          <Separator vertical={12} />
          <OrderDetails orderProducts={orderProducts} order={order!} />
        </div>
      )}
    </div>
  );
};
