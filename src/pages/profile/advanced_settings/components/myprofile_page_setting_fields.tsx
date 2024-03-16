import React from 'react';
import { Form, Checkbox, Col, Input, Row, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CLIMATE_ZONE_FOR_GARDEN_FORUMS,
  DEFAULT_PHOTO_ORDER_IN_MY_IDEABOOKS,
  MY_GARDEN_WEB_TRADING_LIST,
} from '../../../../locales/strings';
import { getDefaultPhotosOrderOptions, getMyProfilePageSettingFields } from '../utils';
import TextArea from 'antd/lib/input/TextArea';
import { ideaIcons } from '../../../../assets/icons/idea';
import { Option } from '../types';
import icons from '../../../../assets/icons';

export const MyProfilePageSettingFields = () => {
  const { t } = useTranslation();
  const optionsList = getDefaultPhotosOrderOptions(t);
  return (
    <Form.List name="myProfilePage">
      {() => (
        <>
          {getMyProfilePageSettingFields(t).map((elem) => (
            <Form.Item key={elem.name} name={elem.name} valuePropName="checked">
              <Checkbox className="form-item-label">{elem.label}</Checkbox>
            </Form.Item>
          ))}
          <Row>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Typography.Text>{t(DEFAULT_PHOTO_ORDER_IN_MY_IDEABOOKS)}</Typography.Text>
              <Form.Item name="defaultPhotoOrder" initialValue={optionsList[0].value}>
                <Select>
                  {optionsList.map((option: Option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Typography.Text>{t(CLIMATE_ZONE_FOR_GARDEN_FORUMS)}</Typography.Text>
              <Row>
                <Form.Item name="climateZone">
                  <Input />
                </Form.Item>
                <div className="location-btn">
                  <img src={icons.location.icon} />
                </div>
              </Row>
            </Col>
          </Row>
          <Typography.Text>{t(MY_GARDEN_WEB_TRADING_LIST)}</Typography.Text>
          <Form.Item name="myGardenWebList">
            <TextArea className="ant-textarea" />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
