import { AR } from '../../../../locales/constants';

export const mockCategories = (lang: string) => [
  {
    title: lang === AR ? 'مقاعد' : 'Chairs',
    photo: 'https://st.hzcdn.com/fimgs/06c1c5dd0f905c7f_3167-w200-h200-b1-p0--.jpg',
    slug: 'chairs',
  },
  {
    title: lang === AR ? 'أرائك ومقاطع' : 'Sofas & Sectionals',
    photo: 'https://st.hzcdn.com/fimgs/df11b1160f93163e_4562-w200-h200-b1-p0--.jpg',
    slug: 'sofas-sectionals',
  },
  {
    title: lang === AR ? 'طاولات قهوة' : 'Coffee Tables',
    photo: 'https://st.hzcdn.com/fimgs/3281497007211e30_2148-w300-h300-b1-p10--.jpg',
    slug: 'coffee-tables',
  },
  {
    title: lang === AR ? 'مكتبات' : 'Desks',
    photo: 'https://st.hzcdn.com/fimgs/2c6119b90f155239_7061-w200-h200-b1-p0--.jpg',
    slug: 'desks',
  },
  {
    title: lang === AR ? 'مساند أرجل' : 'Bar Stools & Counter Stools',
    photo: 'https://st.hzcdn.com/fimgs/45b13d640ea31f42_8871-w200-h200-b1-p0--.jpg',
    slug: 'bar-stools',
  },
  {
    title: lang === AR ? 'خزائن' : 'Dressers',
    photo: 'https://st.hzcdn.com/fimgs/e1e19cad0ece7457_8520-w200-h200-b1-p0--.jpg',
    slug: 'dressers',
  },
];
