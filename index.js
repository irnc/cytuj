const fs = require('fs');
const moment = require('moment');
const makeDir = require('make-dir');
const load = require('./src/load');

const pdfPath = process.argv[2] || 'Cytujsvajo_Cytatnik.pdf';
const initialDate = moment('2019-01-01');

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
        `date: ${initialDate.clone().add(page, 'minutes').add(citation, 'seconds').format()}\n` +
        'cytuj-pdf:\n' +
        `  page: ${page}\n` +
        `  citation: ${citation}\n` +
        'authors:\n' +
        `- ${data.author}\n` +
        `title: "${data.author}"\n` +
        `description: "${data.source}"\n` +
        `locale: "be_BY"\n` +
        'images:\n' +
        `- cites/${page}-${citation}/preview.png\n` +
        '---\n'
      );
    });
  });
});
