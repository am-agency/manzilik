import { AR } from '../../../locales/constants';
import { PrivacyPolicy } from '../types';

export const PrivacyMock = (lang: string): PrivacyPolicy => {
  const isArabic = lang === AR;
  return {
    title: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy',
    sub_title: isArabic
      ? '  توضح سياسة الخصوصية هذه طريقة استخدام وحماية منصة منزلِك لأي معلومات تقدمها للمنصة عند استخدامك لها.  '
      : 'This privacy policy sets out how Manzilik uses and protects any information that you give Manzilik when you use this website.',
    description: isArabic
      ? ' تلتزم منصة منزلِك بضمان حماية خصوصيتك. في حال قامت المنصة بطلب بيانات معينة لإثبات هويتك، فإننا نتعهد أن يتم استخدام تلك البيانات وفقًا لسياسة الخصوصية هذه.   يمكن للمنصة أن تقوم بتغيير هذه السياسة من وقت لآخر عن طريق تحديث هذه الصفحة. ولهذا السبب يجب عليك التحقق من هذه الصفحة من وقت لآخر للتأكد من أنك راضٍ عن التغييرات. تعتبر هذه السياسة سارية المفعول بدءًا من تاريخ 01/10/2021. '
      : 'Manzilik is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement Manzilik may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from 01/10/2021.',
    list_title: isArabic ? 'قد نقوم بطلب أحد المعلومات التالية:' : ' We may collect the following information:',
    hint_question: isArabic ? 'ما المعلومات التي قد نقوم بطلبها؟' : ' What we collect?',
    list: isArabic
      ? [
          'الاسم والمسمى الوظيفي',
          'معلومات التواصل بما في ذلك عنوان البريد الإلكتروني',
          'المعلومات الديموغرافية مثل الرمز البريدي والتفضيلات والاهتمامات',
          ' أي معلومات أخرى ذات علاقة باستبيانات العملاء أو العروض',
          'ماذا نفعل بالمعلومات التي نقوم بجمعها؟',
        ]
      : [
          'name and job title',
          'contact information including email address',
          'demographic information such as postcode, preferences and interests',
          'other information relevant to customer surveys and/or offers',
          'What we do with the information we gather?',
        ],
    sub_list_title: isArabic
      ? 'نقوم بطلب هذه المعلومات بشكل أساسي لفهم احتياجاتك وتزويدك بخدمة أفضل، وعلى وجه الخصوص للأسباب التالية:'
      : 'We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:',
    sub_list: isArabic
      ? [
          'حفظ السجلات الداخلية',
          'تطوير المنتجات والخدمات',
          'إرسال رسائل بريد إلكتروني ترويجية بشكل دوري إلى عنوان البريد الإلكتروني - الذي قمت بتزويدنا به - حول أي منتجات جديدة أو عروض خاصة أو أي معلومات أخرى نرى أنها قد تثير اهتمامك',
          'استخدام معلوماتك من وقت لآخر للتواصل معك لأغراض البحث السوقي. من الممكن أن نتواصل معك إما عبر البريد الإلكتروني، أو الهاتف أو الفاكس أو البريد العادي',
          'من الممكن أيضًا أن نستخدم معلوماتك لتخصيص الموقع بما يتلاءم مع اهتماماتك',
        ]
      : [
          'Internal record keeping',
          'We may use the information to improve our products and services',
          'We may periodically send promotional emails about new products, special  offers   or   other   information   which   we   think   you   may   find interesting using the email address which you have provided',
          'From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail',
          ' We   may   use   the   information   to   customise   the   website according to your interests',
        ],
    security_title: isArabic ? 'الأمان' : 'Security',
    security_description: isArabic
      ? 'نحن ملتزمون بضمان أمان معلوماتك. نضع إجراءات مادية وإلكترونية وإدارية مناسِبة لحماية وتأمين المعلومات التي نجمعها عبر الإنترنت،  من أجل منع الوصول أو الكشف غير المصرح به لتلك المعلومات'
      : 'We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online',

    how_to_use_title: isArabic ? 'كيف نستخدم ملفات تعريف الارتباط' : 'How we use cookies',
    how_to_use_description: isArabic
      ? 'ملف تعريف الارتباط هو ملف صغير يطلب الإذن لوضعه على القرص الصلب لجهاز الكمبيوتر الخاص بك. بمجرد موافقتك، يسمح المتصفح للموقع بيتم بإضافة الملف، حيث ويساعد ملف تعريف الارتباط في جمع معلومات حول زيارتك لموقع معين، وكذلك وقت كل زيارة تقوم بها لهذا الموقع، وما هي صفحات الموقع التي تصفحتها. تحليل زيارة الويب أو يتيح لك معرفة وقت زيارة موقع معين. تسمح ملفات تعريف الارتباط لتطبيقات الويب بالرد عليك كفرد. كما يمكن لموقع تطبيق الويب أن يخصّص يعدّل عملياته وفقًا لاحتياجاتك وما يعجبك وما لا يعجبك من خلال جمع وتذكر المعلومات حول تفضيلاتك.  نستخدم ملفات تعريف الارتباط الخاصة بسجل الزيارات لتحديد الصفحات التي تكثر زيارتها ويتم استخدامها. يساعدنا هذا في تحليل البيانات المتعلقة بزيارات صفحات الويب وتحسين موقعنا على الويب من أجل تخصيصه تعديله وفقًا لاحتياجات العملاء. مع العلم بأننا نستخدم نقوم باستخدام هذه المعلومات لأغراض التحليل الإحصائي فقط ومن ثم يتم إزالة البيانات من النظام بشكل عام، تساعدنا ملفات تعريف الارتباط على تزويدك بأفضل ما لدينا في الموقع ويب أفضل من خلال تمكيننا من مراقبة الصفحات التي تجدها مفيدة والتي لا تجدها مفيدة. لا يمنحنا ملف تعريف الارتباط بأي حال من الأحوال الوصول إلى جهاز الكمبيوتر الخاص بك أو أي معلومات عنك بخلاف البيانات التي تختار مشاركتها معنا .وبالطبع، يمكنك اختيار إمّا قبول أو رفض ملفات تعريف الارتباط. تقبل معظم متصفحات الويب ملفات تعريف الارتباط تلقائيًا، ولكن يمكنك عادةً تعديل إعداد المستعرض الخاص بك ليقوم برفض ملفات تعريف الارتباط في حال كنت تفضل ذلك. على أي حال، قد يمنعك هذا من الاستفادة الكاملة من الموقع.'
      : 'A   cookie   is   a   small   file   which   asks   permission   to   be   placed   on   your computer`s hard drive. Once you agree, the file is added and the cookie helps analyse web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences. We use traffic log cookies to identify which pages are being used. This helps us analyse data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system. Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us. You   can   choose   to   accept   or   decline   cookies.   Most   web   browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.',
    links_title: isArabic ? 'روابط لمواقع أخرى' : 'Links to other websites',
    links_description: isArabic
      ? 'قد يحتوي موقعنا الإلكتروني على روابط لمواقع أخرى ذات أهمية. ومع ذلك، بمجرد استخدامك لهذه الروابط لمغادرة موقعنا، يجب أن تُدرك أنه ليس لدينا أي سيطرة على الموقع الآخر. لذلك، لسنا مسؤولين عن حماية وخصوصية أي معلومات تقدمها أثناء زيارتك لتلك المواقع وهي بالتالي لا تخضع لسياسة الخصوصية الخاصة بموقعنا. يجب عليك توخي الحذر وإلقاء نظرة على سياسة الخصوصية المطبقة على موقع الويب المعني.'
      : ' Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have   any   control   over   that   other   website.   Therefore,   we   cannot   be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.',

    personal_info_title: isArabic ? 'التحكم في معلوماتك الشخصية' : 'Controlling your personal information',
    personal_info_sub_title: isArabic
      ? '  يمكنك اختيار تقييد جمع أو استخدام معلوماتك الشخصية بالطرق التالية:'
      : 'You may choose to restrict the collection or use of your personal information in the following ways:',
    personal_info_list: isArabic
      ? [
          'عندما يُطلب منك ملء نموذج على موقع الويب، ابحث عن المربع الذي يمكنك النقر فوقه للإشارة إلى أنك لا تريد استخدام المعلومات من قبل أي شخص لأغراض التسويق المباشر',
          'إذا كنت قد وافقت مسبقًا على استخدام معلوماتك الشخصية لأغراض التسويق المباشر، فيمكنك تغيير رأيك في أي وقت عن طريق الكتابة إلينا أو مراسلتنا عبر البريد الإلكتروني على info@weart.io',
        ]
      : [
          'Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes',
          ' If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at info@weart.io ',
        ],
    personal_info_description: isArabic
      ? ' لن نبيع أو نوزع أو نؤجر معلوماتك الشخصية لأطراف ثالثة ما لم نحصل على إذن منك أو يطلب منا القانون القيام بذلك. قد نستخدم معلوماتك الشخصية لنرسل لك معلومات ترويجية عن أطراف ثالثة نعتقد أنك قد تجدها مثيرة للاهتمام إذا أخبرتنا أنك ترغب في حدوث ذلك'
      : ' We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.',
    personal_info_sub_description: isArabic
      ? '  يمكنك طلب تفاصيل المعلومات الشخصية التي نحتفظ بها عنك بموجب قانون حماية البيانات لعام 1998. سيتوجب عليك حينها دفع رسوم رمزية. إذا كنت ترغب في الحصول على نسخة من المعلومات المحفوظة عنك يرجى مراستنا على info@weart.io    إذا كنت تعتقد أن أي معلومات نحتفظ بها عنك غير صحيحة أو غير كاملة، يرجى الكتابة إلينا أو مراسلتنا عبر البريد الإلكتروني في أقرب وقت ممكن على العنوان المذكور أعلاه. سنقوم على الفور بتصحيح أي معلومات تبين أنها غير صحيحة.   '
      : ' You may request details of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable. If you would like a copy of the information held on you please write to info@weart.io. If you believe that any information, we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.',
    concat_title: isArabic ? ' اتصل بنا' : 'Contacting Us',
    contact_description: isArabic
      ? '  إذا كانت هناك أي أسئلة بخصوص سياسة الخصوصية هذه، يمكنك الاتصال بنا باستخدام المعلومات أدناه'
      : '  If there are any questions regarding this privacy policy you may contact us using the information below:',
    email: 'info@weart.io',
    address: isArabic ? 'الخبر -السعودية' : 'AL Khobar -Saudi Arabia',
    phone: '+966 59 377 7489',
  };
};
