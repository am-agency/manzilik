import { AR } from '../../../locales/constants';
import { TermsAndConditions } from '../types';

export const TermsAndConditionsMock = (lang: string): TermsAndConditions => {
  const isArabic = AR == lang;
  return {
    title: isArabic ? ' الشروط والأحكام' : 'Terms & Conditions',
    description: isArabic
      ? 'أهلًا بكَ في موقعنا. إذا واصلت تصفح واستخدام هذا الموقع فإنك توافق على الامتثال والالتزام بشروط وأحكام الاستخدام التالية. تحكم شروط وأحكام الاستخدام هذه جنبًا إلى جنب مع سياسة خصوصيتنا علاقة منزلِك معك فيما يتعلق باستخدامك لهذا الموقع.'
      : ' Welcome to our website. If you continue to browse and use this website you are agreeing to comply with and be  bound by the following terms and conditions of use, which together with our privacy policy govern Manzilik `s relationship with you in relation to this website. The term Manzilik or `us` or `we` refers to the owner of this website whose registered office is Al Ryad. The term `you` refers to the user or viewer of our website.',
    sub_description: isArabic
      ? '  يشير المصطلح `منزلِك` أو`نحن` إلى مالك موقع الويب الذي يقع مكتبه المسجل في الرياض.'
      : 'The term `you` refers to the user or viewer of our website.',
    list_title: isArabic
      ? 'يخضع استخدام هذا الموقع لشروط الاستخدام التالية:'
      : 'The use of this website is subject to the following terms of use:',
    list: isArabic
      ? [
          'يعتبر محتوى صفحات هذا الموقع لمعلوماتك العامة والاستخدام فقط. وهو خاضع للتغيير دون إشعار.',
          'لا نقدم نحن ولا أي طرف ثالث أي ضمان فيما يتعلق بدقة أو حسن توقيت أو أداء أو اكتمال أو ملاءمة المعلومات والمواد الموجودة أو المعروضة على هذا الموقع لأي غرض معين. أنت تقر بأن هذه المعلومات والمواد قد تحتوي على معلومات  غير دقيقة أو أخطاء، ونحن بذلك لا نتحمل المسؤولية عن وجود عدم دقة أو أخطاء من هذا القبيل إلى أقصى حد يسمح به   القانون.',
          ' إن استخدامك لأية معلومات أو مواد على هذا الموقع يكون على مسؤوليتك الخاصة بالكامل ولن نتحمل المسؤولية تجاهه.  تقع على عاتقك مسؤولية التأكد من أن أي منتجات أو معلومات متوفرة من خلال هذا الموقع تلبي متطلباتك المحددة.',
          'يحتوي هذا الموقع على مواد مملوكة أو مرخصة لنا. تشمل هذه المواد- على سبيل المثال لا الحصر- على التصميم والتخطيط والشكل والمظهر والرسومات. يُمنع الاستنساخ بخلاف ما يتوافق مع إشعار حقوق النشر والذي يشكل جزءًا من هذه الشروط والأحكام.',
          'جميع العلامات التجارية المستنسخة في هذا الموقع والتي لا يمتلكها المشغل- ولا يمتلك ترخيصًا لها- مُعترف بها  على موقع الويب.',
          'قد يؤدي الاستخدام غير المصرح به لهذا الموقع إلى مطالبة بالتعويض عن الأضرار و / أو يعتبر جريمة جنائية.',
          'قد يتضمن هذا الموقع من وقت لآخر روابط لمواقع أخرى. يتم توفير هذه الروابط من أجل مصلحتك وذلك لتقديم مزيد من  المعلومات لك. لا يعني هذا أننا نؤيد تلك المواقع ولا نتحمل أي مسؤولية عن محتوى الموقع (المواقع) الموجودة.',
          'لا يجوز لك إنشاء ارتباط إلى موقع الويب هذا من موقع ويب آخر أو مستند آخر بدون موافقة خطية مسبقة من منزلِك.',
          'يخضع استخدامك لهذا الموقع وأي نزاع ينشأ عن هذا الاستخدام للموقع لقوانين المملكة العربية السعودية أو أي سلطة  تنظيمية أخرى.',
        ]
      : [
          'The content of the pages of this website is for your general information and use only. It is subject to change without notice.',
          'Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.',
          'Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products or information available through this website meet your specific requirements.',
          'This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.',
          'All trademarks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.',
          'Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offence.',
          ' From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).',
          'You may not create a link to this website from another website or document without Manzilik`s prior written consent.',
          ' Your use of this website and any dispute arising out of such use of the website is subject to the laws of SA or other regulatory authority.',
        ],
    concat_title: isArabic ? ' اتصل بنا' : 'Contacting Us',
    contact_description: isArabic
      ? '  إذا كانت هناك أي أسئلة بخصوص تلك الشروط والأحكام، يمكنك الاتصال بنا باستخدام المعلومات أدناه'
      : '  If there are any questions regarding this privacy policy you may contact us using the information below:',
    email: 'info@weart.io',
    address: isArabic ? 'الخبر -السعودية' : 'AL Khobar -Saudi Arabia',
    phone: '+966 59 377 7489',
  };
};
