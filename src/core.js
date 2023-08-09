import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import {
  getResources,
  downloadResources,
  getPageName,
} from './common.js';

const downloadPage = (rawLink, outPath) => {
  fsp.access(outPath)
    .catch(() => fsp.mkdir(outPath, { recursive: true }));

  const pageName = getPageName(rawLink);
  const htmlPageName = `${pageName}.html`;
  const resoursesDirName = `${pageName}_files`;

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
