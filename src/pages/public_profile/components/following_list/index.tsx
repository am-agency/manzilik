import React, { FunctionComponent, useEffect, useState } from 'react';
// Components
import { List, Skeleton } from 'antd';
import { Client } from '../../../../API';
import { FollowListItem } from '../list_item';

import { withPagination, WithPaginationProps } from '../../../../app/hooks/with_pagination';
import { getClientFollowees } from '../../api';
import { NO_COMMENTS, THERE_ARE_NO_DATA } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import Loader from 'react-spinners/ClipLoader';

interface Props extends WithPaginationProps<Client> {
  userId?: string;
  onFollowUser?: (id?: string, type?: string) => void;
  onUnFollowUser?: (id?: string, type?: string) => void;
}

const FollowingList: FunctionComponent<Props> = ({ list, userId, onFollowUser, onUnFollowUser, loading }: Props) => {
  const { t } = useTranslation();

  return list && !loading ? (
    <List
      dataSource={list}
      renderItem={(item, index) => (
        <FollowListItem
          item={item}
          userId={userId!}
          onFollowUser={onFollowUser!}
          onUnFollowUser={onUnFollowUser!}
          isLast={list && index === list.length - 1}
        />
      )}
      locale={{ emptyText: t(THERE_ARE_NO_DATA) }}
      loading={list?.length == 0}
    />
  ) : (
    <Skeleton avatar paragraph={{ rows: 1 }} active />
  );
};

export default withPagination<Client, Props>(getClientFollowees, FollowingList);
