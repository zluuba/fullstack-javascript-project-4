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
  log(`Recieved URL: ${rawLink}, Path: ${outPath}`);

  const pageName = getPageName(rawLink);
  const htmlPageName = `${pageName}.html`;
  const resoursesDirName = `${pageName}_files`;

  log(`Getting data from ${rawLink}`);
  return fsp.access(outPath)
    .then(() => axios.get(rawLink))
    .then((response) => getResources(rawLink, response.data, resoursesDirName))
    .then(({ html, resources }) => {
      log(`Recieved resources: ${resources}`);
      const htmlPagePath = path.join(outPath, htmlPageName);
      fsp.writeFile(htmlPagePath, html);
      log(`Writing HTML-file: ${htmlPagePath}`);

      if (resources) {
        const resourcesPath = path.join(outPath, resoursesDirName);
        fsp.mkdir(resourcesPath, { recursive: true });
        log(`Resource dir: ${resourcesPath}`);
        downloadResources(resources, resourcesPath);
      }

      log('Finishing program... \n');
      return htmlPageName;
    });
};

export default downloadPage;
