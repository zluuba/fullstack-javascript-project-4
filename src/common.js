import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';

const tags = { img: 'src', link: 'href', script: 'src' };

const getPageName = (url) => url.replace(/htt(p|ps):\/\//, '').replace(/[^\w]/g, '-');

const getResource = (link, resourceUrl) => {
  const urlLink = new URL(link);
  const url = new URL(resourceUrl, link);

  if (!resourceUrl || !url.pathname.includes('.') || urlLink.host !== url.host) {
    return {};
  }

  const fullUrl = url.href;

  const urlHostName = getPageName(url.host);
  const resourceName = url.pathname.replace(/[^\w.]/g, '-');
  const fullName = `${urlHostName}${resourceName}`;

  return { url: fullUrl, name: fullName };
};

const getResources = (link, html, resDirName) => {
  let newHtml = html;
  const $ = cheerio.load(html);
  const resources = [];

  Object
    .entries(tags)
    .forEach(([tag, attr]) => {
      const links = $(tag).toArray();
      links.forEach((elem) => {
        const url = $(elem).attr(attr);
        const resource = getResource(link, url);

        if (resource.name) {
          resources.push(resource);
          newHtml = newHtml.replace(url, path.join(resDirName, resource.name));
        }
      });
    });

  return { html: newHtml, resources };
};

const downloadResources = (resources, outDir) => resources
  .forEach((resource) => {
    const { url, name } = resource;
    const fullPath = path.join(outDir, name);

    axios.get(url)
      .then((response) => fsp.writeFile(fullPath, response.data));
  });

export {
  getResources,
  downloadResources,
  getPageName,
};