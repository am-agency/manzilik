import { AR } from '../../../../locales/constants';

export const filtersDataSource = (lang: string) => {
  return {
    color: {
      title: lang == AR ? 'اللون' : 'Color',
      data: [
        {
          english_title: 'Yellow',
          extra_info: '{"score": 0.015264277, "hex": "#FFFF00"}',
          title: 'أصفر',
        },
        {
          english_title: 'Purple',
          extra_info: '{"score": 0.015264277, "hex": "#800080"}',
          title: 'بنفسجي',
        },
        {
          english_title: 'White',
          extra_info: '{"score": 0.015264277, "hex": "#FFFFFF"}',
          title: 'أبيض',
        },
        {
          english_title: 'Pink',
          extra_info: '{"score": 0.015264277, "hex": "#FFC0CB"}',
          title: 'وردي',
        },
        {
          english_title: 'Red',
          extra_info: '{"score": 0.015264277, "hex": "#FF0000"}',
          title: 'أحمر',
        },
        {
          english_title: 'Magenta / Fuchsia',
          extra_info: '{"score": 0.015264277, "hex": "#FF00FF"}',
          title: 'أرجواني',
        },
        {
          english_title: 'Olive',
          extra_info: '{"score": 0.015264277, "hex": "#808000"}',
          title: 'زيتوني',
        },
        {
          english_title: 'Beige',
          extra_info: '{"score": 0.015264277, "hex": "#F5F5DC"}',
          title: 'بيج',
        },
        {
          english_title: 'Black',
          extra_info: '{"score": 0.015264277, "hex": "#000000"}',
          title: 'أسود',
        },
        {
          english_title: 'Orange',
          extra_info: '{"score": 0.015264277, "hex": "#FFA500"}',
          title: 'برتقالي',
        },
        {
          english_title: 'Blue',
          extra_info: '{"score": 0.015264277, "hex": "#0000FF"}',
          title: 'أزرق',
        },
        {
          english_title: 'Turquoise',
          extra_info: '{"score": 0.015264277, "hex": "#40e0d0"}',
          title: 'فيروزي',
        },
        {
          english_title: 'Gray',
          extra_info: '{"score": 0.015264277, "hex": "#808080"}',
          title: 'رمادي',
        },
        {
          english_title: 'Green',
          extra_info: '{"score": 0.015264277, "hex": "#008000"}',
          title: 'أخضر',
        },
        {
          english_title: 'Brown',
          extra_info: '{"score": 0.015264277, "hex": "#964B00"}',
          title: 'بني',
        },
      ],
    },
    size: {
      title: lang == AR ? 'المساحة' : 'Space',
      data: [
        {
          english_title: 'Large',
          extra_info: null,
          title: 'كبيرة',
        },
        {
          english_title: 'Compact',
          extra_info: null,
          title: 'صغيرة',
        },
        {
          english_title: 'Medium',
          extra_info: null,
          title: 'متوسطة',
        },
      ],
    },
    style: {
      title: lang == AR ? 'الستايل' : 'Style',
      data: [
        {
          english_title: 'Rustic',
          extra_info: null,
          title: 'ريفي',
        },
        {
          english_title: 'Modern',
          extra_info: null,
          title: 'حديث',
        },
        {
          english_title: 'Andalusian',
          extra_info: null,
          title: 'أندلسي',
        },
        {
          english_title: 'Traditional',
          extra_info: null,
          title: 'تقليدي',
        },
        {
          english_title: 'Classic',
          extra_info: null,
          title: 'كلاسيك',
        },
      ],
    },
    price: {
      title: lang == AR ? 'السعر' : 'Price',
      data: [
        {
          english_title: 'Price',
          extra_info: '{"max": 0, "min": "100"}',
          title: 'السعر',
        },
      ],
    },
  };
};
