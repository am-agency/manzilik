import { AR } from '../../../locales/constants';
import { ServiceType } from '../types';
import { landingPagesIcons } from '../../../assets/icons/landing-pages';

export const servicesMock = (language: string): ServiceType[] => {
  const isArabic = language === AR;
  return [
    {
      text: isArabic
        ? 'أفضل الحلول لكل المشاكل اللي ممكن تواجهك في مجـــــــــــال التصميم والديكور'
        : 'The best solutions to all the problems that you may encounter in the field of design and decoration',
      icon: landingPagesIcons.services.icon1,
    },
    {
      text: isArabic
        ? 'مزودي خدمات (مصممين داخليين محترفين) تستطيع طلب خدماتهم بسهولة عبر المنصة'
        : 'Service providers (professional interior designers) that you can easily request their services through the platform',
      icon: landingPagesIcons.services.icon2,
    },
    {
      text: isArabic
        ? 'مجموعة كبيرة من المختصين المتميزين في عالم الديكـــــور والأثاث لمساعدتك دومًا'
        : 'A large group of distinguished specialists in the world of decoration and furniture to help you always',
      icon: landingPagesIcons.services.icon3,
    },
    {
      text: isArabic
        ? 'مجموعة كبيرة من المقالات والمواضيع عن كل ما هو جديد في عالم التصميم والديكور'
        : 'A large collection of articles and topics about everything new in the world of design and decoration',
      icon: landingPagesIcons.services.icon4,
    },
  ];
};
