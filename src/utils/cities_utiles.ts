const allCities = [
  {
    id: '0a2e696b-0c3a-48d6-918a-a3fe835af2ac',
    name: 'الرياض',
  },
  {
    id: '5f299f07-42e4-4c2b-b381-6a93b878d6db',
    name: 'تبوك',
  },
  {
    id: 'c4664f6b-26ee-47a0-b400-60a3db93f9da',
    name: 'جدة',
  },
  {
    id: 'dda2ed41-b70a-4299-b94c-e132297c478f',
    name: 'الدمام',
  },
  {
    id: '32498eef-ebe1-4a1d-8e55-1f05e61cb997',
    name: 'أبها',
  },
  {
    id: '28f75619-8ab2-4b75-a660-40bc2555a036',
    name: 'ابو عريش',
  },
  {
    id: '453a6813-177b-4479-9035-da036b2f20ec',
    name: 'احد المسارحة',
  },
  {
    id: '1d5616be-f09e-44cc-9c45-c74f82acd697',
    name: 'احد رفيده',
  },
  {
    id: '30ea4f45-a21d-45a3-ac3a-a6aeb084278e',
    name: 'الأضارع',
  },
  {
    id: '5cb9cfe7-bddb-4f9e-8618-12cf9a383d1d',
    name: 'الارطاوية',
  },
  {
    id: '2f1d6a0a-5196-48b2-ba8c-39e8f6b675a3',
    name: 'الاسياح',
  },
  {
    id: 'd0adb01a-de1b-4c6f-8677-b239d7d76808',
    name: 'الباحة',
  },
  {
    id: '41dcf9f9-5847-4212-81c5-5bbb630a9dca',
    name: 'البجادية',
  },
  {
    id: '551e2918-7497-4858-8bf6-d0f9e4cdd0e2',
    name: 'البدائع',
  },
  {
    id: '13a01455-ac09-4bc7-9810-134b3d35a556',
    name: 'البكيرية',
  },
  {
    id: 'afa44b72-7a75-4b96-a4b1-e79f1a775eba',
    name: 'الجبيل',
  },
  {
    id: 'ede703ed-5a2d-43df-9cd6-c297e9b6f6ab',
    name: 'الجش',
  },
  {
    id: 'e6db5032-f754-4088-934b-4f5aeda00a47',
    name: 'الجفر',
  },
  {
    id: '812762d5-c28a-4504-83f2-5959059963ef',
    name: 'الجموم',
  },
  {
    id: 'aa801231-08b3-43b2-a88a-5b075c4fd1e0',
    name: 'الحرجة',
  },
  {
    id: '357f9716-d402-4f64-8200-3e3c8251ec8f',
    name: 'الحريق',
  },
  {
    id: 'aa6af6f7-32b9-4a51-b3d5-380c327c558e',
    name: 'الحصاة',
  },
  {
    id: '0e606361-ac2e-4e96-b7b4-f361b231d147',
    name: 'الحلوة',
  },
  {
    id: '9fabe958-70e6-4225-b1e7-4e53381926f4',
    name: 'الحناكية',
  },
  {
    id: '8a835b10-3b88-4737-aed1-9267c255d7ed',
    name: 'الخُبَر',
  },
  {
    id: 'ff3062e4-cda3-41e2-b881-f69f89d1bd19',
    name: 'الخبراء',
  },
  {
    id: '39aaebc9-ba31-4b35-8418-d9ab54173c9e',
    name: 'الخرج',
  },
  {
    id: '02747963-c831-4f34-adf5-6aae274670bb',
    name: 'الخرج',
  },
  {
    id: 'cffc401a-673d-4366-8130-f781ee6671f5',
    name: 'الخرمة',
  },
  {
    id: 'd7b0f7e8-7b7b-4de6-86cf-af6109160d7f',
    name: 'الخفجي',
  },
  {
    id: '6e42348f-56a0-4a7a-a2d7-b6f769579102',
    name: 'الدرعية',
  },
  {
    id: 'dc4e7e0f-d790-4e55-8e18-e7c9586f9d68',
    name: 'الدلم',
  },
  {
    id: '79eca04d-d098-4b9c-8972-3baceed11168',
    name: 'الدوادمي',
  },
  {
    id: '67dce493-53f2-43ef-b7fd-3d1a2376b32b',
    name: 'الرس',
  },
  {
    id: 'ef7b9228-03fa-4d0d-9b3b-d0e24e35a43c',
    name: 'الرويضة',
  },
  {
    id: '5cd86829-b1b2-41b0-b101-8a30f0a0e688',
    name: 'الرين',
  },
  {
    id: 'd72e0aee-3ea2-4336-8885-c6bf2f9657c4',
    name: 'الزلفي',
  },
  {
    id: '7d15880a-5383-40b4-b540-f999df8024de',
    name: 'السليل',
  },
  {
    id: '70f87371-18ac-43a3-9f01-4b9caba4c5fb',
    name: 'السودة',
  },
  {
    id: 'e971adfe-3e4f-439a-bf11-cc140819ee35',
    name: 'الشماسية',
  },
  {
    id: '59842c26-a458-4591-988b-f835aa988d12',
    name: 'الشملي',
  },
  {
    id: '060cc4b2-6008-4f1e-98f5-a787cf8b05d7',
    name: 'الشملي',
  },
  {
    id: '411065fd-9a94-4ced-a476-8c2f951cdf99',
    name: 'الشنان',
  },
  {
    id: '8f14a24c-55a5-4579-8d09-9d0cdd87ce35',
    name: 'الطائف',
  },
  {
    id: 'c1e16658-d120-443f-b77e-9df2ad827417',
    name: 'الظهران',
  },
  {
    id: '737b70a0-3c8c-4426-af2c-f4c84f22c7fe',
    name: 'العارضة',
  },
  {
    id: '0ab0bdfe-103e-4b51-a994-04827260fea7',
    name: 'العقيق',
  },
  {
    id: 'c09bf6b6-5a68-4c4e-acf6-c5b298e7aa2c',
    name: 'العلا',
  },
  {
    id: '01761836-b53c-4124-b625-f89f184761dc',
    name: 'العمران',
  },
  {
    id: '93658e23-5611-407b-8414-273db1aa5346',
    name: 'العويقلية',
  },
  {
    id: 'f8c1ec75-e640-42e9-9871-48d456c200c7',
    name: 'العيساوية',
  },
  {
    id: 'd8c8bcf8-28da-4537-a549-bb2c32090021',
    name: 'العيون',
  },
  {
    id: '08687ead-4565-4945-87fb-1a17d012f0bc',
    name: 'العيينة',
  },
  {
    id: '97d25f9e-5f89-4b1d-a4ca-5d05203ac3a1',
    name: 'الغاط',
  },
  {
    id: 'cf013bb5-225c-4cf6-839f-b829a78ab835',
    name: 'القريات',
  },
  {
    id: '67891d1b-9fcf-4d44-b741-80e7654f1be7',
    name: 'القصب',
  },
  {
    id: '40647148-1eac-4e7d-b31a-1a724e17222c',
    name: 'القطيف',
  },
  {
    id: '320f8476-ba14-4c8d-97f0-b18f1d34eb50',
    name: 'القنفذة',
  },
  {
    id: '8303fa3d-339b-4cad-b190-eccff48cb0e8',
    name: 'القوز',
  },
  {
    id: '40ae12b4-3502-4d26-83c5-459007922336',
    name: 'القويعية',
  },
  {
    id: 'a68b3b77-b74f-4cc0-80fa-26548b8b2d6d',
    name: 'القيصومة',
  },
  {
    id: '1b2a3c70-1c4b-483f-a965-7479707273dd',
    name: 'الليث',
  },
  {
    id: '05c67b9d-24cc-44dd-b8fb-807b4ebebc1c',
    name: 'المبرز',
  },
  {
    id: 'd604782e-f6b5-4c85-8586-d295fca48364',
    name: 'المجاردة',
  },
  {
    id: 'df529fff-465e-4b07-8a5e-331b797b690b',
    name: 'المجمعة',
  },
  {
    id: '64fbbf2b-82a0-439e-97ab-213add2d4def',
    name: 'المدينة المنورة',
  },
  {
    id: 'b98d759c-e54b-4ee8-9153-bb6a93390975',
    name: 'المذنب',
  },
  {
    id: '1486c1ef-5173-4e3d-884b-6059b98ab7bf',
    name: 'المرموثة',
  },
  {
    id: '045cc8d6-2984-4b14-bb79-63c32b0b3f03',
    name: 'المزاحمية',
  },
  {
    id: '1cc4edab-c840-4082-8e60-565ae656600a',
    name: 'النبهانية',
  },
  {
    id: 'b7b709ee-3951-42c4-9f0f-7e5faa3aac24',
    name: 'النعيرية',
  },
  {
    id: 'c0c8810b-8181-44be-a8f2-d6784883340f',
    name: 'النماص',
  },
  {
    id: 'dac2e917-45ce-44de-b25a-60213f5807ba',
    name: 'الهفوف',
  },
  {
    id: '2e3898a5-0c48-443a-9416-a7743481b699',
    name: 'الهلالية',
  },
  {
    id: '6abb5e51-5b16-4a7e-ac4a-a7a76ea48104',
    name: 'الوجه',
  },
  {
    id: '286626bf-b597-4a52-95b7-010dfea8ae58',
    name: 'ام الحمام',
  },
  {
    id: '8d392e32-b285-406f-b9fa-ed18ddbb4fc8',
    name: 'املج',
  },
  {
    id: '10adcdc5-30ec-4d9a-948d-5b2c393b8b86',
    name: 'بدر',
  },
  {
    id: 'cf5a242d-0827-4210-9829-b3296a763a93',
    name: 'بريدة',
  },
  {
    id: 'a18e7e54-3cda-467d-8808-f106d9c33c76',
    name: 'بقعاء',
  },
  {
    id: 'f2a4a996-5445-465a-b9bb-0a5b76858d96',
    name: 'بقيق',
  },
  {
    id: 'e21c704a-160f-4906-bb78-d92f9e2e0b35',
    name: 'بلجرشي',
  },
  {
    id: '001f187d-8447-4350-a2b2-36091a23ed70',
    name: 'بللحمر',
  },
  {
    id: 'e7c3a4dd-2109-44ad-9e3a-d55f0cd373aa',
    name: 'بللسمر',
  },
  {
    id: '323d70a8-79d6-42ce-8443-1f2d65e69c56',
    name: 'بيشة',
  },
  {
    id: '500eaeb0-d731-4b82-84df-c5201a770274',
    name: 'تاروت',
  },
  {
    id: 'df0a6606-7f92-4bec-9ef1-67331859cd5d',
    name: 'تثليث',
  },
  {
    id: 'a1bb1dbb-8d57-4dc2-af79-634a73b9f842',
    name: 'تربه',
  },
  {
    id: '93b8ec66-26d9-4b64-acc5-d86029111389',
    name: 'تمير',
  },
  {
    id: 'a42a2c7b-6819-4c1b-95b2-7f783f671697',
    name: 'تندحة',
  },
  {
    id: '59b77290-d8d0-438e-bf3e-37d3421592a6',
    name: 'تنومة',
  },
  {
    id: 'a6f7c52d-ded8-4c24-a474-2bc570aa2cd8',
    name: 'تيماء',
  },
  {
    id: '7ea3e3ad-a278-4ef1-a21f-fb5de71141c3',
    name: 'ثادق',
  },
  {
    id: 'e3cb7749-b340-4b70-9b2a-ce200440603f',
    name: 'ثول',
  },
  {
    id: 'de3886ab-b5c9-43ad-9f87-f1e17b855d45',
    name: 'جازان',
  },
  {
    id: '972a78e3-b0e0-4248-8250-dbe1d6e8fee8',
    name: 'جلاجل',
  },
  {
    id: '16d0efe3-7f31-4bfc-b1df-f1ea0d992e9e',
    name: 'جواثا',
  },
  {
    id: 'cdb1ec6d-4b5d-4584-8a68-197476bb27fc',
    name: 'حائل',
  },
  {
    id: 'f70fe1ff-0e99-4a73-8a70-3f008f41ce28',
    name: 'حبونا',
  },
  {
    id: 'cefd87f1-51d9-4085-839d-cac1b9e9fae3',
    name: 'حرمة',
  },
  {
    id: '28350b27-e065-4f3a-b929-7e9e9acb7f5c',
    name: 'حريملاء',
  },
  {
    id: 'b69be4be-1b7c-43c1-ab93-8b5d35dc7438',
    name: 'حفر الباطن',
  },
  {
    id: 'af5b55b7-ae21-4ec6-97b8-49bc2c19204f',
    name: 'حقل',
  },
  {
    id: '85d3416f-413a-44cf-919f-b74bd01f2162',
    name: 'حوطة بني تميم',
  },
  {
    id: '00af9520-ab42-4867-a7cd-894e2164fc00',
    name: 'حوطة سدير',
  },
  {
    id: 'a0afd655-2352-4a3f-b094-8d92c6b7b63f',
    name: 'حوطة سدير',
  },
  {
    id: 'ff19b586-4f67-4d45-bb50-b3da2452da1e',
    name: 'خليص',
  },
  {
    id: '67bf9050-15e3-4c1a-a56f-8291747934d6',
    name: 'خميس مشيط',
  },
  {
    id: '03bb85b5-a4a5-4c70-a904-fea1fbcdd9f9',
    name: 'خيبر',
  },
  {
    id: 'd600258f-8de9-402a-99b7-1735768b99dd',
    name: 'خيبر',
  },
  {
    id: '6a4bcf20-4610-4172-9741-ccc72bcc3761',
    name: 'دارين',
  },
  {
    id: '90f096d9-5055-453a-8b42-59e4f6ed14bb',
    name: 'دومة الجندل',
  },
  {
    id: '27a89d99-72bf-4d28-82e1-63628f6aa19a',
    name: 'رابغ',
  },
  {
    id: '016b2ad3-b470-41c5-bce9-15bd265f85a1',
    name: 'رابغ',
  },
  {
    id: '0b50e5cd-2725-41c0-91c3-f65b3c0bbd88',
    name: 'راس تنورة',
  },
  {
    id: '860e5ae4-8f87-4be0-aabc-6d216cb884b6',
    name: 'رفحاء',
  },
  {
    id: '0e66ea51-ada5-4935-b89d-49f2cecc14dc',
    name: 'رنية',
  },
  {
    id: 'fa484e08-13be-4507-a000-1ab7381aa863',
    name: 'رياض الخبراء',
  },
  {
    id: 'f5e0560e-45ef-4047-bd68-a432d6aa9228',
    name: 'سبت العلاية',
  },
  {
    id: '1dea3c15-4b5b-4044-be44-69778654bfc8',
    name: 'سراة عبيدة',
  },
  {
    id: 'e3ec31da-c0f1-4851-8961-370dadf7b06e',
    name: 'سكاكا',
  },
  {
    id: 'da2c92f6-a7e7-4793-93d6-53e008b1350f',
    name: 'سيهات',
  },
  {
    id: '1b07e1b0-747a-4ead-a94f-cf7f79204124',
    name: 'شرورة',
  },
  {
    id: '3ad5f565-9bfa-45d6-b6ae-b67c3ba3d8cd',
    name: 'شقراء',
  },
  {
    id: 'd38c689d-ce61-4679-837b-8bd4a6658234',
    name: 'صامطة',
  },
  {
    id: 'b719f0b2-3b04-4506-9a9e-a8912986140c',
    name: 'صبيا',
  },
  {
    id: 'b3e2a0c5-b3c8-40d5-9444-e49786257d74',
    name: 'صفوى',
  },
  {
    id: '845d2e54-e9e4-4db1-a089-3c5ae2d7750d',
    name: 'صوير',
  },
  {
    id: 'd34bb452-7f45-4892-8ead-3656882e0318',
    name: 'ضبا',
  },
  {
    id: '7de79151-ee36-4a66-87cf-1578d7b5bf0e',
    name: 'ضرما',
  },
  {
    id: '27f32e7f-62f1-4d5c-aa8a-e11ebea1664d',
    name: 'ضرية',
  },
  {
    id: 'a198c016-3d8f-494f-9459-c35ad6fc33b2',
    name: 'طبب',
  },
  {
    id: '9668054b-112f-4b45-a50d-a34cddf2eb58',
    name: 'طبرجل',
  },
  {
    id: 'f1356c42-3a87-4bef-a6ea-6944bca25f8c',
    name: 'طريب',
  },
  {
    id: '84aba809-9348-43a2-93de-787f78b92e4b',
    name: 'طريف',
  },
  {
    id: 'aa05009b-6021-42b0-8ad4-6bd274791893',
    name: 'ظهران الجنوب',
  },
  {
    id: '301a4736-556b-4831-af35-d91e73922366',
    name: 'عرعر',
  },
  {
    id: '64e67a95-5809-4077-ba28-2f8dd4cf6d9c',
    name: 'عفيف',
  },
  {
    id: 'dafaac24-d168-4353-ad9e-cd7b2144b8d7',
    name: 'عقلة الصقور',
  },
  {
    id: '8e07b99d-a1d1-4383-a45b-9b4427bab0d0',
    name: 'عنك',
  },
  {
    id: 'e14bd463-4d07-4b8e-aeae-8c703d640c47',
    name: 'عنيزة',
  },
  {
    id: 'bf930ae0-45c8-4ac6-ba63-a9afe8b61ed8',
    name: 'عيون الجواء',
  },
  {
    id: '45197c66-aa5b-4adc-86f0-73388b3e1104',
    name: 'قبة',
  },
  {
    id: 'aa45d4b8-f18d-402d-9d3b-d33f5a424d83',
    name: 'قرية العليا',
  },
  {
    id: '146dbedb-b663-4139-8968-ce2489081bd7',
    name: 'ليلى',
  },
  {
    id: '08342e9f-7788-4281-be6c-c1bd90a7ab8f',
    name: 'محايل',
  },
  {
    id: 'fb32f714-1ed9-4bdf-93fb-b522ae124a90',
    name: 'محايل',
  },
  {
    id: 'a4b0a5b8-3977-43f8-b32e-9fe1ebd71c82',
    name: 'مدينة الملك عبدالله الاقتصادية',
  },
  {
    id: 'f2a18601-23d4-4a68-a7e3-9669a4e2e0f2',
    name: 'مكة المكرمة',
  },
  {
    id: '06b8e086-83c0-4055-b948-8474c5af51a9',
    name: 'مهد الذهب',
  },
  {
    id: '9f1373b1-471d-45e1-9fab-cfc13ca8351a',
    name: 'نجران',
  },
  {
    id: 'b9a6f6c8-5687-4e9d-92a2-1c082a5767a5',
    name: 'نفي',
  },
  {
    id: 'a43f6058-793a-4af6-add4-059a300bf8c8',
    name: 'وادي الدواسر',
  },
  {
    id: '25c7bdce-cf01-464c-8a6b-bded32f5e0f1',
    name: 'يبرين',
  },
  {
    id: '0b36f673-e04f-4bd1-8b81-b58d2f63fd29',
    name: 'يدمة',
  },
  {
    id: '3a420f12-4753-421a-846e-45868f349798',
    name: 'ينبع',
  },
  {
    id: 'f349c2a5-9a45-48ec-9fd7-8441cb26e164',
    name: 'ينبع الصناعية',
  },
];

export const getCityNameById = (id: string) => {
  const city = allCities.find((city) => city.id === id);
  if (city) {
    return city.name;
  }
  return '';
};
