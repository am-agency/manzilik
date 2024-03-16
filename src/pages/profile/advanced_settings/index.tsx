import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Switch, Row, Typography, message, Popover } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import {
  ADVANCED_SETTINGS,
  SAVE_SETTINGS,
  UPDATED_NOTIFICATIONS_SUCCESS,
  YOU_DONT_HAVE_EMAIL,
} from '../../../locales/strings';
import Separator from '../../../components/separator';
import { NotificationSettingObject, NotificationStatus, ResultOutput } from '../../../API';
import { PLATFORM, UPDATED } from '../../../app/settings';
import { useMainContext } from '../../../app/providers/main';
import { listNotificationsSettings, updateNotifications } from './api';
import { NotificationsObjectType } from './types';
import i18n from '../../../app/i18n';
import { getLayoutDirection } from '../../../app/layouts';
import { PrivateProfileHeader } from '../edit_profile/components/profile_header';

export const AdvancedSettings = () => {
  const [form] = useForm();
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const [notificationsSettings, setNotificationsSettings] = useState<NotificationSettingObject[]>([]);

  const getNotificationsList = () => {
    requestApi(
      listNotificationsSettings,
      { platform: PLATFORM },
      (response: { results: NotificationSettingObject[] }, error: string) => {
        if (error) {
          return;
        }
        const { results } = response;
        setNotificationsSettings(results);
      }
    );
  };

  const onFinish = (values: NotificationsObjectType) => {
    const requestBody = Object.keys(values).map((row) => {
      const data = values![row] as string;
      return {
        id: row,
        status: data ? NotificationStatus.ENABLED : NotificationStatus.DISABLED,
      };
    });

    requestApi(updateNotifications, requestBody, (result: ResultOutput, error: string) => {
      if (error) {
        return;
      }
      const { status } = result;
      if (status === UPDATED) {
        message.success({
          content: t(UPDATED_NOTIFICATIONS_SUCCESS),
          className: `${getLayoutDirection(i18n.language)}`,
        });
      }
    });
  };

  useEffect(() => {
    getNotificationsList();
  }, [i18n.language]);

  return (
    <Row className="advanced-settings-form">
      <Form name="advanced-settings" form={form} onFinish={onFinish}>
        <PrivateProfileHeader title={t(ADVANCED_SETTINGS)} />
        <Separator vertical={15} />
        <Row>
          <Col span={24}>
            {notificationsSettings?.map((data) => {
              return (
                <>
                  <Separator vertical={6} />
                  <Typography.Text className="email-notification">{data?.text}</Typography.Text>
                  <Separator vertical={8} />
                  {data?.settings?.map((setting) => (
                    <div className="settings-label" key={setting?.id}>
                      <Popover
                        overlayClassName={`${getLayoutDirection(i18n.language)} ${
                          !setting?.blocked ? 'settings-popover' : ''
                        }`}
                        trigger={'hover'}
                        placement="topRight"
                        destroyTooltipOnHide={true}
                        content={<Typography.Text>{setting?.blocked && t(YOU_DONT_HAVE_EMAIL)}</Typography.Text>}
                      >
                        <Form.Item name={setting?.id!} initialValue={setting?.status == NotificationStatus.ENABLED}>
                          <Switch
                            disabled={setting?.blocked!}
                            defaultChecked={setting?.status == NotificationStatus.ENABLED}
                          />
                        </Form.Item>
                      </Popover>
                      &nbsp;&nbsp; {setting?.title}
                    </div>
                  ))}
                </>
              );
            })}
          </Col>
        </Row>
        <Row justify="start" align="middle">
          <Col>
            <Button htmlType="submit" type="primary">
              {t(SAVE_SETTINGS)}
            </Button>
          </Col>
        </Row>
      </Form>
    </Row>
  );
};
