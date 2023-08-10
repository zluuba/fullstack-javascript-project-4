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
  dir: '/ru-hexlet-io-courses_files/',
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

const fixtureDir = getFixturePath(resources.dir);

beforeAll(async () => {
  nock.disableNetConnect();

  htmlAfter = await readThisFile(getFixturePath(resources.html));
  htmlBefore = await readThisFile(path.join(fixtureDir, resources.html));
  pngResource = await readThisFile(path.join(fixtureDir, resources.png));
  cssResource = await readThisFile(path.join(fixtureDir, resources.css));
  jsResource = await readThisFile(path.join(fixtureDir, resources.js));
});

beforeEach(async () => {
  tempDir = os.tmpdir();
});

test('downloadPage main', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, htmlBefore)
    .get('/assets/application.css')
    .reply(200, cssResource)
    .get('/assets/professions/nodejs.png')
    .reply(200, pngResource)
    .get('/packs/js/runtime.js')
    .reply(200, jsResource);

  const loadedPageName = await downloadPage('https://ru.hexlet.io/courses', tempDir);
  expect(loadedPageName).toEqual(resources.html);

  const expectedHtml = await readThisFile(path.join(tempDir, resources.html));
  expect(expectedHtml).toEqual(htmlAfter);

  const expectedCss = await fsp.readFile(path.join(tempDir, resources.dir, resources.css), 'utf-8');
  expect(expectedCss).toEqual(cssResource);

  const expectedPng = await readThisFile(path.join(tempDir, resources.dir, resources.png));
  expect(expectedPng).toEqual(pngResource);

  const expectedJs = await fsp.readFile(path.join(tempDir, resources.dir, resources.js), 'utf-8');
  expect(expectedJs).toEqual(jsResource);
});

test('Error: wrong outpath', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, htmlBefore);

  return expect(async () => {
    const expected = await downloadPage('https://ru.hexlet.io/courses', '/wrong/');
    expect(expected).toEqual(undefined);
  }).rejects.toThrow();
});

test('Error: page loading - 404 status code', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(404);

  return expect(async () => {
    const expected = await downloadPage('https://ru.hexlet.io/courses', tempDir);
    expect(expected).toEqual(undefined);
  }).rejects.toThrow();
});

test('Error: page loading - 500 status code', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(500);

  return expect(async () => {
    const expected = await downloadPage('https://ru.hexlet.io/courses', tempDir);
    expect(expected).toEqual(undefined);
  }).rejects.toThrow();
});

test('Error: resourses loading - 404 status code', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, htmlBefore)
    .get('/assets/application.css')
    .reply(404)
    .get('/assets/professions/nodejs.png')
    .reply(404)
    .get('/packs/js/runtime.js')
    .reply(404);

  return expect(async () => {
    const expected = await downloadPage('https://ru.hexlet.io/courses', tempDir);
    expect(expected).toEqual(undefined);
  }).rejects.toThrow();
});

test('Error: page loading - network error', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .replyWithError('Network error');

  return expect(async () => {
    const expected = await downloadPage('https://ru.hexlet.io/courses', tempDir);
    expect(expected).toEqual(undefined);
  }).rejects.toThrow();
});

afterEach(() => {
  nock.cleanAll();
});
