import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import debug from 'debug';
import Listr from 'listr';
import {
  getResources,
  getPageName,
  downloadResource,
} from './common.js';

const log = debug('page-loader');

const downloadPage = (rawLink, outPath = process.cwd()) => {
  log(`Recieved URL: ${rawLink}, Path: ${outPath}`);

  const pageName = getPageName(rawLink);

  const htmlPageName = `${pageName}.html`;
  const htmlPagePath = path.join(outPath, htmlPageName);

  const resoursesDirName = `${pageName}_files`;
  const resourcesDirPath = path.join(outPath, resoursesDirName);

  log(`Getting data from ${rawLink}`);

  return fsp.access(outPath)
    .then(() => axios.get(rawLink))
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Network error. Cannot download HTML-page.');
      }
      return getResources(rawLink, response.data, resoursesDirName);
    })
    .then(({ html, resources }) => {
      log(`Writing HTML-file: ${htmlPagePath}`);
      fsp.writeFile(htmlPagePath, html)
        .catch((e) => {
          throw new Error(e);
        });
      return resources;
    })
    .then((resources) => {
      if (resources) {
        log(`Creating resource dir: ${resourcesDirPath}`);
        fsp.mkdir(resourcesDirPath, { recursive: true })
          .catch((e) => {
            throw new Error(e);
          });
      }
      return resources;
    })
    .then((resources) => {
      const tasks = resources.map(({ url, name }) => {
        const fullPath = path.join(resourcesDirPath, name);

        return {
          title: `Downloading resource: ${url}`,
          task: () => downloadResource(url, fullPath)
            .catch(() => {}),
        };
      });

      const listr = new Listr(tasks, { concurrent: true });
      return listr.run();
    })
    .then(() => log('Finishing program... \n'))
    .then(() => htmlPageName);
};

export default downloadPage;
