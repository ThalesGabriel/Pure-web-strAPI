const cookieParser = require("cookie-parser");
const { mongooseConnect } = require("./mongo");
const { createServer, startServer } = require("./server");
require("dotenv").config({ path: ".env" });

const initApp = () => {
    const server = createServer();
    server.express.use(cookieParser());
    mongooseConnect()
    startServer(server)
    return server
}

module.exports = { initApp }