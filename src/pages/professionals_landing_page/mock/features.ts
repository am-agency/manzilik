import { AR } from '../../../locales/constants';
import { FeatureType } from '../types';
import { landingPagesIcons } from '../../../assets/icons/landing-pages';

export const featureMock = (language: string): FeatureType[] => {
  const isArabic = language === AR;
  return [
    {
      text: isArabic
        ? 'تستطيع عرض نماذج أعمالك ومشاريعك الخاصة'
        : 'The best solutions to all the problems that you may encounter in the field of design and decoration',
      icon: landingPagesIcons.features.icon1,
    },
    {
      text: isArabic
        ? 'تستطيع استلام الأعمال والطلبات وقبولها ورفضها وإنهائها بعد تنفيذها'
        : 'Service providers (professional interior designers) that you can easily request their services through the platform',
      icon: landingPagesIcons.features.icon2,
    },
    {
      text: isArabic
        ? 'سيراك كل العملاء الذين يبحثون عن هذه المهنة في المنطقة التي تتواجد بها'
        : 'A large group of distinguished specialists in the world of decoration and furniture to help you always',
      icon: landingPagesIcons.features.icon3,
    },
  ];
};
