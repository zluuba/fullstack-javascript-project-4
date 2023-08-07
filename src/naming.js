const getHtmlPageName = (url) => {
  const urlBody = url.replace('http://', '').replace('https://', '');
  const htmlPageName = `${urlBody.replace(/[^\w]/g, "-")}.html`;
  return htmlPageName;
};

export {
  getHtmlPageName,
};
