import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import debug from 'debug';
import {
  getResources,
  downloadResources,
  getPageName,
} from './common.js';

const log = debug('page-loader');

const downloadPage = (rawLink, outPath = process.cwd()) => {
  console.log(`Recieved URL: ${rawLink}, Path: ${outPath}`);
  log(`Recieved URL: ${rawLink}, Path: ${outPath}`);
  // fsp.access(outPath)
  //   .catch(() => fsp.mkdir(outPath, { recursive: true }));

  const pageName = getPageName(rawLink);
  const htmlPageName = `${pageName}.html`;
  const resoursesDirName = `${pageName}_files`;

  log(`Getting data from ${rawLink}`);
  return axios.get(rawLink)
    .then((response) => getResources(rawLink, response.data, resoursesDirName))
    .then(({ html, resources }) => {
      const htmlPagePath = path.join(outPath, htmlPageName);
      fsp.writeFile(htmlPagePath, html);

      if (resources) {
        const resourcesPath = path.join(outPath, resoursesDirName);
        fsp.mkdir(resourcesPath, { recursive: true });
        downloadResources(resources, resourcesPath);
      }

      return htmlPageName;
    });
};

export default downloadPage;
