import {
  LeftOutlined,
  PaperClipOutlined,
  RightCircleOutlined,
  RightOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Menu,
  Modal as section,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import CountryPhoneInput from 'antd-country-phone-input';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { Dispatch, FunctionComponent, ReactElement, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Category, City, Professional, ProfessionalType, Service } from '../../../../../API';
import { getLayoutDirection } from '../../../../../app/layouts';
import { useMainContext } from '../../../../../app/providers/main';
import { profileIcons } from '../../../../../assets/icons/profile';
import Separator from '../../../../../components/separator';
import { AR } from '../../../../../locales/constants';
import {
  ABOUT_ME,
  ABOUT_SHOULD_BE_MORE_THAN_FIFTY_CHARACTER,
  SELECT_ACCOUNT_TYPE,
  ADDRESS,
  PERSONAL_FREELANCE_LICENSE,
  CATEGORIES,
  COMPANY_ACCOUNT_TYPE,
  COMPANY_LOGO,
  COMPANY_NAME,
  COMPANY_REGISTERATION_REF,
  CONFIRM,
  EMAIL,
  FIELD_SHOULD_BE_URL,
  FIRST_NAME,
  LAST_NAME,
  LETTER,
  LOCATION,
  PERSONAL_ACCOUNT_TYPE,
  PHONE_NUMBER,
  PLEASE_ENTER_VALID_PHONE_NUMBER,
  SELECT_CATEGORY,
  SELECT_LOCATION,
  SELECT_SERVICE,
  SERVICES,
  WEBSITE_OR_BLOG,
  ERROR_ACCOUNT_TYPE_NOT_SELECTED,
  UPLOAD_PHOTOS,
  UPLOAD_PHOTO,
  INVALID_REGISTERATION_REFERENCE,
  INVALID_FREELANCE_NUMBER,
  COVERED_CITIES,
  EXAMPLE_LICENSE,
} from '../../../../../locales/strings';
import { customRequest, emptyStringNotAllowed, isValidURL } from '../../../../../utils';
import { NUMBER_REGEX } from '../../../../auth/signup/constants';
import { FormatterProps } from '../../../../contact_us/components/contact_form';
import { listCategories } from '../../../../ideas/api';
import { required } from '../../../../projects/add_new_project';
import { completeProfessionalProfile, listLocations, listServices } from '../../../api';
const { Option } = Select;

interface Props {
  professional: Professional;
  setProfessional: Dispatch<SetStateAction<Professional | undefined>>;
  showMissingAccountType: boolean;
  onUploadPhotos: (fileList: UploadFile[]) => Promise<(string | void)[] | undefined>;
  updateFormValues?: (professional: Professional) => void;
  form: FormInstance<Record<string, unknown>>;
}

const fixedAlphanumeric = (num: number, error: string) => () => ({
  validator(_: unknown, inputValue: string) {
    const isAlphaNumeric = inputValue.match(/^[a-zA-Z0-9_]*$/g);
    if (isAlphaNumeric && inputValue.length === num) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(error));
  },
});

const fixedDigits = (minNumber: number, maxNumber: number, error: string) => () => ({
  validator(_: unknown, inputValue: string) {
    const isAlphaNumeric = inputValue.match(/^[a-zA-Z0-9-]*$/g);

    if (isAlphaNumeric && inputValue.length >= minNumber && inputValue.length <= maxNumber) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(error));
  },
});

export const defaultCompanyLogoSrc = process.env.PUBLIC_URL + '/default_company_logo.png';

export const StepOne: FunctionComponent<Props> = ({
  professional,
  setProfessional,
  showMissingAccountType,
  onUploadPhotos,
  updateFormValues,
  form,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const [services, setServices] = useState<Service[]>();
  const [locations, setLocations] = useState<City[]>();
  const counterClassName = i18n.language === AR ? 'msg-textarea-ar' : 'msg-textarea-en';
  const isEmail = professional?.client?.email;
  const [uploadedCompanyLogo, setUploadedCompanyLogo] = useState<string>();

  const getServices = async () => {
    requestApi(listServices, { limit: 200 }, (list: Service[], error: string) => {
      if (error) {
        return;
      }
      setServices(list);
    });
  };

  const getLocations = () => {
    requestApi(listLocations, { limit: 200 }, (list: City[], error: string) => {
      if (error) {
        return;
      }
      setLocations(list);
    });
  };

  useEffect(() => {
    getServices();
    getLocations();
  }, [i18n.language]);

  const companyLogo = useMemo(() => {
    let _logo: UploadFile<string> = {
      uid: '1',
      name: professional?.company_name || '',
      url: uploadedCompanyLogo ? uploadedCompanyLogo : defaultCompanyLogoSrc,
      status: 'done',
    };
    if (professional?.company_logo) {
      _logo = {
        uid: '1',
        name: professional?.company_name || '',
        url: professional?.company_logo,
        status: 'done',
      };
    }
    return _logo;
  }, [professional, uploadedCompanyLogo]);

  const onDeleteCompanyLogo = () => {
    const values = form.getFieldsValue();
    const input: Record<string, string | string[]> = {
      ...values,
      company_logo: defaultCompanyLogoSrc,
    };
    const mobile = values?.mobile as { code: number; phone: number | null };
    if (mobile?.phone) {
      input.mobile = `${mobile.code}${mobile.phone}`;
    } else {
      delete input.mobile;
    }
    delete input.email;
    setProfessional((pre) => ({ ...pre, company_logo: defaultCompanyLogoSrc } as unknown as Professional));
    updateFormValues?.({ ...professional, company_logo: defaultCompanyLogoSrc });
    requestApi(completeProfessionalProfile, input, (result: Professional, error: string) => {
      if (error) {
        setProfessional({ ...values } as Professional);
        return;
      }
    });
  };

  return (
    <Row gutter={30}>
      <Col flex={2}>
        <Form.Item name="professional_type">
          {showMissingAccountType && <Alert className="field-error" message={t(ERROR_ACCOUNT_TYPE_NOT_SELECTED)} />}
          <Row justify="center">
            <Button
              onClick={() =>
                setProfessional((pre) => ({ ...pre, professional_type: ProfessionalType.PERSONAL } as Professional))
              }
              className={
                'acc-option ' + (professional?.professional_type === ProfessionalType.PERSONAL ? 'selected' : '')
              }
            >
              <UserOutlined />
              <span className="user-label">{t(PERSONAL_ACCOUNT_TYPE)}</span>
            </Button>
            <Button
              onClick={() =>
                setProfessional((pre) => ({ ...pre, professional_type: ProfessionalType.COMPANY } as Professional))
              }
              className={
                'acc-option ' + (professional?.professional_type === ProfessionalType.COMPANY ? 'selected' : '')
              }
            >
              <ShopOutlined />
              <span className="user-label">{t(COMPANY_ACCOUNT_TYPE)}</span>
            </Button>
          </Row>
          <Input hidden value={professional?.professional_type || ''} />
        </Form.Item>
        {professional?.professional_type === ProfessionalType.COMPANY && (
          <>
            <span className="field-label">{t(COMPANY_NAME)}</span>
            <Form.Item name="company_name" rules={[required]}>
              <Input />
            </Form.Item>
            <span className="field-label">{t(COMPANY_LOGO)}</span>
            <Upload
              listType="picture-card"
              accept="image/png, image/jpeg, image/gif"
              customRequest={customRequest}
              fileList={[companyLogo]}
              className="upload-logo"
              maxCount={1}
              onChange={async (file) => {
                try {
                  const response = await onUploadPhotos(file.fileList);
                  if (response && response[0]) {
                    const companyLogo: string = response[0];
                    setUploadedCompanyLogo(companyLogo);
                    localStorage.setItem('companyLogo', companyLogo);
                    const next: Professional = professional
                      ? { ...professional, company_logo: companyLogo }
                      : { company_logo: companyLogo, __typename: 'Professional', id: '' };
                    // setProfessional(next);
                    updateFormValues?.(next);
                  }
                } catch (error) {}
              }}
              itemRender={(
                originNode: ReactElement,
                file: UploadFile,
                fileList: object[],
                actions: { download: Function; preview: Function; remove: () => void }
              ) => {
                return (
                  <div className="image-wrapper">
                    <div className="overlay-wrapper">
                      <img src={file.url} className="img-fit-content" />
                      {/* <div className="thumbnail-overlay img-fit-content rounded-border" /> */}
                    </div>
                    <img src={profileIcons.trashCan} className="delete-icon" onClick={onDeleteCompanyLogo} />
                  </div>
                );
              }}
            >
              <Col>
                <Row>
                  <PaperClipOutlined />
                  <Separator horizontal={4} />
                  <div>{t(UPLOAD_PHOTO)}</div>
                </Row>
              </Col>
            </Upload>
            <Form.Item name="company_logo">
              <Input hidden />
            </Form.Item>
            <span className="field-label">{t(COMPANY_REGISTERATION_REF)}</span>
            <Form.Item name="company_registration_ref" rules={[fixedDigits(8, 11, t(INVALID_REGISTERATION_REFERENCE))]}>
              <Input placeholder={t(EXAMPLE_LICENSE)} />
            </Form.Item>
          </>
        )}
        {professional?.professional_type === ProfessionalType.PERSONAL && (
          <>
            <span className="field-label">{t(PERSONAL_FREELANCE_LICENSE)}</span>
            <Form.Item name="personal_freelance_license" rules={[fixedAlphanumeric(8, t(INVALID_FREELANCE_NUMBER))]}>
              <Input />
            </Form.Item>
          </>
        )}
      </Col>
      <Col flex={1}>
        <span className="field-label">{t(FIRST_NAME)}</span>
        <Form.Item name="first_name" rules={[required]}>
          <Input />
        </Form.Item>
        <span className="field-label">{t(LAST_NAME)}</span>
        <Form.Item name="last_name" rules={[required, emptyStringNotAllowed(t)]}>
          <Input />
        </Form.Item>
        <span className="field-label">{t(ADDRESS)}</span>
        <Form.Item name="address" rules={[required, emptyStringNotAllowed(t)]}>
          <Input />
        </Form.Item>
        {isEmail && (
          <>
            <span className="field-label">{t(EMAIL)}</span>
            <Form.Item name="email">
              <Input disabled />
            </Form.Item>
          </>
        )}
        <span className="field-label">{t(PHONE_NUMBER)}</span>
        <Form.Item
          name="mobile"
          className={`${!isEmail && 'email-disable'}`}
          rules={[
            required,
            () => ({
              ...required,
              validator(_, value) {
                if (value.phone && !NUMBER_REGEX.test(value.phone)) {
                  return Promise.reject(t(PLEASE_ENTER_VALID_PHONE_NUMBER));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <CountryPhoneInput
            disabled={!isEmail}
            className="country-phone-input"
            type="number"
            defaultValue={{ short: 'SA' }}
          />
        </Form.Item>
        <span className="field-label">{t(WEBSITE_OR_BLOG)}</span>
        <Form.Item name="blog">
          <Input />
        </Form.Item>
        <span className="field-label">{t(COVERED_CITIES)}</span>
        <Form.Item name="locations" rules={[required]} validateTrigger="onChange">
          <Select
            mode="multiple"
            dropdownClassName={`select-a-project-list ${getLayoutDirection(i18n.language)}`}
            showArrow
            showSearch
            size="large"
            maxTagCount="responsive"
            placeholder={t(SELECT_LOCATION)}
            optionFilterProp="label"
          >
            {locations?.map((current) => (
              <Option key={current.id} value={current.id!} label={current.name}>
                {current.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* <span className="field-label">{t(CATEGORIES)}</span> */}
        {/* <Form.Item name="categories" rules={[required]} validateTrigger="onChange">
          <Select
            mode="multiple"
            dropdownClassName={`select-a-project-list ${getLayoutDirection(i18n.language)}`}
            showArrow
            showSearch
            size="large"
            maxTagCount="responsive"
            placeholder={t(SELECT_CATEGORY)}
            optionFilterProp="label"
          >
            {categories?.map((current) => (
              <Option key={current.id} value={current.id!} label={current?.title}>
                {current.title}
              </Option>
            ))}
          </Select>
        </Form.Item> */}
        <span className="field-label">{t(SERVICES)}</span>
        <Form.Item name="services" rules={[required]} validateTrigger="onChange">
          <Select
            mode="multiple"
            dropdownClassName={`select-a-project-list ${getLayoutDirection(i18n.language)}`}
            showArrow
            showSearch
            size="large"
            maxTagCount="responsive"
            placeholder={t(SELECT_SERVICE)}
            optionFilterProp="label"
          >
            {services?.map((current) => (
              <Option key={current.id} value={current.id!} label={current?.title}>
                {current.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <span className="field-label">{t(ABOUT_ME)}</span>
        <Form.Item
          name="about_me"
          rules={[
            required,
            () => ({
              validator(_, inputValue) {
                if (inputValue && inputValue.length > 50) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t(ABOUT_SHOULD_BE_MORE_THAN_FIFTY_CHARACTER)));
              },
            }),
          ]}
        >
          <Input.TextArea
            minLength={50}
            className={counterClassName}
            showCount={{
              formatter: ({ count }: FormatterProps) => `${count} ${t(LETTER)}`,
            }}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};
