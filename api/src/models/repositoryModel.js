const mongoose = require("mongoose");
const Document = require("./documentModel");

const RepositorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: String, required: true },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    data: { type: Object },
  },
  { timestamps: true }
);

RepositorySchema.methods.addDocument = async function (listOfDocuments) {
	this.documents = [...this.documents, ...listOfDocuments];
  await this.save()
};

const Repository = mongoose.model("Repository", RepositorySchema);

module.exports = Repository;
