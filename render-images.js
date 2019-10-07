const puppeteer = require('puppeteer');

const fs = require('fs');
const makeDir = require('make-dir');
const load = require('./src/load');

const pdfPath = process.argv[2] || 'Cytujsvajo_Cytatnik.pdf';

const renderImage = async (browser, cite) => {
  const page = await browser.newPage();

  await page.goto(`http://localhost:1313/cites/${cite}/`, {
    waitUntil: 'networkidle2'
  });
  await page.emulateMedia('print');
  await page.setViewport({
    width: 1080,
    height: 1080
  });

  await makeDir(`site/content/cites/${cite}`);
  await page.screenshot({
    path: `site/content/cites/${cite}/preview.png`,
    clip: {
      x: 0,
      y: 0,
      width: 1080,
      height: 1080,
    }
  });
};

load(pdfPath).then(async (pages) => {
  const browser = await puppeteer.launch();
  const cites = [];

  pages.forEach(({ page, citations }) => {
    citations.forEach(async (data, i) => {
      const citation = i + 1;
      cites.push(`${page}-${citation}`);
    });
  });

  await Promise.all(cites.map(cite => renderImage(browser, cite)));

  await browser.close();
});
