require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3005;
const logger = require("./src/utils/logger");
const http = require("http");

const { initSocketServer } = require("./src/sockets/socket.server");

const httpServer = http.createServer(app);

initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  logger.info(`ai-buddy service is running on port: ${PORT}`);
});
