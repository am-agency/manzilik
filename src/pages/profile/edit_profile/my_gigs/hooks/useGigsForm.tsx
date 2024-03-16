import { useForm } from 'antd/lib/form/Form';
import { GigsListCities, GigsListService } from '../types';
import { useEffect } from 'react';

interface GigServiceInputForm {
  id: string;
  title: string;
  description: string;
  services: string[];
  cities: string[];
  price: number;
  photos: string[];
  is_enabled: boolean;
}

const DEFAULT_FORM_VALUE: GigServiceInputForm = {
  id: '',
  title: '',
  description: '',
  services: [],
  cities: [],
  price: 0,
  photos: [],
  is_enabled: true,
};

const validation = {
  required: () => ({ required: true }),
};

export const useGigsForm = () => {
  const [form] = useForm<GigServiceInputForm>();

  const setFormField = (
    name: string,
    value: string | number | boolean | string[] | GigsListCities[] | GigsListService[]
  ) => {
    form.setFields([{ name, value }]);
  };

  const clearForm = () => {
    form.resetFields();
  };
  const isAllFilled = () => {
    const values = form.getFieldsValue();
    return Object.values(values).every((value) => value !== undefined && value !== null && value !== '');
  };

  const getFormValue = (): GigServiceInputForm => {
    return {
      id: form.getFieldValue('id'),
      title: form.getFieldValue('title'),
      description: form.getFieldValue('description'),
      services: form.getFieldValue('services'),
      cities: form.getFieldValue('cities'),
      price: form.getFieldValue('price'),
      photos: form.getFieldValue('photos'),
      is_enabled: form.getFieldValue('is_enabled'),
    };
  };

  const setPhotos = (photos: string[]) => {
    form.setFieldsValue({ photos });
  };

  return { form, getFormValue, setPhotos, DEFAULT_FORM_VALUE, validation, setFormField, clearForm, isAllFilled };
};
