import fsp from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';

import downloadPage from '../src/core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readThisFile = (filename) => fsp.readFile(filename, 'utf-8');

const resources = {
  dir: 'ru-hexlet-io-courses_files',
  html: 'ru-hexlet-io-courses.html',
  png: 'ru-hexlet-io-assets-professions-nodejs.png',
  css: 'ru-hexlet-io-assets-application.css',
  js: 'ru-hexlet-io-packs-js-runtime.js',
};

let tempDir;

let htmlAfter;
let htmlBefore;
let pngResource;
let cssResource;
let jsResource;

nock.disableNetConnect();

beforeAll(async () => {
  htmlAfter = await readThisFile(getFixturePath(resources.html));

  const fixtureDir = getFixturePath(resources.dir);
  htmlBefore = await readThisFile(path.join(fixtureDir, resources.html));
  pngResource = await readThisFile(path.join(fixtureDir, resources.png));
  cssResource = await readThisFile(path.join(fixtureDir, resources.css));
  jsResource = await readThisFile(path.join(fixtureDir, resources.js));
});

test('downloadPage main', async () => {
  nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .reply(200, htmlBefore)
    .get(/\/assets\/professions\/nodejs\.png/)
    .reply(200, pngResource)
    .get(/\/assets\/application\.css/)
    .reply(200, cssResource)
    .get(/\/packs\/js\/runtime\.js/)
    .reply(200, jsResource);

  tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));

  await downloadPage('https://ru.hexlet.io/courses', tempDir);

  // const expectedPng = await fsp.readFile(path.join(tempDir, resources.dir, resources.png), 'utf-8');
  // const expectedCss = await fsp.readFile(path.join(tempDir, resources.dir, resources.css), 'utf-8');
  // const expectedJs = await fsp.readFile(path.join(tempDir, resources.dir, resources.js), 'utf-8');
  const expectedHtml = await readThisFile(path.join(tempDir, resources.html));

  // expect(expectedPng).toEqual(pngResource);
  // expect(expectedCss).toEqual(cssResource);
  // expect(expectedJs).toEqual(jsResource);
  expect(expectedHtml).toEqual(htmlAfter);
});
