import { List, Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { THERE_ARE_NO_DATA } from '../../locales/strings';
import { BaseEntity } from '../idea/types';
import { RelatedCard } from './related_card';

interface Props {
  list: BaseEntity[];
  title?: string;
  action: string;
  baseRedirectUrl?: string;
}

export const RelatedSideList: FunctionComponent<Props> = (props: Props) => {
  const { list, title, action, baseRedirectUrl } = props;
  const { t } = useTranslation();
  return (
    <>
      {title && <Typography.Text className="section-title">{title}</Typography.Text>}
      <List
        dataSource={list}
        bordered={false}
        split={false}
        loadMore={false}
        size="small"
        className="related-side-list"
        itemLayout="horizontal"
        locale={{ emptyText: t(THERE_ARE_NO_DATA) }}
        renderItem={(item) => {
          return <RelatedCard action={action} item={item} baseRedirectUrl={baseRedirectUrl} />;
        }}
      />
    </>
  );
};
