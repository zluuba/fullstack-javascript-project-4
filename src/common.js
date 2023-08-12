import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';
import debug from 'debug';

const log = debug('page-loader');

const tags = { img: 'src', link: 'href', script: 'src' };

const getPageName = (url) => url.replace(/htt(p|ps):\/\//, '').replace(/[^\w]/g, '-');

const downloadResource = (url, resourcePath) => axios
  .get(url, { responseType: 'arraybuffer' })
  .then((response) => fsp.writeFile(resourcePath, response.data));

const getResource = (sourceUrl, resourceUrl) => {
  const urlSource = new URL(sourceUrl);
  const urlResource = new URL(resourceUrl, sourceUrl);

  if (!resourceUrl || urlSource.host !== urlResource.host) {
    return {};
  }

  const fullUrl = urlResource.href;
  const urlHostName = getPageName(urlResource.host);
  const resourceName = urlResource.pathname.replace(/[^\w.]/g, '-');

  let fullName = urlHostName + resourceName;
  fullName = resourceName.includes('.') ? fullName : `${fullName}.html`;

  return { url: fullUrl, name: fullName };
};

const getResources = (link, html, resDirName) => {
  const resources = [];
  let newHtml = html;
  const $ = cheerio.load(html);

  Object
    .entries(tags)
    .forEach(([tag, attr]) => $(tag).toArray()
      .forEach((elem) => {
        const url = $(elem).attr(attr);
        const resource = getResource(link, url);

        if (resource.name) {
          log(`Resource was find: "${resource.url}"`);

          resources.push(resource);
          newHtml = newHtml.replace(url, path.join(resDirName, resource.name));
        }
      }));

  return { html: newHtml, resources };
};

export {
  getResources,
  getPageName,
  downloadResource,
};
