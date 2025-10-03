const { Server } = require("socket.io");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const agent = require("../agent/agent");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // socket middleware
  io.use((socket, next) => {
    const cookies = socket.handshake.headers?.cookie;

    const { token } = cookies ? cookie.parse(cookies) : {};

    if (!token) {
      return next(new Error("Token not provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;
      socket.token = token;

      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    logger.info("a user connected");

    socket.on("message", async (data) => {
      const agentResponse = await agent.invoke(
        {
          messages: [
            {
              role: "user",
              content: data,
            },
          ],
        },
        {
          metadata: { token: socket.token },
        }
      );

      const lastMessage =
        agentResponse.messages[agentResponse.messages.length - 1];

      socket.emit("message", lastMessage.content);
    });

    socket.on("disconnect", () => {
      logger.info("a user disconnected");
    });
  });
}

module.exports = { initSocketServer };
