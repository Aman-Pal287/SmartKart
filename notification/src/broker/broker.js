const amqplib = require("amqplib");
const logger = require("../utils/logger");

let channel, connection;

async function connect() {
  if (connection) return connection;

  try {
    connection = await amqplib.connect(process.env.RABBIT_URL);

    connection.on("error", (err) => {
      logger.error("RabbitMQ connection error", err);
      connection = null;
      channel = null;
    });

    connection.on("close", () => {
      logger.warn("RabbitMQ connection closed, retrying...");
      connection = null;
      channel = null;
      setTimeout(connect, 5000); // retry after 5s
    });

    logger.info("Connected to RabbitMQ");
    channel = await connection.createChannel();
  } catch (error) {
    logger.error("Error connecting to RabbitMQ: ", error);
    setTimeout(connect, 5000); // retry if fail
  }
}

async function publishToQueue(queueName, data = {}) {
  if (!channel || !connection) await connect();

  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  console.log("Message sent to queue: ", queueName, data);
}

async function subscribeToQueue(queueName, callback) {
  if (!channel || !connection) await connect();

  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      await callback(data);
      channel.ack(msg);
    }
  });
}

module.exports = {
  connect,
  channel,
  connection,
  publishToQueue,
  subscribeToQueue,
};
