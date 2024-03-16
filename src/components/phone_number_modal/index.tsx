import React, { useEffect, useState } from 'react';
import { aiIcons } from '../../assets/icons/ai';
import {
  DESCRIBE_SERVICE,
  DESCRIPTION_HELPS_YOU,
  PHONE_NUMBER,
  SEND_TO_MANZILIK,
  WE_NEED_YOUR_PHONE,
} from '../../locales/strings';
import CountryPhoneInput, { ConfigProvider, CountryPhoneInputValue } from 'antd-country-phone-input';
import { Form, Input, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { AR } from '../../locales/constants';
import icons from '../../assets/icons';
import { useForm } from 'antd/lib/form/Form';
import en from 'world_countries_lists/data/countries/en/world.json';
import ar from 'world_countries_lists/data/countries/ar/world.json';
import { required } from '../../pages/projects/add_new_project';
import { useClient } from '../../app/hooks/use_client';
const mandatoryStyle = {
  color: 'red',
  marginInlineStart: '5px',
};

interface PhoneNumberModalProps {
  onRequest: () => void;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  onPhoneNumberChange: (value: CountryPhoneInputValue) => void;
  onDescriptionChange?: (value: string) => void;
  withDescription?: boolean;
  title?: string;
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = (props) => {
  const {
    onRequest,
    isModalVisible,
    setIsModalVisible,
    onPhoneNumberChange,
    onDescriptionChange,
    withDescription = true,
    title = WE_NEED_YOUR_PHONE,
  } = props;
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState<CountryPhoneInputValue>({ short: 'SA', phone: '555555', code: 966 });
  const [form] = useForm();
  const initialValues = {
    phone_number: { code: '966', phone: '', short: 'SA' },
    description: '',
  };
  const [isFormValid, setIsFormValid] = useState(false);
  const { client } = useClient();
  const phone = form.getFieldValue('phone_number');
  const description = form.getFieldValue('description');

  const onToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (client?.mobile) {
      form.setFieldsValue({ phone_number: { code: '966', phone: client.mobile } });
    }
  }, [client]);

  useEffect(() => {
    if (phone?.phone.length === 9 && description?.length > 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [phone, description]);

  return (
    <div>
      <Modal visible={isModalVisible} onCancel={onToggleModal} footer={false} className="referral-modal-container">
        <div className="modal-body">
          <img src={aiIcons.phone} alt="" />
          <p>{t(title)}</p>
          <ConfigProvider
            locale={i18n.language === AR ? ar : en}
            areaMapper={(area) => {
              if (area.name?.includes('Saudi Arabia') || area.name?.includes('السعودية')) {
                return {
                  ...area,
                  emoji: <img src={icons.saudi_arabia_flag.icon} className="area-emoji" />,
                  phoneCode: 966,
                };
              }
              return area;
            }}
          >
            <Form form={form} initialValues={initialValues}>
              <Typography.Text>
                {t(PHONE_NUMBER)}
                <span style={mandatoryStyle}>*</span>
              </Typography.Text>
              <Form.Item name="phone_number" rules={[required]}>
                <CountryPhoneInput
                  type="number"
                  onChange={(v) => {
                    setValue(v);
                    onPhoneNumberChange(v);
                  }}
                />
              </Form.Item>
              {withDescription && (
                <>
                  <Typography.Text>
                    {t(DESCRIBE_SERVICE)}
                    <span style={mandatoryStyle}>*</span>
                  </Typography.Text>
                  <Form.Item name="description" rules={[required]}>
                    <Input.TextArea
                      placeholder={t(DESCRIPTION_HELPS_YOU)}
                      onChange={(e) => {
                        onDescriptionChange!(e.target.value);
                      }}
                    />
                  </Form.Item>
                </>
              )}
            </Form>
          </ConfigProvider>
          <button
            disabled={!isFormValid}
            onClick={onRequest}
            style={{
              backgroundColor: isFormValid ? '#464774' : '#D3D3D3',
              color: isFormValid ? 'white' : 'black',
            }}
          >
            {t(SEND_TO_MANZILIK)}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PhoneNumberModal;
