const puppeteer = require('puppeteer');
const Promise = require('bluebird');
const fs = require('fs');
const makeDir = require('make-dir');
const load = require('./src/load');

const pdfPath = process.argv[2] || 'Cytujsvajo_Cytatnik.pdf';

const renderImage = async (browser, cite) => {
  const page = await browser.newPage();

  console.log(`rendering http://localhost:1313/cites/${cite}/`);

  await page.goto(`http://localhost:1313/cites/${cite}/`, {
    waitUntil: 'networkidle2'
  });
  await page.emulateMedia('print');
  await page.setViewport({
    width: 1080,
    height: 564,
  });

  await makeDir(`site/content/cites/${cite}`);
  await page.screenshot({
    path: `site/content/cites/${cite}/preview.png`,
    clip: {
      x: 0,
      y: 0,
      width: 1080,
      height: 564,
    }
  });

  console.log(`saved site/content/cites/${cite}/preview.png`);
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

  // renreding all at once errors with `Protocol error (Page.captureScreenshot): Target closed.`
  await Promise.map(cites, cite => renderImage(browser, cite), { concurrency: 6 });
  await browser.close();
});
