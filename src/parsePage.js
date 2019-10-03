const _ = require('lodash');

const isLeftAligned = (item) => {
  // 65.1968
  // 65.19680000000001
  // 65.1969
  return [651968, 651969].includes(Math.round(item.transform[4] * 10000));
};

const identified = (descriptor) => {
  const { page, chapter, content, author, source } = descriptor;
  return page || chapter || content || author || source;
};

const describeItems = (textContent) => {
  const { items, styles } = textContent;
  const latestFont = Object.keys(styles).slice(-1)[0];
  const descriptors = [];

  // https://mozilla.github.io/pdf.js/api/draft/global.html#TextItem
  items.forEach((item) => {
    const previous = (descriptors[descriptors.length - 1] || {}).item;
    const leftAligned = isLeftAligned(item);
    const author = leftAligned && (!previous || !isLeftAligned(previous));

    const descriptor = {
      page: item.transform[5] === 28.3464,
      chapter: item.transform[4] === 238.4855,
      // for odd and even pages respectivelly
      content: leftAligned && !author,
      author,
      source: item.fontName === latestFont,
      item,
    };

    // filter out unidentified
    if (identified(descriptor)) {
      descriptors.push(descriptor);
    }
  });

  return descriptors;
};

const assembleCitations = (descriptors) => {
  const citations = [];
  const reset = () => {
    return {
      content: '',
      source: '',
      contentItems: [],
    };
  };
  let citation = reset();

  descriptors.forEach((desc, i) => {
    const next = descriptors[i + 1];

    if (desc.author) {
      citation.author = desc.item.str;

      return;
    }
    
    if (desc.source) {
      // Could be multi-item, e.g. citation 3 on page 7 
      citation.source = `${citation.source}${desc.item.str}`;
      
      // Complete citation when next descriptor is not source.
      if (!next || !next.source) {
        let separator = '';

        // Less than 160 mean width should be treated like a verse, not prose:
        // - width 160 was selected experimentally from page 23,
        // - slice is needed to cut last line (which could be short in prose).
        if (_.meanBy(citation.contentItems.slice(0, -1), 'width') < 160) {
          // Sepa newlines for verse lines
          separator = '\n';
        }
        
        citation.content = _.map(citation.contentItems, 'str').join(separator);

        // Replace Unicode character 'NO-BREAK SPACE' (U+00A0) with space for
        // consistency (e.g. on page 22, second citation, between "і губляе").
        citation.content = citation.content.replace(/\u00A0/, ' ');

        delete citation.contentItems;

        citations.push(citation);
        citation = reset();
      }
      
      return;
    }
    
    if (desc.content) {
      citation.contentItems.push(desc.item);
    }
  });

  return citations;
};

const parsePage = async (doc, pageNum) => {
  const page = await doc.getPage(pageNum);  
  const content = await page.getTextContent();
  const descriptors = describeItems(content);
  
  // NOTE useful for debug
  // descriptors.forEach(i => console.log(i));
  
  return {
    citations: assembleCitations(descriptors),
  };
};

module.exports = parsePage;
