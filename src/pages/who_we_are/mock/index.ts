import { AR } from '../../../locales/constants';
import { AboutUs } from '../components/who_we_are_content/types';

export const whoWeAreMock = (lang: string): AboutUs => {
  const isArabic = lang === AR;

  return {
    sub_title: isArabic
      ? 'منزلِك هي منصة الكترونيّة متخصصة لمساعدتك في تجديد وتصميم منزلِك. كيف نقوم بذلك؟ عبر مجموعة مميزة من المتخصصين في مجال الديكور، وبائعي منتجات المنزل، وأصحاب المنازل، والمستأجرين، ومهندسي الديكور الذين يعملون جنبًا إلى جنب لمساعدتك على تصميم منزل أحلامك.'
      : 'Manzilik is an online platform specialized in helping you renovate and design your home. How do we do that? We bring together a distinctive group of home professionals, sellers of home goods, homeowners, renters, and decorators who work side by side to help you design your dream home. ',
    description: '',
    img_description: isArabic
      ? 'تحتوي منزلِك على أفكار تصاميم، ومجموعة واسعة من النصائح، والمقالات، والمنتجات والخدمات ذات العلاقة بكل ما هو حديث في مجال الديكور والتصميم الداخلي.'
      : 'Manzilik has design ideas, a wide range of advice, articles, products, and services related to decor and interior design updates.',
    footer_content: isArabic
      ? 'نوفر لك النصائح المتعلقة بعالم الديكور والتصميم وقتما تحتاجها. في منزِلِك، راحتك وأناقة بيتك هي هدفنا الأسمى'
      : 'We give you advice when you need it most. In Manzilik, your comfort and the elegance of your house is our ultimate goal.',
    services: {
      title: isArabic ? 'منزلِك في نقاط' : 'Manzilik in Points',
      description: isArabic
        ? 'منزلِك هي منصة سعودية متخصصة في مجال الديكور والتصميم الداخلي. تسعى إلى مساعدتك في امتلاك منزل أحلامك'
        : 'Manzilik is a Saudi platform specialized in decoration and interior design. The platform seeks to help you (own) your dream house',
      services_content: [
        isArabic
          ? 'منزلك هي منصة الكترونية توفر أفضل الحلول لكافة العوائق التي قد تواجهك في مجال التصميم والديكور'
          : 'Manzilik is an online platform that provides the best solutions for challenges that you may face in decoration',
        isArabic
          ? 'تحتوي المنصة على مزودي خدمات (مصممين محترفين) تستطيع طلب خدماتهم بسهولة عبر المنصة'
          : 'The platform contains service providers (professional designers) who provide decor and design services that you can request',
        isArabic
          ? 'نوفر لك مجموعة هائلة من الأفكار المعاصرة في عالم الديكور سواء عبر موقعنا الإلكتروني أو من خلال تطبيقات الهاتف المحمول ( أندرويد، IOS)'
          : 'We offer a great collection of contemporary ideas in decoration through our website or the mobile app (Android/IOS)',
        isArabic
          ? 'تجد عبر المنصة مجموعة كبيرة من المختصين المتميزين في عالم الديكور والأثاث لمساعدتك دومًا'
          : 'You will find a large group of distinguished professionals ready to help you in the decoration and furniture field',
        isArabic
          ? 'نوفر لك باستمرار مجموعة كبيرة من المقالات والمواضيع عن كل ما هو جديد في عالم التصميم والديكور'
          : 'We constantly provide a great collection of articles and topics about up-to-date information and ideas in the world of design and decoration',
        isArabic
          ? 'نسعى في منزِلك أن نكون المنصة الأولى عالميًا في مجال عالم الديكور والتصميم الداخلي'
          : 'We aim to be the first platform internationally in the field of decoration and internal design',
      ],
    },
  };
};
