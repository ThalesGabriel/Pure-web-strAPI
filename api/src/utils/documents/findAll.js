const fetch = require("node-fetch");
const R = require('ramda');

const findDocuments = async (url) => {
  console.log(`\nhttps://github.com/${url}\n`);
  const content = await fetch(`https://github.com/${url}`);
  const htmlText = await content.text();

  var listOfDocuments = htmlText.match(
    /<a class="js-navigation-open Link--primary"(.*?)<\/a>/g
  );

  // Documents represented by href
  const hrefs = listOfDocuments.map(
    (s) => /href=(["'])(.*?)"/g.exec(new String(s))[0]
  );

  // Get title, bool if document is folder or file and extension if document is a file
  const transformData = hrefs.map((s) => {
    let href = /"(.*?)"/g.exec(new String(s))[0];
    let formatedHref = href.substring(1, href.length - 1).split("/");

    const title = formatedHref[formatedHref.length - 1];
    const isFolder = formatedHref.includes("tree");

    const result = {
      isFolder,
      title,
      extension: false,
      href: href.substring(1, href.length - 1),
    };

    isFolder ? null : (result.extension = title.split(".").reverse()[0]);

    return result;
  });

  // Group by kind of document
  const documentsGroupedByKind = R.groupBy(R.prop("isFolder"), transformData);

  return documentsGroupedByKind;
};

const findAll = async (url) => {
  const allDocuments = { 
    user: url.split("/").reverse()[1], 
    repository: url.split("/").reverse()[0], 
    info: { 
      urlList: [url], 
      foldersToIterate: [url], 
      folders: [],
      files: [],
    } 
  };

  let count = 0
  while (count < allDocuments.info.foldersToIterate.length) {
    const newRef = allDocuments.info.foldersToIterate[count]
    let newDocumentsGroupedByKind = await findDocuments(newRef.href || newRef)
    if(newDocumentsGroupedByKind.false) {
      allDocuments.info.files = [...newDocumentsGroupedByKind.false, ...allDocuments.info.files]
      allDocuments.info.documents = [...newDocumentsGroupedByKind.false, ...allDocuments.info.files]
    }
    if(newDocumentsGroupedByKind.true) {
      allDocuments.info.folders = [...allDocuments.info.foldersToIterate, ...newDocumentsGroupedByKind.true];
      allDocuments.info.foldersToIterate = [...allDocuments.info.foldersToIterate, ...newDocumentsGroupedByKind.true];
      allDocuments.info.urlList = [...allDocuments.info.urlList, newRef.href];
      allDocuments.info.documents = [...newDocumentsGroupedByKind.true, ...allDocuments.info.folders]
    }
    if(!newDocumentsGroupedByKind) {
      count += 1
      continue
    }
    count += 1
  }
  return allDocuments
}

module.exports = findAll
