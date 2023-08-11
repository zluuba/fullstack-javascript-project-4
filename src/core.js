import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import debug from 'debug';
import Listr from 'listr';
import prettier from 'prettier';
import {
  getResources,
  getPageName,
  downloadResource,
} from './common.js';

const log = debug('page-loader');

const downloadPage = (sourceUrl, outPath = process.cwd()) => {
  log(`Recieved URL: "${sourceUrl}", Path: "${outPath}"`);

  const pageName = getPageName(sourceUrl);

  const htmlPageName = `${pageName}.html`;
  const htmlPagePath = path.join(outPath, htmlPageName);

  const resoursesDirName = `${pageName}_files`;
  const resourcesDirPath = path.join(outPath, resoursesDirName);

  let resourcesData;
  log(`Getting data from ${sourceUrl}`);

  return axios.get(sourceUrl)
    .then((response) => getResources(sourceUrl, response.data, resoursesDirName))
    .then((data) => {
      resourcesData = data.resources;
      return prettier.format(data.html, { parser: 'html' });
    })
    .then((formattedHtml) => {
      log(`Writing HTML-file to: ${htmlPagePath}`);
      return fsp.writeFile(htmlPagePath, formattedHtml);
    })
    .then(() => {
      log(`Creating resource dir: ${resourcesDirPath}`);
      return fsp.mkdir(resourcesDirPath, { recursive: true });
    })
    .then(() => {
      const tasks = resourcesData.map(({ url, name }) => {
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
    .then(() => log('Finishing program...'))
    .then(() => htmlPageName);
};

export default downloadPage;
