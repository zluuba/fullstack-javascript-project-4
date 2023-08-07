import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { getHtmlPageName } from './naming.js';

const downloadPage = (rawLink, outPath) => {
  const htmlPageName = getHtmlPageName(rawLink);
  const fullOutPath = path.join(outPath, htmlPageName);
  
  return axios.get(rawLink)
    .then((response) => {
      const data = response.data;
      fsp.writeFile(fullOutPath, data)
      return htmlPageName;
    });
};

export default downloadPage;
