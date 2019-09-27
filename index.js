const pdfjsLib = require('pdfjs-dist');
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
  // console.log(await parsePage(doc, 7));
  
  return Promise.all(pagePromises);
};

load(pdfPath).then(console.log);
