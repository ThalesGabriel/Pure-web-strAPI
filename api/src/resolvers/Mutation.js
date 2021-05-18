const { documentsUtils, validations } = require("../utils");
const Repository = require("../models/repositoryModel");
const Document = require("../models/documentModel");
const { verifyURL } = require("../middlewares");

const mutations = {
  async createInfoRepository(parent, args, ctx, info) {
    console.log("\nLoading...\n");
    const { url: plaiUrl } = args
    const { repoName, userName, url } = await verifyURL(plaiUrl)
    const isRepository = await Repository.findOne({ name: repoName, user: userName })
    if(isRepository) throw new Error('This repository already exists.')
    const repository = await Repository.create({ name: repoName, user: userName });

    const files = await documentsUtils.getAll(`${userName}/${repoName}`)
    Promise.all(
      files.map(async file => {
        const getAttrFile = file.split(" - ")
        const name = getAttrFile[0]
        const href = getAttrFile[1]
        const extension = getAttrFile[2]

        return Document.create({
          repository,
          information: {
            name,
            href,
            extension,
          }
        });
      })
    )
    .then((saved_documents) => {
      repository.addDocument(saved_documents);
    });

    return url;
  },
};

module.exports = mutations;
