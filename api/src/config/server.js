const { GraphQLServer } = require("graphql-yoga");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require('graphql-type-json');
const compression = require("compression");
const responseTime = require("response-time");
const Mutation = require("../resolvers/Mutation");
const Query = require("../resolvers/Query");
const { verifyURL } = require("../middlewares");

function createServer() {
  const server = new GraphQLServer({
    typeDefs: __dirname + "/schema.graphql",
    resolvers: {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Mutation,
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    middlewares: [],
    context: async (params) => {
      return { params };
    },
  });

  server.express.use(compression());

  server.express.use(responseTime());

  return server;
}

const startServer = (server) => {
  server.start(
    {
      cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
      },
    },
    (deets) => {
      console.log(`🚀 Server ready at http://localhost:${deets.port}`);
    }
  );
}

module.exports = { createServer, startServer };
