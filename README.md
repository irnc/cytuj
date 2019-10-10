# Пачатак працы

- `git clone https://github.com/irnc/cytuj.git`
- `cd cytuj`
- `git submodule update --init`
- `(cd site && hugo serve)`

# Як былі створаны страніцы

- цытатнік ў PDF быў разобраны на цытаты
- цытаты запісаны ў `site/data` і `site/content`

Каб паўтарыць разбор трэба выканаць:

- `npm run download`
- `npm install && node index.js`.

# Прагляд перад публікацыяй

`(cd site && hugo serve)`

Прагляд па спасылке http://localhost:1313/

# Дызайн

- Галоўная старонка `site/layouts/index.html`

# Публікацыя

- `(cd site/themes/ananke/src && npm install)`
- `(cd site/themes/ananke/src && npm start)`
- `(cd site && HUGO_ENV=production hugo)`
- `npm install && node render-images.js`
- `git subtree push --prefix site/public origin gh-pages`
