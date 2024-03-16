import React from 'react';
import { Col, List, Row, Tag, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { getLayoutDirection } from '../../../../app/layouts';
import Separator from '../../../../components/separator';
import { READ_MORE } from '../../../../locales/strings';
import { populateRoute } from '../../../../utils';
import { BRAND_ROUTE } from '../../../../utils/routes';
import { Review } from '../../../professionals/components/review';
import { StoreLogDetails } from '../store_log_details';
import { Brand } from '../../../../API';

interface Props {
  item: Brand;
}

const StoreItem = ({ item }: Props) => {
  const { t, i18n } = useTranslation();
  const { xs } = useBreakpoint();

  const langDirection = getLayoutDirection(i18n.language);
  const storePath = populateRoute(BRAND_ROUTE, { id: item.id });
  const history = useHistory();
  const onExpand = () => {
    history.push(storePath);
  };

  return (
    <>
      <Separator vertical={13} />
      <div className="store-item">
        <List.Item
          key={item.id}
          extra={
            <Link to={storePath}>
              <img className={`img-fit-content rounded-left-border ${langDirection}`} src={item?.logo!} alt={'photo'} />
            </Link>
          }
        >
          <Row justify="space-between">
            <Col xl={15} lg={14} md={24} sm={24} xs={24}>
              <List.Item.Meta
                title={
                  <Row className="store-title">
                    <Col>
                      <div className="store-title__tag">{t(item?.type!)}</div>
                    </Col>
                    <Col className="store-title__name">
                      <Link to={storePath}>{item.title}</Link>
                    </Col>
                  </Row>
                }
                description={<Review reviews_total={item.rate!} reviews_count={item.rates_count!} />}
              />

              {item?.tags?.results?.length ? (
                <>
                  <Separator vertical={5} />
                  <div className="professional__card-tags">
                    <Typography.Paragraph
                      ellipsis={{
                        rows: xs ? 2 : 1,
                      }}
                      className="services-typography"
                    >
                      {item.tags.results?.map((tag, index) => {
                        return (
                          <span key={`store-tag-${index}`} className="professional__card-tag service-tag">
                            <Tag>
                              <span>{tag?.title}</span>
                            </Tag>
                          </span>
                        );
                      })}
                    </Typography.Paragraph>
                    <Separator vertical={5} />
                  </div>
                </>
              ) : null}
              {item.description && (
                <Typography.Paragraph
                  className="about-prof"
                  ellipsis={{
                    rows: 2,
                    expandable: true,
                    onExpand: onExpand,
                    symbol: t(READ_MORE),
                  }}
                >
                  {item.description}
                </Typography.Paragraph>
              )}
            </Col>
            <Col className="store-item-main-contact-info-wrapper" xl={7} lg={10} md={24} sm={24} xs={24}>
              <StoreLogDetails item={item} />
            </Col>
          </Row>
        </List.Item>
      </div>
    </>
  );
};

export default StoreItem;
