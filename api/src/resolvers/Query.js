const mongoose = require("mongoose");
const Repository = require("../models/repositoryModel");
const Document = require("../models/documentModel");
const { loadFile } = require("../utils");
const R = require("ramda");
const { validations, documentsUtils } = require("../utils");
const { verifyURL } = require("../middlewares");
const {
  pipe,
  groupBy,
  prop,
  values,
  map,
  reduce,
  mergeWith,
  ifElse,
  is,
  applySpec,
  add,
  head,
  dissoc,
  length,
  identity,
} = R;

// This Ramda Pipe will make our brute data return like we want to
const transform = pipe(
  groupBy(prop('extension')),
  map(applySpec({
    extension: pipe(head, prop('extension')),
    count: length,
    data: map(dissoc('extension'), reduce(mergeWith(ifElse(is(Number), add, identity)), {}))
  })),
  values,
);

// This Ramda map will help us to desctructure the information of a Document model because we have
// lines, slocs, bytes nested in an attribute called data. Whe want to unmake to help in transform
// function
const unmake = map((item) => ({
  extension: item.information.extension,
  ...item.information.data,
}));


const Query = {
  async getInfoFromRepository(parent, args, ctx, info) {
    const { url: plaiUrl } = args
    const { repoName, userName } = await verifyURL(plaiUrl)
    
    const repository = await Repository.findOne({user: userName, name: repoName})
    if(!repository) throw new Error("This repository does not exist in our base. please create info first.")
    if(repository?.data) return repository
    const repoFiles = await Document.find({
      repository,
    });
    const files = await Promise.all(
      repoFiles.map(async (file) => {
        // The function loadFile is responsible for returning lines, slocs, bytes
        file.information.data = await documentsUtils.loadFile(file.information.href);
        return file.save();
      })
      );
      
    const bruteInfo = unmake(files);
    const groupedInfo = transform(bruteInfo);
    await Repository.findOneAndUpdate({user: userName, name: repoName}, {data: groupedInfo})
    return { 
      id: repository.id,
      name: repoName,
      user: userName,
      data: groupedInfo
    };
  },

  // Just needs to work on Frontend to improve performance
  async isRepositoryInDatabase(parent, args, ctx, info) {
    const { url } = args;
    const cleanUrl = url.replace(/\s/g, '')
    const [repoName, userName] = cleanUrl
      .split("/")
      .reverse()
      .slice(0, 2);
    const repository = await Repository.findOne({user: userName, name: repoName})
    return repository?.name? { url } : {id: 0, requestedUrl: url};
  },
};

module.exports = Query;
