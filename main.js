require("dotenv").config();
require("colors");
const http = require("http");
const { createServer } = require("http");
const Server = require("socket.io");
const app = require("./app/app");
const SocketServer = require('./app/config/socket.config')

const PORT = process.env.PORT || 5000;
const server = createServer(app);
const io =  Server(http);

io.on("connection", (socket) => {
  SocketServer(socket);
});

const [major, minor] = process.versions.node.split(".").map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log(
    "Please go to nodejs.org and download version 8 or greater. 👌\n "
  );
  process.exit();
}

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(
    `server is listening on http://localhost:${PORT} - for REST`.green.bold
  );
  console.log(
    `server is listening on http://localhost:${PORT}${process.env.GRAPHQL_URL} - for GRAPHQL`
      .green.bold
  );
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
