import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, Row, Typography, Badge, List } from 'antd';
import Separator from '../separator';
import { NoIdeas } from '../../pages/public_profile/components/no_ideas';
import { IdeaCard } from '../../pages/idea/components/idea_card';
import { getPaginationOffset, isArrayEmpty } from '../../utils';
import { CustomPagination, PaginationType } from '../pagination_item';
import { getLayoutDirection } from '../../app/layouts';
import { useTranslation } from 'react-i18next';
import { PROJECTS, UNLIMITED_CREATIVITY_IDEAS } from '../../locales/strings';
import { Idea } from '../idea/types';
import { useMainContext } from '../../app/providers/main';
import { getClientIdeasList } from '../../pages/public_profile/api';
import { PROFESSIONAL } from '../../app/settings';

interface Props {
  id: string;
  type?: string;
}

export const UserIdeasList: FunctionComponent<Props> = ({ id, type }: Props) => {
  const { t, i18n } = useTranslation();
  const { requestApi, userState } = useMainContext();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [totalIdeas, setTotalIdeas] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const limit = 6;
  const colSpan = type == PROFESSIONAL ? 2 : 3;

  const getUserIdeas = () => {
    requestApi(
      getClientIdeasList,
      { values: { offset, limit, resourceId: id }, user: userState.isAuthenticated },
      (response: { results: Idea[]; count: number }, error: string) => {
        if (error) {
          return error;
        }
        const { results, count } = response;
        setIdeas(results);
        setTotalIdeas(count);
      }
    );
  };

  const onPageChange = (page: number, pageSize?: number) => {
    const pagnation = getPaginationOffset(page, pageSize);
    setOffset(pagnation);
  };

  useEffect(() => {
    getUserIdeas();
  }, [id, offset]);

  if (type == PROFESSIONAL && ideas?.length == 0) {
    return <div />;
  }

  return (
    <Row align="middle" justify="center" className="ideas-container">
      <Col span={24}>
        <Typography.Text className="title">{t(PROJECTS)}</Typography.Text>
        <Badge count={totalIdeas !== 0 ? totalIdeas : null} />
        <Separator vertical={3} />
        <Typography.Text>{t(UNLIMITED_CREATIVITY_IDEAS)}</Typography.Text>
      </Col>
      <Col span={24} className="no-ideas-container">
        {isArrayEmpty(ideas) ? (
          <NoIdeas />
        ) : (
          <Row className="idea-list-container" justify="center">
            <Col span={24}>
              <List
                pagination={{
                  total: totalIdeas,
                  pageSize: limit,
                  className: `pagination ${getLayoutDirection(i18n.language)}`,
                  hideOnSinglePage: true,
                  onChange: onPageChange,
                  itemRender: (page: number, type: PaginationType) => CustomPagination(page, type, t),
                }}
                grid={{ xs: 1, sm: 2, md: 2, lg: colSpan, xl: colSpan, xxl: colSpan }}
                dataSource={ideas}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <IdeaCard idea={item} />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
};
