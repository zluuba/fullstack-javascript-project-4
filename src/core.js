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
  // fsp.access(outPath)
  //   .catch(() => fsp.mkdir(outPath, { recursive: true }));

  const pageName = getPageName(rawLink);
  const htmlPageName = `${pageName}.html`;
  const resoursesDirName = `${pageName}_files`;

  log(`Getting data from ${rawLink}`);
  return axios.get(rawLink)
    .then((response) => getResources(rawLink, response.data, resoursesDirName))
    .then(({ html, resources }) => {
      log(`Recieved resources: ${resources}`);
      const htmlPagePath = path.join(outPath, htmlPageName);
      fsp.writeFile(htmlPagePath, html);
      log(`Writing file: ${htmlPagePath}`);

      if (resources) {
        const resourcesPath = path.join(outPath, resoursesDirName);
        fsp.mkdir(resourcesPath, { recursive: true });
        log(`Creating res dir: ${resourcesPath}`);
        downloadResources(resources, resourcesPath);
      }

      log('Finishing program... \n');
      return htmlPageName;
    });
};

export default downloadPage;
