# Як былі створаны страніцы

- разбор PDF
- запіс у `site/data` і `site/content`

Каб паўтарыць разбор трэба выканаць `node index.js`.

# Прагляд перад публікацыяй

`(cd site && hugo serve)`

Прагляд па спасылке http://localhost:1313/

# Дызайн

- Галоўная старонка `site/themes/ananke/layouts/index.html`

# Публікацыя

- `(cd site/themes/ananke/src && npm i)`
- `(cd site/themes/ananke/src && npm start)`
- `(cd site && HUGO_ENV=production hugo)`
- `node render-images.js`
- `git subtree push --prefix site/public origin gh-pages`
