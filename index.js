const pdfjsLib = require('pdfjs-dist');
const fs = require('fs');
const makeDir = require('make-dir');
const parsePage = require('./src/parsePage');

const pdfPath = process.argv[2] || 'Cytujsvajo_Cytatnik.pdf';

const load = async (pdfPath) => {
  const doc = await pdfjsLib.getDocument(pdfPath).promise;  
  const pagePromises = [];
  
  for (let page = 5; page <= 51; page++) {
    const pagePromise = parsePage(doc, page).then(
      ({ citations }) => ({ citations, page })
    );
    
    pagePromises.push(pagePromise);
  }
  
  // Review single page output
  // console.log(JSON.stringify(await parsePage(doc, 7)));
  
  return Promise.all(pagePromises);
};

load(pdfPath).then((pages) => {
  pages.forEach(({ page, citations }) => {
    citations.forEach(async (data, i) => {
      const citation = i + 1;
      const dataDir = `${__dirname}/site/data/pdf/page-${page}`;

      await makeDir(dataDir);

      fs.writeFileSync(
        `${dataDir}/cite-${page}-${citation}.json`,
        // .json files should have formatted JSON for human readability and to
        // allow easy readable diffs on changes to parsing code.
        JSON.stringify(data, null, 2) + '\n'
      );

      // TODO for initial file write is it ok, but only frontmatter should be
      // amended when we would have content in Markdown.
      fs.writeFileSync(
        `${__dirname}/site/content/cites/${page}-${citation}.md`,
        '---\n' +
        'cytuj-pdf:\n' +
        `  page: ${page}\n` +
        `  citation: ${citation}\n` +
        'authors:\n' +
        `- ${data.author}\n` +
        '---\n'
      );
    });
  });
});
