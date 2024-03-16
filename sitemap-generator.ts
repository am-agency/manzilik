require('babel-register')({
  presets: ['es2015', 'react'],
});

const router = require('./sitemap-routes.tsx').default;
const Sitemap = require('react-router-sitemap').default;

async function generateSitemap() {
  return new Sitemap(router).build('https://manzilik.com/').save('./public/sitemap.xml');
}

generateSitemap();
