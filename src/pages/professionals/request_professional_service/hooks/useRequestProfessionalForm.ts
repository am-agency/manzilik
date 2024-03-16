import { CountryPhoneInputValue } from 'antd-country-phone-input';
import { RuleObject } from 'antd/lib/form';
import { useForm } from 'antd/lib/form/Form';
import { ERROR_INVALID_TEL_5XXXXXXXX, PLEASE_ENTER_VALID_PHONE_NUMBER } from '../../../../locales/strings';
import { NUMBER_REGEX } from '../../../auth/signup/constants';

interface ServiceInquiryForm {
  phone_number: CountryPhoneInputValue;
  whatsapp_number: CountryPhoneInputValue;
  professional_id: string;
  services: string[];
  categories: string[];
  photos: string[];
  description: string;
  budget_limits: string;
  city?: string;
  country?: string;
}

const DEFAULT_FORM_VALUE: ServiceInquiryForm = {
  professional_id: '',
  services: [],
  categories: [],
  photos: [],
  description: '',
  budget_limits: '',
  city: '',
  phone_number: { phone: '', code: 966, short: 'SA' },
  whatsapp_number: { phone: '', code: 966, short: 'SA' },
  country: '',
};

const validation = {
  required: () => ({ required: true }),
  phone: (t: (key: string) => string) => ({
    validator(_: RuleObject, value: CountryPhoneInputValue) {
      const phone = value.phone?.trim() || '';
      const isNumber = NUMBER_REGEX.test(phone);
      const isSaudi = value.code && value.code === 966;
      const isMatch = value.phone!.match(/^5\d{8}$/) !== null; // 5XXXXXXXX
      const isValid = isNumber && isSaudi && isMatch;
      return isValid ? Promise.resolve() : Promise.reject(t(ERROR_INVALID_TEL_5XXXXXXXX));
    },
  }),
};

export const useRequestProfessionalForm = () => {
  const [form] = useForm<ServiceInquiryForm>();

  const setProfessionalIdFormField = (professional_id: string) => {
    form.setFields([{ name: 'professional_id', value: professional_id }]);
  };

  const getFormValue = (): ServiceInquiryForm => {
    return {
      professional_id: form.getFieldValue('professional_id'),
      services: form.getFieldValue('services'),
      categories: form.getFieldValue('categories'),
      photos: form.getFieldValue('photos'),
      description: form.getFieldValue('description'),
      city: form.getFieldValue('city'),
      budget_limits: form.getFieldValue('budget_limits'),
      phone_number: form.getFieldValue('phone_number'),
      whatsapp_number: form.getFieldValue('whatsapp_number'),
      country: form.getFieldValue('country'),
    };
  };

  const setPhotos = (photos: string[]) => {
    form.setFieldsValue({ photos });
  };
  const setFieldValue = (field: string, value: string) => {
    form.setFieldsValue({ [field]: value });
  };

  return { form, setProfessionalIdFormField, getFormValue, setPhotos, DEFAULT_FORM_VALUE, validation, setFieldValue };
};
