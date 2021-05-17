const mongoose = require("mongoose");

const DocumentInformation = new mongoose.Schema({ 
  name: { type: String, required: true },
	extension: { type: String },
  href: { type: String },
  data: { type: Object },
}, { timestamps: true });

const DocumentSchema = new mongoose.Schema(
  {
    information: DocumentInformation,
    repository: { type: mongoose.Schema.Types.ObjectId, ref: "Repository" },
  },
  { timestamps: true }
);

DocumentSchema.index({ name: 1, extension: 1 });
const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;
