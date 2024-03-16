import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, List, Typography } from 'antd';
import { Client } from '../../API';
import { getUserName } from '../../utils';
import { useClient } from '../../app/hooks/use_client';
import { YOU } from '../../locales/strings';
import { useTranslation } from 'react-i18next';
import { listLikes } from '../../pages/idea/api';
import { useMainContext } from '../../app/providers/main';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';

interface Props {
  resourceId: string;
}
export const Likers: FunctionComponent<Props> = ({ resourceId }: Props) => {
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;

  const isCurrentUser = (id: string) => client?.id === id;
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const [clients, setClients] = useState<Client[]>([]);

  const getLikers = () => {
    requestApi(listLikes, { resourceId, limit: 30, offset: 0 }, (response: { results: Client[] }, error: string) => {
      if (error) {
        return;
      }
      setClients(response.results);
    });
  };
  useEffect(() => {
    getLikers();
  }, []);

  return (
    <List
      itemLayout="horizontal"
      dataSource={clients}
      renderItem={(client) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar size={50} icon={<UserOutlined />} src={client?.profile_image} />}
            title={<Typography.Text>{isCurrentUser(client?.id!) ? t(YOU) : getUserName(client)}</Typography.Text>}
          />
        </List.Item>
      )}
    />
  );
};
