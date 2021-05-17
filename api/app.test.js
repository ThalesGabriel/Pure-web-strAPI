const mongoose = require("mongoose");
const Repository = require("./src/models/repositoryModel");
const Document = require("./src/models/documentModel");
const mutations = require("./src/resolvers/Mutation");

beforeAll(async () => {
  await mongoose.connect(
    global.__MONGO_URI__,
    { useNewUrlParser: true, useCreateIndex: true },
    (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});

describe("Insert repository", () => {
  it("should insert a repository into collection", async () => {
    const mockRepository = { name: "SVG-Iterativo", user: "ThalesGabriel" };
    await Repository.create(mockRepository);
    
    const insertedRepository = await Repository.findOne({ name: "SVG-Iterativo" });
    expect(insertedRepository.user).toEqual(mockRepository.user);
  });
});

describe("Insert document", () => {
  it("should insert a document into collection", async () => {
    const mockDocument = {
      information: {
        name: "renovate.json",
        extesion: "json",
        href: "https://github.com/dotansimha/graphql-yoga/blob/master/renovate.json",
      },
    };
    await Document.create(mockDocument);

    const insertedDocument = await Document.findOne({
      "information.name": "renovate.json",
    });
    expect(insertedDocument.information.href).toEqual(
      mockDocument.information.href
    );
  });
});

describe("Invalid create information", () => {
  it("should try to create information for an existing repository", async () => {
    try {
      const args = { url: 'ThalesGabriel/SVG-Iterativo' }
      await mutations.createInfoRepository({}, args)
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe("This repository already exists.");
    }
  });
});

