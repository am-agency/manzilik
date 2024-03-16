import { FAQ } from '../../../API';
import { AR } from '../../../locales/constants';

export const FaqMock = (language: string): FAQ[] => {
  const isArabic = language === AR;
  return [
    {
      __typename: 'FAQ',
      title: isArabic ? 'ما هي منصة "منزلِك"؟' : 'What is Manzilik Platform?',
      description: isArabic
        ? 'منزلِك هي منصة سعودية وهي الأولى في الوطن العربي التي تسعى إلى عرض أفضل الحلول لكافة العوائق التي قد تواجهك في عالم الديكور. نوفر لك مجموعة واسعة من خدمات التصميم والديكور والتي يوفرها لك مجموعة من المحترفين عبر المنصة.'
        : 'Manzilik is a Saudi platform and the first in the Arab World to provide the best solutions for all furniture challenges you may face. We offer a wide range of decor and design services through our professionals.',
    },
    {
      __typename: 'FAQ',
      title: isArabic ? 'لماذا أحتاج إلى استخدام منصة "منزلِك"؟' : 'Why do I need to use “Manzilik”?',
      description: isArabic
        ? 'لأننا -ببساطة- نساعدك على تصميم منزل أحلامك. كيف؟ عن طريق توفير مجموعة واسعة من أفكار تصاميم الديكور التي تستطيع تطبيقها عند تجهيز منزلك، كما يمكنك الاستعانة بأحد (المحترفين) لدينا والذي سيوفر لك كل المساعدة التي تحتاجها. '
        : 'Because we merely help you design your dream house. How? Through providing a wide range of decor designs ideas that you can apply when designing your home. You can also ask one of our professionals for all the help you might need.',
    },
    {
      __typename: 'FAQ',
      title: isArabic ? 'هل يوجد تطبيق هاتفي للمنصة؟' : 'Is there an app for Manzilik?',
      description: isArabic
        ? 'بالتأكيد، يوجد تطبيق للأجهزة التي تدعم نظام التشغيل Android أو IOS.'
        : 'Sure, there is an app for devices that support Android or IOS systems.',
    },
    {
      __typename: 'FAQ',
      title: isArabic ? 'ما هو قسم "النقاش"؟' : 'What is the “Discussion” Section?',
      description: isArabic
        ? 'قسم النقاش هو القسم المُفضّل لدينا. نستطيع من خلاله استقبال أي استفسار لديك حول مجال الديكور والتصميم الداخلي. تستطيع طرح أي مشكلة لديك وسيقوم أحد خبرائنا بالرد عليك. بإمكانك في هذا القسم أيضًا أن تتباهى بالتغيير الذي قمت به في ديكور منزلك عن طريق نشر صور "قبل وبعد" .ننتطرك دومًا في قسم النقاش حتى نوفر لك المساعدة ونشاركك الفرحة بتغيير ديكورك'
        : 'The Discussion Section is our favorite section. We can receive any of your inquiries related to decor and interior design. You can post any decor-related problem, and one of our professionals will reply to you. You may also brag about any decor changes you have done through posting “before and after” photos. We always wait to provide you with the needed help and feel happy about any decor changes you make',
    },
  ];
};
