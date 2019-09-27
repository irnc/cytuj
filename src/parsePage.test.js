/**
 * @jest-environment node
 */

const pdfjsLib = require('pdfjs-dist');
const parsePage = require('./parsePage');

const loadDoc = () => {
  return pdfjsLib.getDocument('Cytujsvajo_Cytatnik.pdf').promise;
};

test('parses content ignoring empty unidentified items', async () => {
  const doc = await loadDoc();
  const { citations: citations6 } = await parsePage(doc, 6);
  
  expect(citations6[0]).toHaveProperty(
    'content',
    'Недапушчэнне салідарнасці – гэта спроба індывіда ўтрымацца' +
    ' на адлегласці, якая забяспечыць яму ці ёй мажлівасць і надалей' +
    ' заставацца ўпэўненымі ва ўласнай выключнасці,' +
    ' якая гарантуецца менавіта неперасячэннем з іншымі,' +
    ' у чым бы там ні было.'
  );
});

test('parses content with 65.1969 alignment', async () => {
  const doc = await loadDoc();
  const { citations: citations5 } = await parsePage(doc, 5);
  
  expect(citations5[0]).toHaveProperty(
    'content',
    'Чалавек носіць сваё неба з сабой.'
  );
});

test('parses author on page with section title', async () => {
  const doc = await loadDoc();
  const { citations: citations5 } = await parsePage(doc, 5);
  
  expect(citations5[0]).toHaveProperty(
    'author',
    'Уладзімір Караткевіч'
  );
});

test('parses versed citations', async () => {
  const doc = await loadDoc();
  const { citations: citations23 } = await parsePage(doc, 23);
  
  expect(citations23[0]).toHaveProperty(
    'content',
    'Неразумна ісці і не бачыць хоць нейкае мэты;\n' +
    'А ці варта ісці да святла не свайго, а чужога?\n' +
    'Можа каменем лепей ляжаць на зямлі запаветнай?\n' +
    'Пэўна, лепей, ды не адпускае цяжкая дарога.'
  );

  const { citations: citations24 } = await parsePage(doc, 24);
  
  expect(citations24[0]).toHaveProperty(
    'content',
    'Сярод усіх вятроў\nАдзін спадарожны\nСярод усіх шляхоў\nАдзін незваротны'
  );
});

test('verse detection should not break prose', async () => {
  const doc = await loadDoc();
  const { citations: citations22 } = await parsePage(doc, 22);
  
  expect(citations22[1]).toHaveProperty(
    'content',
    'Памяць, як сабака, усё рве і рве ланцуг, рыскае, кідаецца ў бакі,' +
    ' шукаючы след, здаецца, знаходзіць яго, бярэ, набывае веры' +
    ' і губляе яе.'
  );
  expect(citations22[2]).toHaveProperty(
    'content',
    'Можна адбудаваць жыццё на любых руінах, толькі не на руінах светапогляду.'
  );

  const { citations: citations23 } = await parsePage(doc, 23);
  
  expect(citations23[1]).toHaveProperty(
    'content',
    'Вялікі прынцып доблесці ў тым, каб, паступова загартоўваючы' +
    ' душу, спачатку змяняць бачнае і мінучае, каб пасля яго можна' +
    ' было занядбаць. Мяккі той, каму дарагая бацькаўшчына,' +
    ' устойлівы той, каму ўвесь свет – бацькаўшчына, і дасканалы той,' +
    ' каму свет – чужына».'
  );
});
