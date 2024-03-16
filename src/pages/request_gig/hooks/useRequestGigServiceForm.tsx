import { CountryPhoneInputValue } from 'antd-country-phone-input';
import { RuleObject } from 'antd/lib/form';
import { useForm } from 'antd/lib/form/Form';
import { ERROR_INVALID_TEL_5XXXXXXXX } from '../../../locales/strings';
import { NUMBER_REGEX } from '../../auth/signup/constants';

interface GigRequestForm {
  phone_number: CountryPhoneInputValue;
  whatsapp_number: CountryPhoneInputValue;
  professional_id: string;
  photos: string[];
  description: string;
}

const DEFAULT_FORM_VALUE: GigRequestForm = {
  professional_id: '',
  photos: [],
  description: '',
  phone_number: { phone: '', code: 966, short: 'SA' },
  whatsapp_number: { phone: '', code: 966, short: 'SA' },
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

export const useRequestGigServiceForm = () => {
  const [form] = useForm<GigRequestForm>();

  const setFormField = (name: string, value: string | number | boolean | string[]) => {
    form.setFields([{ name, value }]);
  };

  const resetPhoneNumber = () => {
    form.setFieldsValue({ phone_number: { ...form.getFieldValue('phone_number'), phone: '' } });
  };

  const resetWhatsappNumber = () => {
    form.setFieldsValue({ whatsapp_number: { ...form.getFieldValue('whatsapp_number'), phone: '' } });
  };
  const getFormValue = (): GigRequestForm => {
    return {
      professional_id: form.getFieldValue('professional_id'),
      photos: form.getFieldValue('photos'),
      description: form.getFieldValue('description'),
      phone_number: form.getFieldValue('phone_number'),
      whatsapp_number: form.getFieldValue('whatsapp_number'),
    };
  };

  const setPhotos = (photos: string[]) => {
    form.setFieldsValue({ photos });
  };

  return {
    form,
    setFormField,
    getFormValue,
    setPhotos,
    DEFAULT_FORM_VALUE,
    validation,
    resetPhoneNumber,
    resetWhatsappNumber,
  };
};
