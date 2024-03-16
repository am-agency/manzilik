import { Magazine, Professional } from '../../../API';
import { TV } from '../../../components/idea/types';

export const tvMock: TV = {
  id: '017133f1-98ab-4d2c-9850-cd3355038627',
  video_url: 'https://www.youtube.com/watch?v=LG22bXCcgYk',
  photo:
    'https://makhzan-dev.manzilik.com/media/tv/%D9%85%D8%A7%D8%B0%D8%A7-%D8%AA%D8%B9%D8%B1%D9%81-%D8%B9%D9%86-%D8%A7%D9%84%D8%AE%D8%B7-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A.jpg',
  likes_count: 3,
  is_liked: false,
  comments_count: 5,
  title: 'دهانات رائعة جدا بطرق احترافية',
  meta_description: 'دهانات رائعة جدا بطرق احترافية',
  categories: [
    {
      __typename: 'Category',
      id: '114d7735-5816-4194-b4c0-8b1af424508f',
      title: 'غرفة طعام',
      english_title: 'Dining Room',
      description: '',
      parent: {
        __typename: 'Category',
        id: 'acf6d818-8b9b-4e4a-afe2-91aa008b48a7',
        title: 'غرفة الطعام',
        english_title: 'Dining',
        description: '',
        photo: 'https://makhzan-dev.manzilik.com/media/Category/Kitchen__Dining.jpg',
        status: null,
        created_at: null,
        updated_at: null,
        filters: null,
      },
      photo: 'https://makhzan-dev.manzilik.com/media/Category/Dining_Room.jpg',
      status: null,
      created_at: null,
      updated_at: null,
      filters: null,
    },
  ],
  created_at: '2021-08-05T11:52:05.809630Z',
  // video_length: '00:13:35',
  client: {
    __typename: 'Client',
    id: 'f9be5caf-52b0-487c-9588-76ee7ca223b0',
    created_at: null,
    updated_at: null,
    status: 'IS_ACTIVE',
    first_name: 'سوريانا',
    last_name: 'عنتر الملوّاني',
    email: 'db.vdgd412@gmail.com',
    mobile: null,
    gender: null,
    type: null,
    about_me: 'مهندسة حلويات',
    my_fav_style: 'تشيز كيك',
    my_next_style: 'كيكة عيد ميلادي',
    city_id: null,
    country_id: null,
    city: null,
    country: null,
    zip: null,
    state: null,
    following_count: null,
    followers_count: null,
    total_review: null,
    profile_image:
      'https://makhzan-dev.manzilik.com/uploads/f9be5caf-52b0-487c-9588-76ee7ca223b0_PROFILE_f9be5caf-52b0-487c-9588-76ee7ca223b0_0',
    facebook: null,
    twitter: null,
    linkedin: null,
    blog: null,
    project_role: null,
  },
};

export const ProfessionalMock = {
  data: '{"gallery_photos": ["https://makhzan-dev.manzilik.com/uploads/1971d387-79df-49d8-8317-fe839dcaf69c_GENERAL_ab849f8b-f28e-457d-8b1b-38cd974880b6_0"], "services": [{"arabic_title": "\\u0641\\u0646\\u064a \\u062a\\u0632\\u064a\\u064a\\u0646", "title": "\\u0641\\u0646\\u064a \\u062a\\u0632\\u064a\\u064a\\u0646", "english_title": "decorator"}, {"arabic_title": "\\u0645\\u0647\\u0646\\u064a", "title": "\\u0645\\u0647\\u0646\\u064a", "english_title": "professional"}], "categories": [{"arabic_title": "\\u0637\\u0627\\u0628\\u0642 \\u0633\\u062f\\u0629", "title": "\\u0637\\u0627\\u0628\\u0642 \\u0633\\u062f\\u0629", "english_title": "basement"}, {"arabic_title": "\\u0645\\u062e\\u0632\\u0646", "title": "\\u0645\\u062e\\u0632\\u0646", "english_title": "storage and closet"}], "client": {"id": "1971d387-79df-49d8-8317-fe839dcaf69c", "first_name": "Fname", "last_name": "lName", "email": "rkerenawi+i2@gmail.com", "mobile": "599123456", "about_me": "", "type": "PROFESSIONAL", "profile_image": null}, "locations": [{"arabic_name": "\\u0627\\u0644\\u0631\\u064a\\u0627\\u0636", "english_name": "riyadh", "id": "0a2e696b-0c3a-48d6-918a-a3fe835af2ac"}, {"arabic_name": "\\u0623\\u0628\\u0647\\u0627", "english_name": "abha", "id": "32498eef-ebe1-4a1d-8e55-1f05e61cb997"}], "id": "1971d387-79df-49d8-8317-fe839dcaf69c", "created_at": "2021-09-09T08:56:01.323809+00:00", "address": "address", "reviews_count": 15, "reviews_total": 3.9}',
};

export const MagazineMock: Magazine = {
  __typename: 'Magazine',
  id: '3a919831-aa79-4751-9298-25a688ca0045',
  page: '{"id": 114, "title": "\\u063a\\u0631\\u0641\\u0629 \\u0627\\u0644\\u0645\\u0639\\u064a\\u0634\\u0629", "placeholders": [{"id": 119, "slot": "content", "plugins": [{"id": 111, "placeholder": 119, "parent": null, "position": 0, "language": "en", "plugin_type": "TextPlugin", "creation_date": "2021-10-12T09:32:59.697730Z", "changed_date": "2021-10-12T09:39:01.663355Z", "plugin_data": {"id": 111, "path": "001X", "depth": 1, "numchild": 1, "position": 0, "language": "en", "plugin_type": "TextPlugin", "creation_date": "2021-10-12T09:32:59.697730Z", "changed_date": "2021-10-12T09:39:01.663355Z", "body": "<p>\\u062a\\u0631\\u0628\\u0637 \\u063a\\u0631\\u0641\\u0629 \\u0627\\u0644\\u0645\\u0639\\u064a\\u0634\\u0629 \\u0641\\u064a \\u0627\\u0644\\u0639\\u0627\\u062f\\u0629 \\u0628\\u064a\\u0646 \\u0643\\u0627\\u0641\\u0629 \\u063a\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0646\\u0632\\u0644 \\u0627\\u0644\\u0623\\u062e\\u0631\\u0649 \\u0648\\u0647\\u064a \\u0628\\u0630\\u0644\\u0643 \\u062a\\u0639\\u062a\\u0628\\u0631 \\u062d\\u062c\\u0631 \\u0627\\u0644\\u0623\\u0633\\u0627\\u0633 \\u0641\\u064a\\u00a0<b data-stringify-type=\\"bold\\"><i data-stringify-type=\\"italic\\">\\u0645\\u0646\\u0632\\u0644\\u0650\\u0643</i></b>.</p>\\n\\n<p>\\u0648\\u062d\\u062a\\u0649 \\u062a\\u0636\\u0645\\u0646 \\u0627\\u0644\\u0628\\u0642\\u0627\\u0621 \\u0641\\u064a \\u0627\\u0644\\u062c\\u0627\\u0646\\u0628 \\u0627\\u0644\\u0622\\u0645\\u0646\\u060c \\u064a\\u064f\\u0641\\u0636\\u0651\\u0644 \\u0627\\u062e\\u062a\\u064a\\u0627\\u0631 \\u0623\\u0644\\u0648\\u0627\\u0646 \\u062d\\u064a\\u0627\\u062f\\u064a\\u0629 \\u0633\\u0648\\u0627\\u0621 \\u0641\\u064a \\u0627\\u0644\\u062f\\u064a\\u0643\\u0648\\u0631 \\u0623\\u0648 \\u0627\\u0644\\u062f\\u0647\\u0627\\u0646 \\u062d\\u062a\\u0649 \\u062a\\u062a\\u0645\\u0627\\u0634\\u0649 \\u0645\\u0639 \\u0628\\u0627\\u0642\\u064a \\u0623\\u0644\\u0648\\u0627\\u0646 \\u0627\\u0644\\u063a\\u0631\\u0641 \\u0648\\u0627\\u0644\\u062f\\u064a\\u0643\\u0648\\u0631\\u0627\\u062a \\u0645\\u0647\\u0645\\u0627 \\u0643\\u0627\\u0646\\u062a. \\u0641\\u0644\\u0627 \\u064a\\u0645\\u0643\\u0646 \\u0644\\u0644\\u0634\\u062e\\u0635 \\u0623\\u0646 \\u064a\\u062e\\u0637\\u0626 \\u0623\\u0628\\u062f\\u064b\\u0627 \\u0628\\u0627\\u062e\\u062a\\u064a\\u0627\\u0631 \\u0623\\u0644\\u0648\\u0627\\u0646 \\u0645\\u062b\\u0644 \\u0627\\u0644\\u0623\\u0628\\u064a\\u0636\\u060c \\u0648\\u0627\\u0644\\u0623\\u0633\\u0648\\u062f \\u0648\\u0627\\u0644\\u0631\\u0645\\u0627\\u062f\\u064a.\\u064a\\u0639\\u0637\\u064a \\u0644\\u0643 \\u0627\\u062e\\u062a\\u064a\\u0627\\u0631 \\u0627\\u0644\\u0623\\u0644\\u0648\\u0627\\u0646 \\u0627\\u0644\\u062d\\u064a\\u0627\\u062f\\u064a\\u0629 \\u0623\\u064a\\u0636\\u064b\\u0627 \\u0625\\u062d\\u0633\\u0627\\u0633\\u064b\\u0627 \\u0628\\u0627\\u0644\\u0645\\u0633\\u0627\\u062d\\u0629 \\u0627\\u0644\\u0625\\u0636\\u0627\\u0641\\u064a\\u0629 \\u0633\\u0648\\u0627\\u0621\\u064b\\u0627 \\u0641\\u064a \\u062d\\u0627\\u0644 \\u062a\\u0648\\u0641\\u0631\\u0647\\u0627 \\u0623\\u0648 \\u0639\\u062f\\u0645\\u0647. \\u0648\\u0633\\u062a\\u062c\\u062f \\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062a \\u0645\\u0641\\u064a\\u062f\\u0629 \\u062d\\u0648\\u0644 \\u0627\\u0633\\u062a\\u063a\\u0644\\u0627\\u0644 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062d\\u0627\\u062a \\u0627\\u0644\\u0636\\u064a\\u0642\\u0629 \\u0645\\u0646\\u00a0<b data-stringify-type=\\"bold\\"><a data-sk=\\"tooltip_parent\\" delay=\\"150\\" href=\\"https://docs.google.com/document/d/18tBLtpRKFF3_7LmqSYgQ-X_dk5sM0q6lA_hU2PYLjBc/edit\\" rel=\\"noopener noreferrer\\" target=\\"_blank\\">\\u0647\\u0646\\u0627</a></b>.</p>\\n\\n<p>\\u00a0</p>\\n\\n<p>\\u00a0</p>\\n\\n<p><cms-plugin alt=\\"Picture / Image - 112 \\" title=\\"Picture / Image - 112\\" id=\\"112\\"></cms-plugin></p>\\n\\n<p>\\u00a0</p>\\n\\n<p><img alt=\\"\\u0635\\u0648\\u0631 \\u062f\\u064a\\u0643\\u0648\\u0631\\u0627\\u062a \\u063a\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0639\\u064a\\u0634\\u0629 \\u0627\\u0644\\u0639\\u0627\\u0626\\u0644\\u064a\\u0629 | \\u0645\\u062c\\u0644\\u0629 \\u0633\\u064a\\u062f\\u062a\\u064a\\" src=\\"https://www.sayidaty.net/sites/default/files/styles/1375_scale/public/2018/04/30/3602221-287611670.jpg?itok=iNKY3_od\\"></p>", "placeholder": 119, "parent": null}, "inlines": {}, "children": []}], "page": {"id": 114}}], "creation_date": "2021-10-12T09:32:59.671791Z", "changed_date": "2021-10-12T09:40:20.514770Z", "publication_date": "2021-10-12T09:39:11.340678Z", "publication_end_date": null, "in_navigation": true, "template": "INHERIT", "is_home": false, "languages": ["en"], "page_title": "\\u063a\\u0631\\u0641\\u0629 \\u0627\\u0644\\u0645\\u0639\\u064a\\u0634\\u0629", "menu_title": "\\u063a\\u0631\\u0641\\u0629 \\u0627\\u0644\\u0645\\u0639\\u064a\\u0634\\u0629", "meta_description": "\\u063a\\u0631\\u0641\\u0629 \\u0627\\u0644\\u0645\\u0639\\u064a\\u0634\\u0629", "slug": "ghrf-lmaaysh-2", "path": "ghrf-lmaaysh-2", "absolute_url": "/cms/ghrf-lmaaysh-2/", "redirect": null}',
  photo: 'https://makhzan-dev.manzilik.com/media/magazine/neutral_colors.jpg',
  likes_count: 0,
  comments_count: 0,
  title: 'غرفة المعيشة',
  meta_description: 'غرفة المعيشة',
  is_liked: false,
  categories: [
    {
      __typename: 'Category',
      id: 'ff256f4a-89bc-447b-8e85-a13d996f65c3',
      title: 'غرفة معيشة',
      english_title: 'Living',
      description: '',
      parent: {
        __typename: 'Category',
        id: '4ddee3aa-1109-471c-88d1-56f92be4978e',
        title: 'استعرض الغرف',
        english_title: 'Browse Rooms',
        description: '',
        photo: null,
        status: null,
        created_at: null,
        updated_at: null,
        filters: null,
      },
      photo: 'https://makhzan-dev.manzilik.com/media/Category/2.jpeg',
      status: null,
      created_at: null,
      updated_at: null,
      filters: null,
    },
  ],
  created_at: '2021-10-12T09:33:45.077084Z',
  client: {
    __typename: 'Client',
    id: '11083d68-19fb-4806-bab2-ff8a1b76cb91',
    created_at: null,
    updated_at: null,
    status: 'IS_ACTIVE',
    first_name: 'Adham',
    last_name: 'Balata',
    email: 'adham_sohail2019@yahoo.com',
    mobile: '0599663311',
    gender: null,
    type: null,
    about_me: 'مصمم ديكورات وتشطيبات منزلية \r\nاحتراف في المجال منذ 9 سنوات',
    my_fav_style: '',
    my_next_style: '',
    city_id: null,
    country_id: null,
    city: {
      __typename: 'City',
      id: '5f299f07-42e4-4c2b-b381-6a93b878d6db',
      created_at: null,
      updated_at: null,
      status: null,
      name: 'تبوك',
    },
    country: {
      __typename: 'Country',
      id: 'a8358a7e-4fae-4fbe-8e48-ecefccf440b8',
      created_at: null,
      updated_at: null,
      status: null,
      name: 'السعودية',
      country_flag: null,
    },
    zip: null,
    state: null,
    following_count: null,
    followers_count: null,
    total_review: null,
    profile_image:
      'https://makhzan-dev.manzilik.com/uploads/11083d68-19fb-4806-bab2-ff8a1b76cb91_PROFILE_11083d68-19fb-4806-bab2-ff8a1b76cb91_0',
    facebook: null,
    twitter: null,
    linkedin: null,
    blog: null,
    project_role: null,
  },
};